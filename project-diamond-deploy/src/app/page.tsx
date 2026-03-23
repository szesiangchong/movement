"use client";

import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";

const fmt = (n: number) => "S$" + (Math.abs(n) >= 1000 ? (n / 1000).toFixed(1) + "M" : n.toFixed(0) + "K");
const fmtK = (n: number) => "S$" + Math.round(n).toLocaleString("en-SG");
const TABS = ["Value to Shareholders", "Earnout Calculator", "HoldCo Structure", "Transaction Timeline", "Term Sheet"];

// ════════════════════════════════════════════════════════════════════════
// TAB 1 — VALUE TO SHAREHOLDERS
// ════════════════════════════════════════════════════════════════════════
function ValueTab() {
  const [entryEV, setEntryEV] = useState(40000);
  const [ebitda2026, setEbitda2026] = useState(7900);
  const [totalCash, setTotalCash] = useState(10395);
  const [existDebt, setExistDebt] = useState(2701);
  const [opMin, setOpMin] = useState(2000);
  const [nwcPct, setNwcPct] = useState(10);
  const [revenue2025, setRevenue2025] = useState(28100);
  const [earnoutPct, setEarnoutPct] = useState(20);
  const [sponsorPct, setSponsorPct] = useState(70);
  const [revCAGR, setRevCAGR] = useState(5);
  const [ebitdaMargin, setEbitdaMargin] = useState(26);
  const [holdYears, setHoldYears] = useState(5);
  const [selectedExitMult, setSelectedExitMult] = useState<number | null>(null);

  const c = useMemo(() => {
    const mgmtPct = 100 - sponsorPct;
    const entryMult = entryEV / ebitda2026;
    const nwcReserve = (nwcPct / 100) * revenue2025;
    const netCash = Math.max(0, totalCash - existDebt - nwcReserve - opMin);
    const equityValue = entryEV + netCash;
    const deferredTotal = (earnoutPct / 100) * entryEV;
    const upfrontEV = entryEV - deferredTotal;
    const exit70_upfront = (sponsorPct / 100) * (upfrontEV + netCash);
    const exit70_earnout = (sponsorPct / 100) * deferredTotal;
    const exit70_total = exit70_upfront + exit70_earnout;
    const rollover30 = (mgmtPct / 100) * equityValue;

    // Projections — management case revenue, then apply EBITDA margin
    const mgmtRevenue = [28100, 34300, 37450, 41600, 46700, 52350]; // FY25, Yr1-5
    const projections = [];
    for (let y = 0; y <= holdYears; y++) {
      const rev = y < mgmtRevenue.length ? mgmtRevenue[y] : mgmtRevenue[mgmtRevenue.length - 1] * Math.pow(1 + revCAGR / 100, y - mgmtRevenue.length + 1);
      const ebitda = rev * (ebitdaMargin / 100);
      projections.push({ year: y === 0 ? "FY25" : `Yr ${y}`, revenue: Math.round(rev), ebitda: Math.round(ebitda) });
    }
    const exitEbitda = projections[holdYears].ebitda;
    const revCagr = Math.pow(projections[holdYears].revenue / projections[0].revenue, 1 / holdYears) - 1;

    // Sensitivity multiples
    const multiples = [entryMult, 6, 7, 8];
    // dedupe and sort
    const uniqueMults = Array.from(new Set(multiples.map(m => Math.round(m * 10) / 10))).sort((a, b) => a - b);

    const annualFCF = exitEbitda * 0.83 * 0.55;
    const cumFCF = annualFCF * holdYears * 0.7;
    const exitNetCash = netCash + cumFCF;

    const sensitivity = uniqueMults.map(mult => {
      const exitEV = exitEbitda * mult;
      const exitEquity = exitEV + exitNetCash;
      const exitRoll = (mgmtPct / 100) * exitEquity;
      const moic = exitRoll / rollover30;
      const irr = Math.pow(moic, 1 / holdYears) - 1;
      return { mult, exitEV, exitEquity, exitRoll, moic, irr };
    });

    const activeSens = selectedExitMult !== null
      ? sensitivity.find(s => s.mult === selectedExitMult) || sensitivity[0]
      : sensitivity[0];

    return {
      entryMult, nwcReserve, netCash, equityValue, deferredTotal, upfrontEV,
      exit70_upfront, exit70_earnout, exit70_total,
      rollover30, mgmtPct, projections, exitEbitda, exitNetCash,
      sensitivity, activeSens, revCagr,
    };
  }, [entryEV, ebitda2026, totalCash, existDebt, opMin, nwcPct, revenue2025, earnoutPct, sponsorPct, revCAGR, ebitdaMargin, holdYears, selectedExitMult]);

  const Inp = ({ label, value, set, step = 100, suffix = "" }: any) => (
    <div className="flex flex-col gap-0.5">
      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-1">
        <input type="number" value={value} onChange={e => set(+e.target.value)} step={step}
          className="w-20 px-1.5 py-1 text-sm border border-gray-200 rounded bg-white focus:ring-1 focus:ring-blue-400" />
        <span className="text-[10px] text-gray-400">{suffix}</span>
      </div>
    </div>
  );

  const chart1Data = [
    { name: `${sponsorPct}% Exit - Upfront`, value: c.exit70_upfront / 1000, fill: "#1e40af" },
    { name: `${sponsorPct}% of ${fmtK(c.deferredTotal)} Earnout`, value: c.exit70_earnout / 1000, fill: "#93c5fd" },
    { name: `${c.mgmtPct}% Rollover Equity`, value: c.rollover30 / 1000, fill: "#059669" },
  ];
  const chart2Data = [
    { name: "Entry (Today)", value: c.rollover30 / 1000, fill: "#d1d5db" },
    { name: `Exit (Year ${holdYears})`, value: c.activeSens.exitRoll / 1000, fill: "#059669" },
  ];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <Inp label="Entry EV" value={entryEV} set={setEntryEV} step={1000} suffix="S$K" />
        <Inp label="EBITDA 2026E" value={ebitda2026} set={setEbitda2026} step={100} suffix="S$K" />
        <Inp label="Earnout %" value={earnoutPct} set={setEarnoutPct} step={5} suffix="%" />
        <Inp label="Sponsor %" value={sponsorPct} set={setSponsorPct} step={5} suffix="%" />
        <Inp label="Total Cash" value={totalCash} set={setTotalCash} step={100} suffix="S$K" />
        <Inp label="Debt" value={existDebt} set={setExistDebt} step={100} suffix="S$K" />
        <Inp label="NWC % Rev" value={nwcPct} set={setNwcPct} step={1} suffix="%" />
        <Inp label="Op. Min" value={opMin} set={setOpMin} step={100} suffix="S$K" />
        <Inp label="Revenue" value={revenue2025} set={setRevenue2025} step={100} suffix="S$K" />
        <Inp label="Rev CAGR" value={revCAGR} set={setRevCAGR} step={1} suffix="%" />
        <Inp label="EBITDA Mgn" value={ebitdaMargin} set={setEbitdaMargin} step={1} suffix="%" />
        <Inp label="Hold Yrs" value={holdYears} set={setHoldYears} step={1} suffix="yrs" />
      </div>

      {/* EV to Equity Bridge */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Enterprise Value to Equity Value Bridge</h3>
        <div className="flex items-center gap-0 overflow-x-auto text-center text-xs">
          {[
            { label: "Enterprise\nValue", value: entryEV, color: "bg-blue-600 text-white" },
            { label: "(-) Debt", value: -existDebt, color: "bg-red-100 text-red-700", sign: "" },
            { label: `(-) NWC\n${nwcPct}% Rev`, value: -c.nwcReserve, color: "bg-red-100 text-red-700", sign: "" },
            { label: "(-) Op.\nMinimum", value: -opMin, color: "bg-red-100 text-red-700", sign: "" },
            { label: "(+) Cash\non BS", value: totalCash, color: "bg-green-100 text-green-700", sign: "+" },
            { label: "Equity\nValue", value: c.equityValue, color: "bg-blue-800 text-white", sign: "=" },
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && i < 5 && <div className="text-gray-300 text-lg px-1.5 font-light">{item.sign || ""}</div>}
              {i === 5 && <div className="text-gray-400 text-xl px-2 font-bold">=</div>}
              <div className={`rounded-lg px-3 py-2.5 min-w-[85px] ${item.color} shadow-sm`}>
                <div className="font-bold text-sm">{fmtK(Math.abs(item.value))}</div>
                <div className="mt-0.5 leading-tight opacity-80 whitespace-pre-line" style={{fontSize:10}}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Entry: {c.entryMult.toFixed(1)}x FY2026E EBITDA | Net cash: {fmtK(c.netCash)}</p>
      </div>

      {/* Day-1 Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Day-1 Value Split (S$M)</h3>
          <p className="text-[11px] text-gray-400 mb-3">{sponsorPct}% receives upfront equity + pro-rata net cash. Earnout = {sponsorPct}% of {fmtK(c.deferredTotal)} total deferred ({fmtK(c.exit70_earnout)}).</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart layout="vertical" data={chart1Data} margin={{ left: 5, right: 55 }}>
              <XAxis type="number" tickFormatter={v => `${v.toFixed(0)}M`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chart1Data.map((d, i) => <Cell key={i} fill={d.fill} />)}
                <LabelList dataKey="value" position="right" formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} style={{ fontSize: 11, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">{sponsorPct}% upfront (incl. net cash)</span><span className="font-mono font-bold text-blue-800">{fmtK(c.exit70_upfront)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{sponsorPct}% of {fmtK(c.deferredTotal)} earnout (if met)</span><span className="font-mono text-blue-400">{fmtK(c.exit70_earnout)}</span></div>
            <div className="flex justify-between border-t pt-1"><span className="font-semibold">{sponsorPct}% total (max)</span><span className="font-mono font-bold">{fmtK(c.exit70_total)}</span></div>
            <div className="text-[10px] text-gray-400 mt-1 italic">Total deal earnout: {fmtK(c.deferredTotal)} ({earnoutPct}% of EV). {sponsorPct}% share = {fmtK(c.exit70_earnout)}. {c.mgmtPct}% ({fmtK(c.deferredTotal - c.exit70_earnout)}) reinvested into rollover equity.</div>
            <div className="flex justify-between mt-1"><span className="text-green-700">{c.mgmtPct}% rollover</span><span className="font-mono font-bold text-green-700">{fmtK(c.rollover30)}</span></div>
          </div>
        </div>

        {/* Sensitivity Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-1">{c.mgmtPct}% Rollover Sensitivity</h3>
          <p className="text-[11px] text-gray-400 mb-3">Click a row to update the rollover chart and projections below.</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="py-1.5 px-2 text-left font-semibold">Exit Multiple</th>
                <th className="py-1.5 px-2 text-right font-semibold">Exit EV</th>
                <th className="py-1.5 px-2 text-right font-semibold">{c.mgmtPct}% Value</th>
                <th className="py-1.5 px-2 text-right font-semibold">MoIC</th>
                <th className="py-1.5 px-2 text-right font-semibold">IRR</th>
              </tr>
            </thead>
            <tbody>
              {c.sensitivity.map((s, i) => {
                const isActive = s.mult === c.activeSens.mult;
                const isEntry = Math.abs(s.mult - c.entryMult) < 0.05;
                return (
                  <tr key={i} onClick={() => setSelectedExitMult(s.mult)}
                    className={`cursor-pointer transition-all ${isActive ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                    <td className="py-2 px-2 font-mono font-bold">
                      {s.mult.toFixed(1)}x {isEntry && <span className="text-[9px] font-normal text-gray-400 ml-1">(entry)</span>}
                    </td>
                    <td className="py-2 px-2 text-right font-mono">{fmt(s.exitEV)}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-green-700">{fmt(s.exitRoll)}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold">{s.moic.toFixed(1)}x</td>
                    <td className="py-2 px-2 text-right font-mono font-bold">{(s.irr * 100).toFixed(0)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rollover chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-1">{c.mgmtPct}% Rollover &mdash; Entry vs Exit at {c.activeSens.mult.toFixed(1)}x</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart layout="vertical" data={chart2Data} margin={{ left: 5, right: 55 }}>
              <XAxis type="number" tickFormatter={v => `${v.toFixed(0)}M`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chart2Data.map((d, i) => <Cell key={i} fill={d.fill} />)}
                <LabelList dataKey="value" position="right" formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} style={{ fontSize: 11, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">{c.activeSens.moic.toFixed(1)}x</div>
            <div className="text-xs text-gray-500">MoIC over {holdYears} years</div>
            <div className="text-xl font-bold text-green-600 mt-1">{(c.activeSens.irr * 100).toFixed(0)}% IRR</div>
          </div>
        </div>
      </div>

      {/* Projections Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Business Projections &amp; Exit Valuation ({c.activeSens.mult.toFixed(1)}x exit) &mdash; <span className="text-blue-600">Management Case</span></h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-2 font-semibold text-gray-500">S$&apos;000</th>
                {c.projections.map((p, i) => (
                  <th key={i} className={`text-right py-2 px-2 font-semibold ${i === 0 ? 'text-gray-400' : 'text-gray-700'}`}>{p.year}</th>
                ))}
                <th className="text-right py-2 px-2 font-semibold text-blue-700 border-l-2 border-blue-200">Exit</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-500">CAGR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1.5 px-2 text-gray-600">Revenue <span className="text-[10px] text-blue-500">(Mgmt)</span></td>
                {c.projections.map((p, i) => <td key={i} className="text-right py-1.5 px-2 font-mono">{(p.revenue / 1000).toFixed(1)}M</td>)}
                <td className="text-right py-1.5 px-2 border-l-2 border-blue-200"></td>
                <td className="text-right py-1.5 px-2 font-mono text-gray-500">{(c.revCagr * 100).toFixed(1)}%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-1.5 px-2 text-gray-600">EBITDA ({ebitdaMargin}%)</td>
                {c.projections.map((p, i) => <td key={i} className="text-right py-1.5 px-2 font-mono font-semibold">{(p.ebitda / 1000).toFixed(1)}M</td>)}
                <td className="text-right py-1.5 px-2 border-l-2 border-blue-200"></td>
                <td className="text-right py-1.5 px-2 font-mono text-gray-500">{(c.revCagr * 100).toFixed(1)}%</td>
              </tr>
              <tr className="border-t-2 border-gray-200">
                <td className="py-1.5 px-2 font-semibold text-blue-800">Exit EV ({c.activeSens.mult.toFixed(1)}x)</td>
                {c.projections.map((_, i) => <td key={i}></td>)}
                <td className="text-right py-1.5 px-2 font-mono font-bold text-blue-800 border-l-2 border-blue-200">{fmt(c.activeSens.exitEV)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 text-gray-600">(+) Est. Net Cash</td>
                {c.projections.map((_, i) => <td key={i}></td>)}
                <td className="text-right py-1.5 px-2 font-mono border-l-2 border-blue-200">{fmt(c.exitNetCash)}</td>
                <td></td>
              </tr>
              <tr className="bg-blue-50">
                <td className="py-1.5 px-2 font-bold text-blue-900">Exit Equity (100%)</td>
                {c.projections.map((_, i) => <td key={i}></td>)}
                <td className="text-right py-1.5 px-2 font-mono font-bold text-blue-900 border-l-2 border-blue-200">{fmt(c.activeSens.exitEquity)}</td>
                <td></td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 text-green-700 font-semibold">{c.mgmtPct}% Share</td>
                {c.projections.map((_, i) => <td key={i}></td>)}
                <td className="text-right py-1.5 px-2 font-mono font-bold text-green-700 border-l-2 border-blue-200">{fmt(c.activeSens.exitRoll)}</td>
                <td></td>
              </tr>
              <tr className="bg-green-50">
                <td className="py-1.5 px-2 font-bold text-green-800">MoIC / IRR</td>
                {c.projections.map((_, i) => <td key={i}></td>)}
                <td className="text-right py-1.5 px-2 font-mono font-bold text-green-800 border-l-2 border-blue-200">{c.activeSens.moic.toFixed(1)}x / {(c.activeSens.irr * 100).toFixed(0)}%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 2 — EARNOUT CALCULATOR (with sliders)
// ════════════════════════════════════════════════════════════════════════
function EarnoutTab() {
  const [entryEV, setEntryEV] = useState(40000);
  const [earnoutPct, setEarnoutPct] = useState(20);
  const [yr1Hurdle, setYr1Hurdle] = useState(7500);
  const [yr2Hurdle, setYr2Hurdle] = useState(8000);
  const [yr1Actual, setYr1Actual] = useState(7900);
  const [yr2Actual, setYr2Actual] = useState(8500);

  const c = useMemo(() => {
    const deferredTotal = (earnoutPct / 100) * entryEV;
    const yr1Tranche = 0.3 * deferredTotal;
    const yr2Tranche = 0.7 * deferredTotal;
    const yr1Floor = yr1Hurdle * 0.8;
    const yr2Floor = yr2Hurdle * 0.8;
    const yr1Pay = yr1Actual >= yr1Hurdle ? yr1Tranche : yr1Actual >= yr1Floor ? yr1Tranche * ((yr1Actual - yr1Floor) / (yr1Hurdle - yr1Floor)) : 0;
    const yr1Carry = yr1Tranche - yr1Pay;
    const yr2Pool = yr2Tranche + yr1Carry;
    const yr2Pay = yr2Actual >= yr2Hurdle ? yr2Pool : yr2Actual >= yr2Floor ? yr2Pool * ((yr2Actual - yr2Floor) / (yr2Hurdle - yr2Floor)) : 0;
    const totalPaid = yr1Pay + yr2Pay;
    const totalSaved = deferredTotal - totalPaid;
    const yr1Status = yr1Actual >= yr1Hurdle ? "met" : yr1Actual >= yr1Floor ? "partial" : "missed";
    const yr2Status = yr2Actual >= yr2Hurdle ? "met" : yr2Actual >= yr2Floor ? "partial" : "missed";
    return { deferredTotal, yr1Tranche, yr2Tranche, yr1Floor, yr2Floor, yr1Pay, yr1Carry, yr2Pool, yr2Pay, totalPaid, totalSaved, yr1Status, yr2Status };
  }, [entryEV, earnoutPct, yr1Hurdle, yr2Hurdle, yr1Actual, yr2Actual]);

  const Inp = ({ label, value, set, step = 100, suffix = "" }: any) => (
    <div className="flex flex-col gap-0.5">
      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <input type="number" value={value} onChange={e => set(+e.target.value)} step={step}
        className="w-24 px-2 py-1 text-sm border border-gray-200 rounded bg-white" />
      <span className="text-[10px] text-gray-400">{suffix}</span>
    </div>
  );

  const statusColors = { met: "bg-green-500", partial: "bg-yellow-500", missed: "bg-red-500" };
  const statusLabels = { met: "MET", partial: "PARTIAL", missed: "MISSED" };

  const Slider = ({ label, value, set, min, max, hurdle, floor, status }: any) => {
    const pctPos = ((value - min) / (max - min)) * 100;
    const hurdlePct = ((hurdle - min) / (max - min)) * 100;
    const floorPct = ((floor - min) / (max - min)) * 100;
    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">{label}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${statusColors[status as keyof typeof statusColors]}`}>{statusLabels[status as keyof typeof statusLabels]}</span>
        </div>
        <div className="relative mb-2">
          {/* Track background */}
          <div className="h-3 rounded-full bg-gray-200 relative overflow-visible">
            {/* Floor marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10" style={{ left: `${floorPct}%` }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-red-500 whitespace-nowrap">Floor {fmtK(floor)}</div>
            </div>
            {/* Hurdle marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-green-600 z-10" style={{ left: `${hurdlePct}%` }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-green-600 whitespace-nowrap">Target {fmtK(hurdle)}</div>
            </div>
            {/* Fill */}
            <div className={`absolute top-0 left-0 bottom-0 rounded-full transition-all ${status === 'met' ? 'bg-green-400' : status === 'partial' ? 'bg-yellow-400' : 'bg-red-300'}`}
              style={{ width: `${Math.min(100, pctPos)}%` }} />
          </div>
          <input type="range" min={min} max={max} step={50} value={value} onChange={e => set(+e.target.value)}
            className="w-full -mt-2.5 relative z-20 appearance-none bg-transparent cursor-pointer"
            style={{ height: 20 }} />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">{fmtK(min)}</span>
          <span className="font-mono font-bold text-lg">{fmtK(value)}</span>
          <span className="text-gray-400">{fmtK(max)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <Inp label="Entry EV" value={entryEV} set={setEntryEV} step={1000} suffix="S$K" />
        <Inp label="Earnout %" value={earnoutPct} set={setEarnoutPct} step={5} suffix="% of EV" />
        <Inp label="Yr1 Hurdle" value={yr1Hurdle} set={setYr1Hurdle} step={100} suffix="S$K EBITDA" />
        <Inp label="Yr2 Hurdle" value={yr2Hurdle} set={setYr2Hurdle} step={100} suffix="S$K EBITDA" />
      </div>

      {/* Structure boxes */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{fmtK(c.deferredTotal)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Deferred<br />({earnoutPct}% of {fmtK(entryEV)})</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{fmtK(c.yr1Tranche)}</div>
          <div className="text-xs text-gray-500 mt-1">Yr 1 Tranche<br />(30% of deferred)</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{fmtK(c.yr2Tranche)}</div>
          <div className="text-xs text-gray-500 mt-1">Yr 2 Tranche<br />(70% of deferred)</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        <Slider label="Year 1 Actual EBITDA" value={yr1Actual} set={setYr1Actual}
          min={5000} max={12000} hurdle={yr1Hurdle} floor={c.yr1Floor} status={c.yr1Status} />
        <Slider label="Year 2 Actual EBITDA" value={yr2Actual} set={setYr2Actual}
          min={5000} max={12000} hurdle={yr2Hurdle} floor={c.yr2Floor} status={c.yr2Status} />
      </div>

      {/* Payout details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2">Year 1 Payout</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Tranche</span><span className="font-mono">{fmtK(c.yr1Tranche)}</span></div>
            <div className="flex justify-between font-bold text-green-700"><span>Paid</span><span className="font-mono">{fmtK(c.yr1Pay)}</span></div>
            {c.yr1Carry > 0 && <div className="flex justify-between text-orange-600"><span>Carries to Yr2</span><span className="font-mono">{fmtK(c.yr1Carry)}</span></div>}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2">Year 2 Payout</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Tranche + Carry</span><span className="font-mono">{fmtK(c.yr2Pool)}</span></div>
            <div className="flex justify-between font-bold text-green-700"><span>Paid</span><span className="font-mono">{fmtK(c.yr2Pay)}</span></div>
          </div>
        </div>
      </div>

      {/* Total — dynamic */}
      <div className="flex items-center justify-between bg-blue-900 text-white rounded-xl p-5">
        <div>
          <div className="text-sm font-bold">Total Earnout Paid</div>
          <div className="text-xs opacity-70">of {fmtK(c.deferredTotal)} deferred</div>
        </div>
        <div className="text-3xl font-bold">{fmtK(c.totalPaid)}</div>
      </div>
      {c.totalSaved > 0 && <p className="text-xs text-green-700 font-semibold text-center">Sponsor saves {fmtK(c.totalSaved)} vs paying full deferred consideration</p>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 3 — HOLDCO STRUCTURE
// ════════════════════════════════════════════════════════════════════════
function HoldcoTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Current */}
        <div className="bg-white rounded-xl border-2 border-red-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h3 className="font-bold text-sm text-red-800">CURRENT STRUCTURE</h3>
          </div>
          {/* Three separate boxes side by side */}
          <div className="space-y-3">
            {[
              { name: "Carats & Co", rev: "S$20M", desc: "Signage Design & Build", color: "from-red-500 to-red-600",
                holders: ["Albert 23.3%", "Raymond 23.3%", "Charlie 20%", "Ann 17.1%", "TH 8.7%", "Min Min 7.7%"] },
              { name: "Gleamedia", rev: "S$6M", desc: "OOH Media", color: "from-orange-500 to-orange-600",
                holders: ["Geng Hao 30%", "Raymond 22%", "Ann 22%", "TH 22%", "Keith 4%"] },
              { name: "Adactive", rev: "S$2M", desc: "Digital Kiosks / Software", color: "from-amber-500 to-amber-600",
                holders: ["Yu Hang 50%", "Ann 25%", "TH 12.5%", "Geng Hao 12.5%"] },
            ].map(entity => (
              <div key={entity.name} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className={`bg-gradient-to-r ${entity.color} px-4 py-2 flex items-center justify-between`}>
                  <div className="text-white font-bold text-sm">{entity.name}</div>
                  <div className="text-white text-xs opacity-80">{entity.rev} | {entity.desc}</div>
                </div>
                <div className="px-4 py-2 bg-white flex flex-wrap gap-1">
                  {entity.holders.map(h => (
                    <span key={h} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600">{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-red-700">
            <p className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">&#x2718;</span> No holding company &mdash; 3 separate legal entities</p>
            <p className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">&#x2718;</span> Different shareholders and % across all 3 entities</p>
            <p className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">&#x2718;</span> Below-market intercompany pricing (Carats subsidises both)</p>
            <p className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5">&#x2718;</span> Complex dividend/cash extraction across 3 shareholder registers</p>
          </div>
        </div>

        {/* Proposed */}
        <div className="bg-white rounded-xl border-2 border-green-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="font-bold text-sm text-green-800">PROPOSED STRUCTURE</h3>
          </div>

          {/* HoldCo */}
          <div className="border-2 border-green-400 rounded-xl p-4 bg-gradient-to-b from-green-50 to-emerald-50 text-center">
            <div className="font-bold text-lg text-green-900">NewCo HoldCo</div>
            <div className="flex justify-center gap-3 mt-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-bold">Sponsor 70%</span>
              <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-bold">Management 30%</span>
            </div>
          </div>

          {/* Two branches */}
          <div className="flex justify-center gap-16 mt-1">
            <div className="w-px h-4 bg-green-300"></div>
            <div className="w-px h-4 bg-green-300"></div>
          </div>
          <div className="flex justify-center gap-4 mt-0 mb-1">
            <div className="w-24 h-px bg-green-300"></div>
          </div>
          <div className="flex justify-center gap-16 mt-0">
            <div className="w-px h-3 bg-green-300"></div>
            <div className="w-px h-3 bg-green-300"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Carats branch with Adactive nested */}
            <div className="space-y-0">
              <div className="border-2 border-green-300 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-3 py-2">
                  <div className="text-white font-bold text-sm">Carats & Co</div>
                  <div className="text-green-100 text-[10px]">100% subsidiary of HoldCo</div>
                </div>
                <div className="p-2 bg-white">
                  <div className="text-center text-green-300 text-[10px] mb-1">|</div>
                  <div className="border border-amber-300 rounded-lg p-2 bg-amber-50">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center text-white text-[9px] font-bold">A</div>
                      <div>
                        <div className="font-semibold text-xs">Adactive</div>
                        <div className="text-[9px] text-gray-400">100% sub of Carats</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gleamedia branch */}
            <div className="border-2 border-green-300 rounded-xl overflow-hidden self-start">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2">
                <div className="text-white font-bold text-sm">Gleamedia</div>
                <div className="text-orange-100 text-[10px]">100% subsidiary of HoldCo</div>
              </div>
              <div className="p-2 bg-white text-[10px] text-gray-500">
                OOH Media &amp; Advertising
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1.5 text-xs text-green-700">
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Single cap table &mdash; clean 70/30 at HoldCo</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Minority buyout at agreed valuation (pre-completion)</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Adactive under Carats (operational integration)</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Arm&apos;s-length transfer pricing policy</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Centralised treasury, single board, unified strategy</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Clean exit path &mdash; single entity sale or IPO-ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 4 — TIMELINE (left-aligned labels)
// ════════════════════════════════════════════════════════════════════════
function TimelineTab() {
  const phases = [
    { task: "Submit Draft LOI", start: 1, dur: 2, color: "#1e40af", group: "LOI" },
    { task: "LOI Negotiation & Signing", start: 2, dur: 2, color: "#3b82f6", group: "LOI" },
    { task: "Standalone BU Margins", start: 4, dur: 4, color: "#8b5cf6", group: "DD" },
    { task: "Normalised EBITDA", start: 5, dur: 5, color: "#a78bfa", group: "DD" },
    { task: "NWC Peg & Completion Mechanism", start: 6, dur: 4, color: "#c4b5fd", group: "DD" },
    { task: "Legal & Structural DD", start: 4, dur: 8, color: "#ddd6fe", group: "DD" },
    { task: "SPA Drafting", start: 10, dur: 4, color: "#059669", group: "SPA" },
    { task: "Key-Man & Gen-2 Transition", start: 10, dur: 4, color: "#7c3aed", group: "SPA" },
    { task: "Completion & Close", start: 14, dur: 2, color: "#10b981", group: "Close" },
  ];
  const maxW = 16;
  const gc = { LOI: "bg-blue-100 text-blue-700", DD: "bg-purple-100 text-purple-700", SPA: "bg-green-100 text-green-700", Close: "bg-emerald-100 text-emerald-700" };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="overflow-x-auto">
          <div style={{ minWidth: 700 }}>
            {/* Month headers */}
            <div className="flex mb-1">
              <div style={{ width: 240, flexShrink: 0 }} />
              {Array.from({ length: maxW }, (_, i) => (
                <div key={i} className="flex-1 text-center text-gray-400" style={{ fontSize: 9, borderLeft: '1px solid #f3f4f6' }}>W{i + 1}</div>
              ))}
            </div>
            <div className="flex mb-3">
              <div style={{ width: 240, flexShrink: 0 }} />
              {["Month 1", "Month 2", "Month 3", "Month 4"].map((m, i) => (
                <div key={i} className="text-center text-xs font-semibold text-gray-500" style={{ flex: 4, borderLeft: '1px solid #e5e7eb' }}>{m}</div>
              ))}
            </div>

            {phases.map((p, i) => (
              <div key={i} className="flex items-center mb-2">
                {/* LEFT-ALIGNED labels */}
                <div style={{ width: 240, flexShrink: 0, paddingLeft: 4, paddingRight: 8 }} className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${gc[p.group as keyof typeof gc]}`}>{p.group}</span>
                  <span className="text-xs font-medium text-left">{p.task}</span>
                </div>
                <div className="flex-1 relative" style={{ height: 28 }}>
                  {Array.from({ length: maxW }, (_, w) => (
                    <div key={w} className="absolute top-0 bottom-0" style={{ left: `${(w / maxW) * 100}%`, width: 1, background: w % 4 === 0 ? '#e5e7eb' : '#f9fafb' }} />
                  ))}
                  <div className="absolute top-1 flex items-center px-2 rounded-md shadow-sm" style={{
                    left: `${((p.start - 1) / maxW) * 100}%`,
                    width: `${(p.dur / maxW) * 100}%`,
                    height: 22, backgroundColor: p.color,
                  }}>
                    <span className="text-white font-bold" style={{ fontSize: 10 }}>{p.dur}w</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DD cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { num: 1, title: "Standalone BU Margins", desc: "Strip inter-BU expenses and subsidised installation. Carats does 100% of installations at below-market. Validate true standalone GP and EBITDA for SOTP.", bg: "#faf5ff", border: "#e9d5ff", accent: "#7c3aed" },
          { num: 2, title: "Normalised EBITDA", desc: "Adjust for family compensation (S$2.0M across 6 members), one-off stamp duty (S$985K in FY22), property-related items, post-transaction cost structure.", bg: "#faf5ff", border: "#e9d5ff", accent: "#7c3aed" },
          { num: 3, title: "NWC Peg & Completion", desc: "NWC swung from 2.8% (FY24) to 13.1% (FY25). Other Payables dropped S$1.5M. Aged AR/AP analysis needed. Set normalised peg for SPA completion mechanism.", bg: "#faf5ff", border: "#e9d5ff", accent: "#7c3aed" },
          { num: 4, title: "Key-Man & Gen-2 Transition", desc: "Parallel with SPA. Map which leaders own which client relationships. Design retention/incentive for Yu Hang (80% pipeline origination), Albert, Raymond.", bg: "#eef2ff", border: "#c7d2fe", accent: "#4f46e5" },
        ].map(card => (
          <div key={card.num} className="rounded-xl p-4 border" style={{ backgroundColor: card.bg, borderColor: card.border }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: card.accent }}>{card.num}</span>
              <h4 className="text-sm font-bold" style={{ color: card.accent }}>{card.title}</h4>
            </div>
            <p className="text-xs text-gray-600 ml-8">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 5 — TERM SHEET (SPV Rollover Mechanics)
// ════════════════════════════════════════════════════════════════════════
function TermSheetTab() {
  const EV = 40000;
  const EBITDA = 7172;
  const MGMT_VALUE = EV * 0.30; // 12,000
  const [levX, setLevX] = useState(1.5);

  const scenarios = useMemo(() => {
    return [0, 1.0, 1.5, 2.0].map(lev => {
      const debt = lev * EBITDA;
      const totalEquity = EV - debt;
      const movementEquity = totalEquity * 0.70;
      const mgmtEquity = totalEquity * 0.30;
      const mgmtCashOut = MGMT_VALUE - mgmtEquity;
      const netCashToShareholders = EV - mgmtEquity;
      const addlCashOut = mgmtCashOut; // same number, clearer label
      const totalPotentialCash = netCashToShareholders + 8606;
      return { lev, debt, totalEquity, movementEquity, mgmtEquity, mgmtCashOut, netCashToShareholders, addlCashOut, totalPotentialCash };
    });
  }, []);

  const active = scenarios.find(s => s.lev === levX) || scenarios[1];

  const Section = ({ title, tag, children, defaultOpen = true }: { title: string; tag: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    const tagColor = tag === "CORE" ? "bg-amber-100 text-amber-800" : tag === "TBD" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600";
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left">
          <span className="font-bold text-sm text-gray-900 flex-1">{title}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tagColor}`}>{tag}</span>
          <span className={`text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`}>▼</span>
        </button>
        {open && <div className="px-5 pb-5 border-t border-gray-100">{children}</div>}
      </div>
    );
  };

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[160px_1fr] gap-2 py-2 border-b border-gray-50 text-sm">
      <dt className="font-semibold text-gray-500 text-xs uppercase tracking-wide pt-0.5">{label}</dt>
      <dd className="text-gray-800">{children}</dd>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-wide">Term Sheet Outline</h2>
            <p className="text-blue-200 text-xs mt-0.5">IC Discussion Draft — Strictly Confidential</p>
          </div>
          <div className="flex gap-4 text-xs text-blue-200">
            <span>EV: S$40.0M</span>
            <span>~5.6x FY25 EBITDA</span>
            <span>March 2026</span>
          </div>
        </div>
      </div>

      {/* Section 1: Transaction Overview */}
      <Section title="1. Transaction Overview" tag="STANDARD">
        <div className="mt-3">
          <Row label="Target">Carats & Co Pte Ltd, Gleamedia Pte Ltd, and Adactive Pte Ltd <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px] font-bold ml-1">Adactive TBD</span></Row>
          <Row label="Acquirer">Newly formed HoldCo (SPV) — Movement 70% / Management 30%</Row>
          <Row label="Transaction">100% acquisition of all operating entities into HoldCo. All existing shareholders exit into cash and/or rollover equity at agreed group valuation.</Row>
          <Row label="Enterprise Value">S$40,000,000 (~5.6x unaudited FY2025 EBITDA of S$7,172,000)</Row>
          <Row label="Basis">Cash-free, debt-free, subject to normalised working capital</Row>
        </div>
        <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 text-xs text-gray-600">
          <strong className="text-gray-800">Valuation note:</strong> Subject to independent financial due diligence. Final EV may be adjusted based on audited FY2025 results and working capital true-up at completion.
        </div>
      </Section>

      {/* Section 2: Strategic Rationale */}
      <Section title="2. Strategic Rationale" tag="STANDARD">
        <div className="mt-3">
          <Row label="Thesis">Platform play in Singapore DOOH & signage — consolidating design-build, media, and digital kiosk capabilities under unified governance with patient capital. Under unified ownership, explore regional expansion into Malaysia and Australia as natural next markets.</Row>
          <Row label="Key Drivers">
            <div className="space-y-1.5">
              <p>(a) Contracted backlog of S$43M (26 months revenue) anchored by Stellar Ace/Lifestyle through 2033-2034</p>
              <p>(b) Gleamedia growing (1.18x book-to-bill) as media layer on the group&apos;s installed out-of-home media screens base</p>
              <p>(c) Adactive&apos;s existing digital kiosk and interactive signage technology can be offered to third-party OOH operators (e.g., Clear Channel, JCDecaux, Moove Media) — currently captive within the group, but under unified governance becomes a scalable B2B SaaS/licensing channel for touch-screen wayfinding, content management, and audience analytics across operator networks</p>
            </div>
          </Row>
          <Row label="Risk to Diligence">
            <div className="space-y-1.5">
              <p>(i) Carats new order intake slowed to 0.75x book-to-bill in FY2025 — requires pipeline deep-dive</p>
              <p>(ii) Co-develop 5-year growth plan with management: revenue targets, margin roadmap, regional expansion, investment requirements</p>
              <p>(iii) Business unit review on standalone basis — strip intercompany subsidies, validate true unit economics per entity</p>
            </div>
          </Row>
        </div>
      </Section>

      {/* Section 3: SPV STRUCTURE & ROLLOVER — CORE */}
      <Section title="3. SPV Structure & Management Rollover" tag="CORE">
        <p className="text-xs text-gray-500 mt-3 mb-4">
          Movement acquires 70% of HoldCo. Management rolls existing equity into 30% of HoldCo. Acquisition debt at the SPV level reduces total equity required — the difference between management&apos;s <strong className="text-gray-800">value</strong> (30% of EV) and their <strong className="text-gray-800">required equity contribution</strong> (30% of equity after debt) is returned as <strong className="text-green-700">cash at close</strong>.
        </p>

        {/* Leverage buttons */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs font-bold text-gray-500">Leverage:</span>
          {[0, 1.0, 1.5, 2.0].map(l => (
            <button key={l} onClick={() => setLevX(l)}
              className={`px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all ${levX === l ? 'bg-blue-900 text-white border-blue-900' : 'border-gray-300 text-gray-600 hover:border-blue-900'}`}>
              {l === 0 ? 'No Debt' : `${l.toFixed(1)}x EBITDA`}
            </button>
          ))}
        </div>

        {/* ═══ 6-STEP WALKTHROUGH ═══ */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-5">
          <h3 className="text-base font-bold text-blue-900 mb-5">How It Works — Step by Step</h3>

          {/* Step 1 */}
          <div className="flex gap-4 mb-1">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div className="w-0.5 flex-1 bg-blue-200 min-h-[16px]"></div>
            </div>
            <div className="pb-5 flex-1">
              <div className="text-sm font-bold text-blue-900 mb-1">A new holding company (&quot;HoldCo&quot;) is created</div>
              <div className="text-xs text-gray-500 mb-2">An umbrella company that will own all three businesses. Movement owns 70%, management owns 30%.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-center">
                  <div className="px-5 py-3 rounded-lg bg-gradient-to-r from-blue-900 to-blue-700 text-white text-center min-w-[180px]">
                    <div className="font-bold text-base">HoldCo</div>
                    <div className="text-blue-200 text-[10px]">New Holding Company</div>
                  </div>
                </div>
                <div className="flex justify-center gap-10 mt-2.5">
                  <div className="text-center"><div className="text-lg font-bold text-blue-900">70%</div><div className="text-[10px] text-gray-500">Movement</div></div>
                  <div className="text-center"><div className="text-lg font-bold text-green-600">30%</div><div className="text-[10px] text-gray-500">Management</div></div>
                </div>
                <div className="text-center text-gray-400 my-2">↓ &nbsp; owns &nbsp; ↓</div>
                <div className="flex justify-center gap-3">
                  <div className="border-2 border-red-300 rounded-lg px-3 py-2 bg-white text-center flex-1 max-w-[140px]"><div className="text-xs font-bold text-red-600">Carats & Co</div><div className="text-[9px] text-gray-400">Signage</div></div>
                  <div className="border-2 border-orange-300 rounded-lg px-3 py-2 bg-white text-center flex-1 max-w-[140px]"><div className="text-xs font-bold text-orange-600">Gleamedia</div><div className="text-[9px] text-gray-400">OOH Media</div></div>
                  <div className="border-2 border-yellow-300 rounded-lg px-3 py-2 bg-white text-center flex-1 max-w-[140px]"><div className="text-xs font-bold text-yellow-600">Adactive</div><div className="text-[9px] text-gray-400">Digital Kiosks</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 mb-1">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div className="w-0.5 flex-1 bg-blue-200 min-h-[16px]"></div>
            </div>
            <div className="pb-5 flex-1">
              <div className="text-sm font-bold text-blue-900 mb-1">HoldCo raises S$40M to buy the group</div>
              <div className="text-xs text-gray-500 mb-2">The money comes from equity (Movement + management) and optionally a bank loan. The more HoldCo borrows, the less equity is needed.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-[11px] font-semibold text-gray-500 mb-1.5">SOURCES OF FUNDS</div>
                <div className="flex h-9 rounded-md overflow-hidden mb-2">
                  <div className="bg-blue-900 flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.movementEquity / EV) * 100}%` }}>
                    {(active.movementEquity / EV) * 100 > 14 ? fmt(active.movementEquity) : ''}
                  </div>
                  <div className="bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.mgmtEquity / EV) * 100}%` }}>
                    {(active.mgmtEquity / EV) * 100 > 14 ? fmt(active.mgmtEquity) : ''}
                  </div>
                  {active.debt > 0 && (
                    <div className="bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.debt / EV) * 100}%` }}>
                      {(active.debt / EV) * 100 > 10 ? fmt(active.debt) : ''}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 text-[10px] text-gray-500 mb-3">
                  <span><span className="inline-block w-2 h-2 bg-blue-900 rounded-sm mr-1"></span>Movement</span>
                  <span><span className="inline-block w-2 h-2 bg-blue-500 rounded-sm mr-1"></span>Mgmt Reinvestment</span>
                  {active.debt > 0 && <span><span className="inline-block w-2 h-2 bg-amber-500 rounded-sm mr-1"></span>Bank Loan</span>}
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap text-center">
                  <div className="border-2 border-blue-900 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-blue-900">{fmt(active.movementEquity)}</div><div className="text-[10px] text-gray-400">Movement (70%)</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-blue-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-blue-500">{fmt(active.mgmtEquity)}</div><div className="text-[10px] text-gray-400">Mgmt (30%)</div></div>
                  {active.debt > 0 && <>
                    <span className="text-gray-400 font-bold">+</span>
                    <div className="border-2 border-dashed border-amber-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-amber-600">{fmt(active.debt)}</div><div className="text-[10px] text-gray-400">Bank Loan</div></div>
                  </>}
                  <span className="text-gray-400 font-bold">=</span>
                  <div className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold">S$40.0M</div><div className="text-[10px] text-gray-400">Total</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 mb-1">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div className="w-0.5 flex-1 bg-blue-200 min-h-[16px]"></div>
            </div>
            <div className="pb-5 flex-1">
              <div className="text-sm font-bold text-blue-900 mb-1">HoldCo buys 100% of the group → S$40M paid to all shareholders</div>
              <div className="text-xs text-gray-500 mb-2">Every current shareholder receives their share. This is the full agreed value.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 flex-wrap text-center">
                  <div className="border-2 border-blue-900 rounded-lg px-4 py-2.5 bg-white min-w-[120px]"><div className="text-base font-bold">S$40.0M</div><div className="text-[10px] text-gray-400">HoldCo pays</div></div>
                  <span className="text-xl text-gray-400">→</span>
                  <div className="border-2 border-green-500 rounded-lg px-4 py-2.5 bg-green-50 min-w-[180px]"><div className="text-base font-bold text-green-700">S$40.0M to shareholders</div><div className="text-[10px] text-gray-500">Cash in your hands</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 mb-1">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">4</div>
              <div className="w-0.5 flex-1 bg-blue-200 min-h-[16px]"></div>
            </div>
            <div className="pb-5 flex-1">
              <div className="text-sm font-bold text-blue-900 mb-1">Management reinvests a portion back for 30% ownership</div>
              <div className="text-xs text-gray-500 mb-2">Of the S$40M you received, you put some back into HoldCo. The bank loan means you keep more.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold">S$40.0M</div><div className="text-[10px] text-gray-400">You received</div></div>
                  <span className="text-gray-400 font-bold text-lg">−</span>
                  <div className="border-2 border-blue-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-blue-500">{fmt(active.mgmtEquity)}</div><div className="text-[10px] text-gray-400">You reinvest</div></div>
                  <span className="text-gray-400 font-bold text-lg">=</span>
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-green-50 min-w-[120px]"><div className="text-xl font-bold text-green-700">{fmt(active.netCashToShareholders)}</div><div className="text-[10px] text-gray-500">Cash you keep</div></div>
                </div>
              </div>
              <div className="bg-blue-50 border-l-3 border-blue-400 rounded-r-lg p-3 text-xs text-gray-600 mt-3">
                <strong>Why not reinvest the full S$12M?</strong> Because the bank loan covers part of the S$40M purchase. Less equity is needed overall, so your 30% share costs less. At {levX === 0 ? 'no debt' : `${levX.toFixed(1)}x`} leverage, you save <strong className="text-green-700">{fmt(active.addlCashOut)}</strong> vs. no loan.
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 mb-1">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">5</div>
              <div className="w-0.5 flex-1 bg-blue-200 min-h-[16px]"></div>
            </div>
            <div className="pb-5 flex-1">
              <div className="text-sm font-bold text-green-800 mb-1">You walk away with cash + 30% ownership + earnout</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-green-50 flex-1 max-w-[150px]"><div className="text-base font-bold text-green-700">{fmt(active.netCashToShareholders)}</div><div className="text-[10px] text-gray-500">Cash at close</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-blue-500 rounded-lg px-3 py-2 bg-white flex-1 max-w-[150px]"><div className="text-base font-bold text-blue-500">30%</div><div className="text-[10px] text-gray-500">Ownership in unified group</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-purple-300 rounded-lg px-3 py-2 bg-purple-50 flex-1 max-w-[150px]"><div className="text-base font-bold text-purple-600">S$8.6M</div><div className="text-[10px] text-gray-500">Earnout potential</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold shrink-0">6</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-700 mb-1">The loan is repaid by the businesses — not by you</div>
              <div className="text-xs text-gray-500 mb-2">The loan sits on HoldCo and is repaid from operating cash flow. No personal guarantee from any family member. As the loan pays down, your 30% equity grows in value.</div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-center gap-4 flex-wrap text-center text-xs">
                  <div><div className="font-semibold text-gray-600">Carats + Gleamedia + Adactive</div><div className="text-[10px] text-gray-400">generate cash flow</div></div>
                  <span className="text-gray-400">→</span>
                  <div><div className="font-semibold text-gray-600">Repays bank loan over ~5 years</div><div className="text-[10px] text-gray-400">~4% interest p.a.</div></div>
                  <span className="text-gray-400">→</span>
                  <div><div className="font-semibold text-green-700">Your 30% equity grows</div><div className="text-[10px] text-gray-400">as debt is paid off</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ LEVERAGE COMPARISON TABLE ═══ */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-5">
          <h3 className="text-base font-bold text-gray-900 mb-1">How Much Cash Do You Keep?</h3>
          <p className="text-xs text-gray-500 mb-4">The same S$40M deal — the only difference is how much HoldCo borrows from the bank.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left py-2 px-3 font-semibold">S$&apos;000</th>
                  {scenarios.map(s => (
                    <th key={s.lev} className={`text-right py-2 px-3 font-semibold ${s.lev === levX ? 'bg-amber-50 text-amber-800' : ''}`}>{s.lev === 0 ? 'No Debt' : `${s.lev.toFixed(1)}x EBITDA`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-2 px-3">You receive (sale of 100%)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(EV)}</td>)}</tr>
                <tr className="bg-gray-50"><td className="py-2 px-3">You reinvest (for 30% of HoldCo)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono text-blue-600 ${s.lev === levX ? 'bg-amber-50' : ''}`}>({fmtK(s.mgmtEquity)})</td>)}</tr>
                <tr className="bg-green-50 border-t-2 border-gray-200"><td className="py-2 px-3 font-bold text-green-800">Cash you keep at close</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono font-bold text-green-800 ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.netCashToShareholders)}</td>)}</tr>
                <tr><td className="py-2 px-3 text-gray-400">Earnout potential (if targets met)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono text-gray-400 ${s.lev === levX ? 'bg-amber-50' : ''}`}>8,606</td>)}</tr>
                <tr className="bg-gray-50 font-bold"><td className="py-2 px-3">Total potential cash</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono font-bold ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.totalPotentialCash)}</td>)}</tr>
                <tr><td colSpan={5} className="py-1 border-none"></td></tr>
                <tr className="bg-gray-50"><td colSpan={5} className="py-1.5 px-3 text-[11px] font-bold text-gray-500 uppercase">SPV Funding Sources</td></tr>
                <tr><td className="py-2 px-3">Movement equity (70%)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.movementEquity)}</td>)}</tr>
                <tr className="bg-gray-50"><td className="py-2 px-3">Your reinvestment (30%)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.mgmtEquity)}</td>)}</tr>
                <tr><td className="py-2 px-3">Bank loan</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono text-amber-600 ${s.lev === levX ? 'bg-amber-50' : ''}`}>{s.debt === 0 ? '—' : fmtK(s.debt)}</td>)}</tr>
                <tr className="bg-gray-50 font-bold"><td className="py-2 px-3">Total = EV</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono font-bold ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(EV)}</td>)}</tr>
                <tr className="bg-green-50"><td className="py-2 px-3 font-bold">Extra cash vs. no-debt scenario</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-2 px-3 font-mono font-bold text-green-700 ${s.lev === levX ? 'bg-amber-50' : ''}`}>{s.lev === 0 ? '—' : `+${fmtK(s.addlCashOut)}`}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ PROPERTY ANALOGY ═══ */}
        <div className="bg-white rounded-xl border-2 border-yellow-300 p-6 mb-5">
          <h3 className="text-base font-bold text-yellow-800 mb-1">Why Use a Loan? Think of It Like Buying Property.</h3>
          <p className="text-xs text-yellow-700 mb-4">A familiar example that shows how the same investment grows your return when you use a loan.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-xl p-4">
              <h4 className="text-sm font-bold text-yellow-800 mb-2">Scenario A: Pay 100% Cash</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-yellow-100"><span>Buy condo for</span><span className="font-bold">S$1,000,000</span></div>
                <div className="flex justify-between py-1 border-b border-yellow-100"><span>Your cash in</span><span className="font-bold">S$1,000,000</span></div>
                <div className="flex justify-between py-1 border-b border-yellow-100"><span>Bank loan</span><span>S$0</span></div>
                <div className="h-2"></div>
                <div className="flex justify-between py-1 border-b border-yellow-100"><span>After 5 years, condo worth</span><span className="font-bold">S$1,200,000</span></div>
                <div className="flex justify-between py-1 border-b border-yellow-100"><span>Your gain</span><span className="font-bold text-green-700">S$200,000</span></div>
                <div className="h-2"></div>
                <div className="flex justify-between bg-yellow-100 rounded-lg px-2 py-2 mt-1"><span className="font-bold">Return on your cash</span><span className="font-bold text-lg text-yellow-800">3.7% p.a.</span></div>
                <div className="text-center text-[10px] text-yellow-600 mt-1">S$200K gain ÷ S$1M invested over 5 yrs</div>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-bold text-green-800 mb-2">Scenario B: 50% Cash + 50% Loan</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-green-100"><span>Buy same condo for</span><span className="font-bold">S$1,000,000</span></div>
                <div className="flex justify-between py-1 border-b border-green-100"><span>Your cash in</span><span className="font-bold">S$500,000</span></div>
                <div className="flex justify-between py-1 border-b border-green-100"><span>Bank loan</span><span className="font-bold text-amber-600">S$500,000</span></div>
                <div className="h-2"></div>
                <div className="flex justify-between py-1 border-b border-green-100"><span>After 5 years, condo worth</span><span className="font-bold">S$1,200,000</span></div>
                <div className="flex justify-between py-1 border-b border-green-100"><span>Repay loan (from rental income)</span><span>(S$500,000)</span></div>
                <div className="flex justify-between py-1 border-b border-green-100"><span>Your equity</span><span className="font-bold text-green-700">S$1,200,000</span></div>
                <div className="h-2"></div>
                <div className="flex justify-between bg-green-100 rounded-lg px-2 py-2 mt-1"><span className="font-bold">Return on your cash</span><span className="font-bold text-lg text-green-800">19.1% p.a.</span></div>
                <div className="text-center text-[10px] text-green-600 mt-1">Same condo, same gain — but you only put in half the cash</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border-l-3 border-green-400 rounded-r-lg p-3 text-xs text-gray-600 mt-4">
            <strong>The point:</strong> The property went up the same 20% either way. But in Scenario B, your <em>personal return</em> is much higher because you committed less of your own money. The loan is repaid by rental income (just like HoldCo&apos;s loan is repaid by business cash flow). And you had S$500K extra to use elsewhere.
          </div>
        </div>

        {/* ═══ RETURNS SUMMARY ═══ */}
        <div className="bg-white rounded-xl border-2 border-green-200 p-6 mb-5">
          <h3 className="text-base font-bold text-green-800 mb-1">Your 30% Stake — How Debt Improves Your Return</h3>
          <p className="text-xs text-green-600 mb-4">Same business growth. Same exit value. Less cash committed = higher return on your investment.</p>
          <p className="text-xs text-gray-500 mb-4"><strong>Assumptions:</strong> 5-year hold, revenue grows 5% p.a., EBITDA margin stays at 26%, loan fully repaid from cash flow.</p>

          <div className="text-xs font-bold text-gray-600 mb-2">If the group exits at the same 5.6x multiple (conservative — no re-rating):</div>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { lev: 'No Debt', irr: '5.5%', moic: '1.3x', style: 'border-gray-200 bg-gray-50', valColor: 'text-gray-500' },
              { lev: '1.0x', irr: '9.7%', moic: '1.6x', style: 'border-blue-200 bg-blue-50', valColor: 'text-blue-600' },
              { lev: '1.5x', irr: '12.3%', moic: '1.8x', style: 'border-green-200 bg-green-50', valColor: 'text-green-600' },
              { lev: '2.0x', irr: '15.3%', moic: '2.0x', style: 'border-green-300 bg-green-100', valColor: 'text-green-700' },
            ].map(c => (
              <div key={c.lev} className={`border-2 rounded-lg p-3 text-center ${c.style}`}>
                <div className={`text-xl font-bold ${c.valColor}`}>{c.irr}</div>
                <div className="text-xs font-semibold mt-0.5">{c.moic} MOIC</div>
                <div className="text-[10px] text-gray-500 mt-1">{c.lev}</div>
              </div>
            ))}
          </div>

          <div className="text-xs font-bold text-gray-600 mb-2">If the group re-rates to 7.0x at exit (reflecting a larger, unified platform):</div>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { lev: 'No Debt', irr: '10.3%', moic: '1.6x', style: 'border-gray-200 bg-gray-50', valColor: 'text-gray-500' },
              { lev: '1.0x', irr: '14.7%', moic: '2.0x', style: 'border-blue-200 bg-blue-50', valColor: 'text-blue-600' },
              { lev: '1.5x', irr: '17.4%', moic: '2.2x', style: 'border-green-200 bg-green-50', valColor: 'text-green-600' },
              { lev: '2.0x', irr: '20.5%', moic: '2.5x', style: 'border-green-300 bg-green-100', valColor: 'text-green-700' },
            ].map(c => (
              <div key={c.lev} className={`border-2 rounded-lg p-3 text-center ${c.style}`}>
                <div className={`text-xl font-bold ${c.valColor}`}>{c.irr}</div>
                <div className="text-xs font-semibold mt-0.5">{c.moic} MOIC</div>
                <div className="text-[10px] text-gray-500 mt-1">{c.lev}</div>
              </div>
            ))}
          </div>

          {/* Detailed returns table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left py-2 px-3 font-semibold">Your 30% stake (S$&apos;000)</th>
                  <th className="text-right py-2 px-3 font-semibold">No Debt</th>
                  <th className="text-right py-2 px-3 font-semibold">1.0x</th>
                  <th className="text-right py-2 px-3 font-semibold">1.5x</th>
                  <th className="text-right py-2 px-3 font-semibold">2.0x</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-2 px-3">You reinvest today</td><td className="text-right py-2 px-3 font-mono font-bold">12,000</td><td className="text-right py-2 px-3 font-mono font-bold">9,848</td><td className="text-right py-2 px-3 font-mono font-bold">8,773</td><td className="text-right py-2 px-3 font-mono font-bold">7,697</td></tr>
                <tr className="bg-gray-50"><td className="py-2 px-3">Your 30% at exit (5.6x)</td><td className="text-right py-2 px-3 font-mono text-green-700">15,665</td><td className="text-right py-2 px-3 font-mono text-green-700">15,665</td><td className="text-right py-2 px-3 font-mono text-green-700">15,665</td><td className="text-right py-2 px-3 font-mono text-green-700">15,665</td></tr>
                <tr className="bg-green-50"><td className="py-2 px-3 font-bold">IRR (5.6x exit)</td><td className="text-right py-2 px-3 font-mono font-bold">5.5%</td><td className="text-right py-2 px-3 font-mono font-bold text-blue-600">9.7%</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">12.3%</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">15.3%</td></tr>
                <tr className="bg-gray-50"><td className="py-2 px-3">Your 30% at exit (7.0x)</td><td className="text-right py-2 px-3 font-mono text-green-700">19,581</td><td className="text-right py-2 px-3 font-mono text-green-700">19,581</td><td className="text-right py-2 px-3 font-mono text-green-700">19,581</td><td className="text-right py-2 px-3 font-mono text-green-700">19,581</td></tr>
                <tr className="bg-green-50"><td className="py-2 px-3 font-bold">IRR (7.0x exit)</td><td className="text-right py-2 px-3 font-mono font-bold">10.3%</td><td className="text-right py-2 px-3 font-mono font-bold text-blue-600">14.7%</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">17.4%</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">20.5%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border-l-3 border-green-400 rounded-r-lg p-3 text-xs text-gray-600 mt-4">
            <strong>Key takeaway:</strong> Your 30% stake is worth exactly the same at exit regardless of leverage. The difference is how much cash you locked up to get there. With a modest 1.5x loan, your annual return nearly <em>doubles</em> vs. no debt (12.3% vs. 5.5%) — while keeping an extra S$3.2M in your pocket today.
          </div>
        </div>

        {/* ═══ SAFETY NOTE ═══ */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 text-xs text-gray-600 rounded-r-xl">
          <strong className="text-gray-800">A note on safety:</strong> We understand the family has always run the business debt-free, and we respect that discipline. The loan we are proposing is conservative (1.0x–2.0x EBITDA) and sits on HoldCo — not on any individual. It is repaid from the group&apos;s strong operating cash flow (the same cash flow that has supported S$43M in backlog). No family member signs a personal guarantee. The businesses continue to operate exactly as before. The only difference is that more of your hard-earned value comes home as cash on day one.
        </div>
      </Section>

      {/* Section 4: Consideration Structure */}
      <Section title="4. Consideration Structure" tag="STANDARD">
        <table className="w-full text-xs mt-3">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="text-left py-2 px-3 font-semibold">Component</th>
              <th className="text-right py-2 px-3 font-semibold">Amount (S$&apos;000)</th>
              <th className="text-left py-2 px-3 font-semibold">Timing</th>
              <th className="text-left py-2 px-3 font-semibold">Funded By</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50"><td className="py-2 px-3">Movement Equity (70%)</td><td className="text-right py-2 px-3 font-mono">{fmtK(active.movementEquity)}</td><td className="py-2 px-3">Completion</td><td className="py-2 px-3">Movement fund</td></tr>
            <tr><td className="py-2 px-3">Management Rollover (30%)</td><td className="text-right py-2 px-3 font-mono">{fmtK(active.mgmtEquity)}</td><td className="py-2 px-3">Completion</td><td className="py-2 px-3">Existing equity</td></tr>
            <tr className="bg-green-50"><td className="py-2 px-3 font-bold text-green-800">Management Cash-Out</td><td className="text-right py-2 px-3 font-mono font-bold text-green-800">{fmtK(active.mgmtCashOut)}</td><td className="py-2 px-3">Completion</td><td className="py-2 px-3">Debt proceeds</td></tr>
            <tr><td className="py-2 px-3">Earnout — Year 1 (30%)</td><td className="text-right py-2 px-3 font-mono">2,582</td><td className="py-2 px-3">Year 1</td><td className="py-2 px-3">HoldCo</td></tr>
            <tr><td className="py-2 px-3">Earnout — Year 2 (70%)</td><td className="text-right py-2 px-3 font-mono">6,024</td><td className="py-2 px-3">Year 2</td><td className="py-2 px-3">HoldCo</td></tr>
            <tr className="bg-gray-50 border-t-2 border-gray-200"><td className="py-2 px-3 font-bold">Total</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(EV + 8606)}</td><td className="py-2 px-3"></td><td className="py-2 px-3"></td></tr>
          </tbody>
        </table>
        <p className="text-[10px] text-gray-400 mt-2">Earnout at 100% achievement. Actual payouts scale proportionally between 80% floor and target.</p>
      </Section>

      {/* Section 5: Earnout */}
      <Section title="5. Earnout Structure" tag="STANDARD" defaultOpen={false}>
        <table className="w-full text-xs mt-3">
          <thead><tr className="bg-gray-50 text-gray-500"><th className="text-left py-2 px-3 font-semibold">Parameter</th><th className="text-left py-2 px-3 font-semibold">Year 1</th><th className="text-left py-2 px-3 font-semibold">Year 2</th></tr></thead>
          <tbody>
            <tr><td className="py-2 px-3">Tranche</td><td className="py-2 px-3 font-mono">30% (S$2.58M)</td><td className="py-2 px-3 font-mono">70% (S$6.02M)</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">EBITDA Target</td><td className="py-2 px-3 font-mono">S$7,500,000</td><td className="py-2 px-3 font-mono">S$8,000,000</td></tr>
            <tr><td className="py-2 px-3">Mgmt Forecast</td><td className="py-2 px-3 font-mono text-gray-400">S$7,890,000</td><td className="py-2 px-3 font-mono text-gray-400">S$8,522,000</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">Floor</td><td className="py-2 px-3" colSpan={2}>80% of target — below floor, zero payout</td></tr>
            <tr><td className="py-2 px-3">Carry-Forward</td><td className="py-2 px-3" colSpan={2}>Year 1 shortfall carries into Year 2 pool</td></tr>
            <tr className="bg-gray-50 font-bold"><td className="py-2 px-3">Total</td><td className="py-2 px-3" colSpan={2}>S$8,606,400 (funded by HoldCo)</td></tr>
          </tbody>
        </table>
      </Section>

      {/* Section 6: Put/Call */}
      <Section title="6. Put / Call on 30% Stake" tag="TBD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="Lock-Up"><span className="text-gray-600">[3–5 years] from completion</span> <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold ml-1">Discuss</span></Row>
          <Row label="Put Option">Post lock-up, management may put their 30% to Movement at fair market value (independent valuation). Provides liquidity path for Gen-1s who wish to fully exit.</Row>
          <Row label="Call Option">Movement may call the 30% at FMV post lock-up, or upon trigger events (material breach, key-man departure).</Row>
          <Row label="Valuation">Independent third-party valuation. Methodology TBD — likely trailing 12M EBITDA × agreed multiple, subject to floor.</Row>
          <Row label="Tag / Drag">Standard tag-along on any Movement sale. Drag-along at Movement&apos;s option above [●]x MOIC threshold.</Row>
        </div>
        <div className="mt-3 bg-green-50 border-l-4 border-green-400 p-3 text-xs text-gray-600">
          <strong className="text-gray-800">Positioning for family:</strong> The put option guarantees a defined exit path for the 30% holders — unlike the current illiquid shareholding across three separate entities.
        </div>
      </Section>

      {/* Section 7: Governance */}
      <Section title="7. Governance & Shareholder Rights" tag="STANDARD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="Board">Movement-appointed majority. 1 seat reserved for continuing management (likely Albert or Raymond). <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold ml-1">Discuss</span></Row>
          <Row label="Reserved Matters">Capex above threshold, new indebtedness, related-party transactions, dividend policy, key executive hires/terminations, material contracts, change of business</Row>
          <Row label="Info Rights">Monthly management accounts, quarterly board reporting, annual audited statements</Row>
          <Row label="Anti-Dilution">Pre-emptive rights on new issuances to maintain pro-rata ownership</Row>
        </div>
      </Section>

      {/* Section 8: DD & Conditions */}
      <Section title="8. Due Diligence & Conditions Precedent" tag="STANDARD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="DD Scope">Financial, legal, tax, commercial, and operational. 6-week indicative period post-LOI execution.</Row>
          <Row label="Key Focus">
            <div className="space-y-1">
              <p>(1) 5-year growth plan & revenue pipeline sustainability</p>
              <p>(2) BU economics — standalone and integrated</p>
              <p>(3) Earnings quality — normalised EBITDA, intercompany eliminations</p>
              <p>(4) Working capital & balance sheet — receivables ageing, cash requirements</p>
              <p>(5) Legal & structural — contracts, IP, regulatory, employment</p>
              <p>(6) Leadership continuity & team alignment</p>
            </div>
          </Row>
          <Row label="Conditions">Satisfactory DD; no MAC; audited FY2025 confirmation; formalised transfer pricing; key management retention agreements executed</Row>
        </div>
      </Section>

      {/* Section 9: Financing */}
      <Section title="9. Financing" tag="STANDARD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="Equity">Movement fund (patient capital, family office-backed). No financing contingency.</Row>
          <Row label="Debt">Target 1.0x–2.0x EBITDA senior secured at SPV level. Indicative: ~4.0% p.a., 5-year amortisation.</Row>
          <Row label="Debt Service">Serviced by operating cash flow. No personal guarantees from management shareholders.</Row>
        </div>
      </Section>

      {/* Section 10: Timeline */}
      <Section title="10. Indicative Timeline" tag="STANDARD" defaultOpen={false}>
        <table className="w-full text-xs mt-3">
          <thead><tr className="bg-gray-50 text-gray-500"><th className="text-left py-2 px-3 font-semibold">Phase</th><th className="text-left py-2 px-3 font-semibold">Activity</th><th className="text-left py-2 px-3 font-semibold">Weeks</th></tr></thead>
          <tbody>
            <tr><td className="py-2 px-3 font-bold text-blue-800">LOI</td><td className="py-2 px-3">Submit draft, discussion & agreement</td><td className="py-2 px-3 font-mono">W1–3</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3 font-bold text-purple-800">DD</td><td className="py-2 px-3">All workstreams</td><td className="py-2 px-3 font-mono">W4–11</td></tr>
            <tr><td className="py-2 px-3 font-bold text-green-800">SPA</td><td className="py-2 px-3">Agreement drafting, leadership alignment</td><td className="py-2 px-3 font-mono">W10–13</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3 font-bold text-emerald-800">Close</td><td className="py-2 px-3">Signing & closing</td><td className="py-2 px-3 font-mono">W14–15</td></tr>
          </tbody>
        </table>
      </Section>

      {/* Non-binding */}
      <div className="text-[10px] text-gray-400 text-center py-4">
        This term sheet outline is indicative and non-binding. Intended for internal IC discussion only. Final terms subject to satisfactory DD, definitive documentation, and all necessary approvals.
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [tab, setTab] = useState(0);
  const content = [<ValueTab key={0} />, <EarnoutTab key={1} />, <HoldcoTab key={2} />, <TimelineTab key={3} />, <TermSheetTab key={4} />];

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="text-center py-3 mb-4">
        <h1 className="text-2xl font-bold text-blue-900 tracking-tight">PROJECT DIAMOND</h1>
        <p className="text-xs text-gray-400 mt-0.5">Preliminary LOI Discussion Tool &mdash; Strictly Confidential</p>
      </header>
      <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${tab === i ? 'bg-blue-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
            {t}
          </button>
        ))}
      </div>
      {content[tab]}
      <footer className="text-center text-[10px] text-gray-300 py-6 mt-8">Movement &mdash; Project Diamond &mdash; March 2026</footer>
    </div>
  );
}
