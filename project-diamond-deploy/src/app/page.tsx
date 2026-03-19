"use client";

import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";

const fmt = (n: number) => "S$" + (Math.abs(n) >= 1000 ? (n / 1000).toFixed(1) + "M" : n.toFixed(0) + "K");
const fmtK = (n: number) => "S$" + Math.round(n).toLocaleString("en-SG");
const TABS = ["Value to Shareholders", "Earnout Calculator", "HoldCo Structure", "Transaction Timeline"];

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
// PASSWORD GATE
// ════════════════════════════════════════════════════════════════════════
const PASS_HASH = "8e1e3e1c88e04ede7c0a4a449e44f2ab1e877f60c17b2193c8914aecd11f196f"; // SHA-256 of "diamond2026"

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("pd_auth");
      if (stored === "1") setAuthenticated(true);
    }
    setLoading(false);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(password.trim());
    if (hash === PASS_HASH) {
      sessionStorage.setItem("pd_auth", "1");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (loading) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-blue-900 mb-1">PROJECT DIAMOND</h1>
          <p className="text-xs text-gray-400 mb-6">Strictly Confidential</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter access code"
              autoFocus
              className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
            />
            {error && <p className="text-xs text-red-500 mt-2">Incorrect access code</p>}
            <button type="submit"
              className="w-full mt-4 py-3 bg-blue-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors">
              Access Tool
            </button>
          </form>
          <p className="text-[10px] text-gray-300 mt-6">Movement Capital &mdash; Authorised Access Only</p>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const [tab, setTab] = useState(0);
  const content = [<ValueTab key={0} />, <EarnoutTab key={1} />, <HoldcoTab key={2} />, <TimelineTab key={3} />];

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

export default function Home() {
  return (
    <PasswordGate>
      <Dashboard />
    </PasswordGate>
  );
}
