"use client";

import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList,
} from "recharts";

const fmt = (n: number) => "S$" + (Math.abs(n) >= 1000 ? (n / 1000).toFixed(1) + "M" : n.toFixed(0) + "K");
const fmtK = (n: number) => "S$" + Math.round(n).toLocaleString("en-SG");
// Full dollar formatter: converts S$'000 to full dollars (e.g. 8000 -> "S$8,000,000")
const fmtFull = (n: number) => "S$" + (n * 1000).toLocaleString("en-SG", { maximumFractionDigits: 0 });
const TABS = ["Value to Shareholders", "Earnout", "Group Structure", "Timeline & Key DD Topics", "Term Sheet", "Family Overview"];

// Hard-coded assumptions (not shown to family)
const EV = 40000;
const EBITDA_2025 = 7172; // FY2025 unaudited
const MOVEMENT_PCT = 70;
const MGMT_PCT = 30;
const EBITDA_MARGIN = 26;
const REV_CAGR = 5;
const HOLD_YEARS = 5;
const REVENUE_2025 = 28100;
const DEBT = 2701;
const TOTAL_CASH = 10395;
const OP_MIN = 2000;
const NWC_PCT = 10;
const ENTRY_MULT = EV / EBITDA_2025;
const NWC_RESERVE = (NWC_PCT / 100) * REVENUE_2025;
const NET_CASH = Math.max(0, TOTAL_CASH - DEBT - NWC_RESERVE - OP_MIN);
const EQUITY_VALUE = EV + NET_CASH;
const DEFERRED_TOTAL = 8600; // S$8,600,000 earnout (rounded)
const EXIT70_TOTAL = (MOVEMENT_PCT / 100) * EQUITY_VALUE; // 70% of 42,884 = 30,018.8
const EXIT70_EARNOUT = DEFERRED_TOTAL; // full earnout shown on bar
const EXIT70_UPFRONT = EXIT70_TOTAL - EXIT70_EARNOUT; // 30,018.8 - 8,600 = 21,418.8

// ════════════════════════════════════════════════════════════════════════
// TAB 1 — VALUE TO SHAREHOLDERS
// ════════════════════════════════════════════════════════════════════════
function ValueTab() {
  const [selectedMult, setSelectedMult] = useState<number | null>(null);
  const [yr5Ebitda, setYr5Ebitda] = useState(13611);

  const c = useMemo(() => {
    const exit70_upfront = EXIT70_UPFRONT;
    const exit70_earnout = EXIT70_EARNOUT;
    const exit70_total = EXIT70_TOTAL;
    const rollover30 = (MGMT_PCT / 100) * EQUITY_VALUE;

    const multiples = Array.from(new Set([ENTRY_MULT, 6, 7, 8].map(m => Math.round(m * 10) / 10))).sort((a, b) => a - b);
    const annualFCF = yr5Ebitda * 0.83 * 0.55;
    const cumFCF = annualFCF * HOLD_YEARS * 0.7;
    const futureNetCash = NET_CASH + cumFCF;

    const sensitivity = multiples.map(mult => {
      const futureEV = yr5Ebitda * mult;
      const futureEquity = futureEV + futureNetCash;
      const futureRoll = (MGMT_PCT / 100) * futureEquity;
      const returnMult = futureRoll / rollover30;
      return { mult, futureEV, futureEquity, futureRoll, returnMult };
    });

    const active = selectedMult !== null
      ? sensitivity.find(s => s.mult === selectedMult) || sensitivity[0]
      : sensitivity[0];

    return {
      exit70_upfront, exit70_earnout, exit70_total,
      rollover30, yr5Ebitda, futureNetCash,
      sensitivity, active,
    };
  }, [selectedMult, yr5Ebitda]);

  // Simple two-bar chart: upfront (70%) and continuing stake (30%). No earnout bar.
  const equityAtClose = c.exit70_upfront + c.rollover30; // 21,418.8 + 12,865.2 = 34,284
  const barData = [
    { name: `Upfront (${MOVEMENT_PCT}%)`, value: c.exit70_upfront / 1000, fill: "#1e40af" },
    { name: `Continuing Stake (${MGMT_PCT}%)`, value: c.rollover30 / 1000, fill: "#059669" },
  ];
  const chart2Data = [
    { name: "Today", value: c.rollover30 / 1000, fill: "#d1d5db" },
    { name: `Year ${HOLD_YEARS} (Projected)`, value: c.active.futureRoll / 1000, fill: "#059669" },
  ];

  return (
    <div className="space-y-6">
      {/* EV to Equity Bridge */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Indicative Offer Valuation</h3>
        <div className="flex items-center gap-0 overflow-x-auto text-center text-xs">
          {[
            { label: "Enterprise\nValue", value: EV, color: "bg-blue-600 text-white" },
            { label: "(-) Debt", value: -DEBT, color: "bg-yellow-100 text-yellow-800", sign: "" },
            { label: `(-) Working\nCapital (${NWC_PCT}%)`, value: -NWC_RESERVE, color: "bg-yellow-100 text-yellow-800", sign: "" },
            { label: "(-) Operating\nReserve", value: -OP_MIN, color: "bg-yellow-100 text-yellow-800", sign: "" },
            { label: "(+) Unrestricted\nCash on BS", value: TOTAL_CASH, color: "bg-green-100 text-green-700", sign: "+" },
            { label: "Equity\nValue", value: EQUITY_VALUE, color: "bg-blue-800 text-white", sign: "=" },
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && i < 5 && <div className="text-gray-300 text-lg px-1.5 font-light">{item.sign || ""}</div>}
              {i === 5 && <div className="text-gray-400 text-xl px-2 font-bold">=</div>}
              <div className={`rounded-lg px-3 py-2.5 min-w-[85px] ${item.color} shadow-sm`}>
                <div className="font-bold text-sm">{fmtFull(Math.abs(item.value))}</div>
                <div className="mt-0.5 leading-tight opacity-80 whitespace-pre-line" style={{fontSize:10}}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Indicative valuation: <span className="font-bold text-gray-600">~{ENTRY_MULT.toFixed(1)}x</span> unaudited FY2025 EBITDA of {fmtFull(EBITDA_2025)}</p>
        <p className="text-[11px] italic text-gray-400 mt-1">Subject to independent financial due diligence and transaction financing (to be finalised)</p>
      </div>

      {/* Day-1 Chart — full width, same dimensions as bridge */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-1">Day-1 Value to Shareholders</h3>
        <p className="text-[11px] text-gray-400 mb-1">Total equity value: {fmtFull(EQUITY_VALUE)}. Earnout funded by HoldCo over 2 years if EBITDA targets are achieved.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart layout="vertical" data={barData} margin={{ left: 5, right: 80 }} barSize={44}>
                <XAxis type="number" tickFormatter={v => `S$${v.toFixed(0)}M`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  <LabelList dataKey="value" position="center" formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} style={{ fontSize: 13, fontWeight: 800, fill: '#ffffff' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Breakdown table */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-gray-600">Upfront incl. net cash ({MOVEMENT_PCT}%)</span><span className="font-mono font-bold text-blue-800">{fmtFull(c.exit70_upfront)}</span></div>
            <div className="flex justify-between"><span className="text-green-700">Continuing Stake ({MGMT_PCT}%)</span><span className="font-mono font-bold text-green-700">{fmtFull(c.rollover30)}</span></div>
            <div className="flex justify-between border-t pt-1 mt-1"><span className="font-semibold">Equity Value at close (100%)</span><span className="font-mono font-bold">{fmtFull(equityAtClose)}</span></div>
            <div className="flex justify-between mt-3 pt-2 border-t border-dashed border-gray-300"><span className="text-gray-500 italic">Earnout (funded by HoldCo, if targets met)</span><span className="font-mono text-blue-400 italic">{fmtFull(DEFERRED_TOTAL)}</span></div>
            <div className="flex justify-between mt-2 pt-2 border-t-2 border-gray-400"><span className="font-bold text-blue-900">Total Equity Value (100%)</span><span className="font-mono font-bold text-blue-900">{fmtFull(EQUITY_VALUE)}</span></div>
          </div>
        </div>
      </div>

      {/* Sensitivity Table — separate full-width card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-1">{MGMT_PCT}% Continuing Stake &mdash; Projected Growth</h3>
        <p className="text-[11px] text-gray-400 mb-3">Select a scenario to see how the {MGMT_PCT}% stake could grow over {HOLD_YEARS} years.</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="py-1.5 px-2 text-left font-semibold">Future Multiple</th>
              <th className="py-1.5 px-2 text-right font-semibold">Projected Value</th>
              <th className="py-1.5 px-2 text-right font-semibold">{MGMT_PCT}% Share</th>
              <th className="py-1.5 px-2 text-right font-semibold">Return Multiple</th>
            </tr>
          </thead>
          <tbody>
            {c.sensitivity.map((s, i) => {
              const isActive = s.mult === c.active.mult;
              const isEntry = Math.abs(s.mult - ENTRY_MULT) < 0.05;
              return (
                <tr key={i} onClick={() => setSelectedMult(s.mult)}
                  className={`cursor-pointer transition-all ${isActive ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                  <td className="py-2 px-2 font-mono font-bold">
                    {s.mult.toFixed(1)}x {isEntry && <span className="text-[9px] font-normal text-gray-400 ml-1">(today)</span>}
                  </td>
                  <td className="py-2 px-2 text-right font-mono">{fmt(s.futureEV)}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-green-700">{fmt(s.futureRoll)}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold">{s.returnMult.toFixed(1)}x</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rollover chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-1">{MGMT_PCT}% Continuing Stake &mdash; Today vs Year {HOLD_YEARS} ({c.active.mult.toFixed(1)}x)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart layout="vertical" data={chart2Data} margin={{ left: 5, right: 55 }}>
              <XAxis type="number" tickFormatter={v => `${v.toFixed(0)}M`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chart2Data.map((d, i) => <Cell key={i} fill={d.fill} />)}
                <LabelList dataKey="value" position="right" formatter={(v: any) => `S$${Number(v).toFixed(1)}M`} style={{ fontSize: 11, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">{c.active.returnMult.toFixed(1)}x</div>
            <div className="text-xs text-gray-500">Potential return over {HOLD_YEARS} years</div>
          </div>
        </div>
      </div>

      {/* Year 5 EBITDA Slider + Valuation */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-1">Illustrative Future Value at Year {HOLD_YEARS}</h3>
        <p className="text-[11px] text-gray-400 mb-4">Adjust the illustrative Year {HOLD_YEARS} EBITDA to see how the {MGMT_PCT}% continuing stake could grow.</p>

        {/* EBITDA Slider — styled like earnout sliders */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-5 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-blue-900">Illustrative Year {HOLD_YEARS} EBITDA</span>
            <span className="font-mono font-bold text-2xl text-blue-800">{fmtFull(yr5Ebitda)}</span>
          </div>
          <div className="relative">
            <div className="h-3 rounded-full bg-blue-200">
              <div className="h-3 rounded-full bg-blue-500 transition-all" style={{ width: `${((yr5Ebitda - 7000) / (20000 - 7000)) * 100}%` }} />
            </div>
            <input type="range" min={7000} max={20000} step={100} value={yr5Ebitda} onChange={e => setYr5Ebitda(+e.target.value)}
              className="w-full -mt-2.5 relative z-20 appearance-none bg-transparent cursor-pointer"
              style={{ height: 20 }} />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-blue-400">{fmtFull(7000)}</span>
            <span className="text-blue-400">{fmtFull(20000)}</span>
          </div>
        </div>

        {/* Valuation table */}
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-3 font-semibold text-gray-500">S$&apos;000</th>
              <th className="text-right py-2 px-3 font-semibold text-blue-700">Year {HOLD_YEARS} Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1.5 px-3 text-gray-600">Year {HOLD_YEARS} EBITDA</td><td className="text-right py-1.5 px-3 font-mono">{fmtFull(yr5Ebitda)}</td></tr>
            <tr className="bg-gray-50"><td className="py-1.5 px-3 font-semibold text-blue-800">Projected Value ({c.active.mult.toFixed(1)}x)</td><td className="text-right py-1.5 px-3 font-mono font-bold text-blue-800">{fmt(c.active.futureEV)}</td></tr>
            <tr><td className="py-1.5 px-3 text-gray-600">(+) Est. Net Cash</td><td className="text-right py-1.5 px-3 font-mono">{fmt(c.futureNetCash)}</td></tr>
            <tr className="bg-blue-50"><td className="py-1.5 px-3 font-bold text-blue-900">Total Equity Value (100%)</td><td className="text-right py-1.5 px-3 font-mono font-bold text-blue-900">{fmt(c.active.futureEquity)}</td></tr>
            <tr><td className="py-1.5 px-3 text-green-700 font-semibold">{MGMT_PCT}% Continuing Share</td><td className="text-right py-1.5 px-3 font-mono font-bold text-green-700">{fmt(c.active.futureRoll)}</td></tr>
            <tr className="bg-green-50"><td className="py-1.5 px-3 font-bold text-green-800">Return Multiple</td><td className="text-right py-1.5 px-3 font-mono font-bold text-green-800">{c.active.returnMult.toFixed(1)}x</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 2 — EARNOUT
// ════════════════════════════════════════════════════════════════════════
function EarnoutTab() {
  const [yr1Actual, setYr1Actual] = useState(7900);
  const [yr2Actual, setYr2Actual] = useState(8500);
  const yr1Hurdle = 7500;
  const yr2Hurdle = 8000;
  const yr1MgmtForecast = 7890;
  const yr2MgmtForecast = 8522;

  const c = useMemo(() => {
    const yr1Tranche = 0.3 * DEFERRED_TOTAL;
    const yr2Tranche = 0.7 * DEFERRED_TOTAL;
    const yr1Floor = yr1Hurdle * 0.8;
    const yr2Floor = yr2Hurdle * 0.8;

    // Year 1 payout — pro-rata: actual ÷ target (below floor = zero)
    const yr1Ratio = yr1Actual >= yr1Hurdle ? 1 : yr1Actual >= yr1Floor ? yr1Actual / yr1Hurdle : 0;
    const yr1Pay = yr1Actual >= yr1Floor ? yr1Tranche * yr1Ratio : 0;
    const yr1Unpaid = yr1Tranche - yr1Pay;
    const yr1EbitdaShortfall = Math.max(0, yr1Hurdle - yr1Actual);

    // Year 2 — carry forward only (no carry backward)
    const yr2Ratio = yr2Actual >= yr2Hurdle ? 1 : yr2Actual >= yr2Floor ? yr2Actual / yr2Hurdle : 0;
    const yr2BasePay = yr2Actual >= yr2Floor ? yr2Tranche * yr2Ratio : 0;

    // Carry forward: Year 1 shortfall only recoverable if Year 2 EXCEEDS its hurdle
    let yr1Recovery = 0;
    if (yr1Unpaid > 0 && yr1EbitdaShortfall > 0 && yr2Actual > yr2Hurdle) {
      const recoveryRatio = Math.min(1, (yr2Actual - yr2Hurdle) / yr1EbitdaShortfall);
      yr1Recovery = yr1Unpaid * recoveryRatio;
    }

    const yr2Pay = Math.min(yr2Tranche + yr1Unpaid, yr2BasePay + yr1Recovery);
    const totalPaid = Math.min(DEFERRED_TOTAL, yr1Pay + yr2Pay);
    const yr1Status = yr1Actual >= yr1Hurdle ? "met" : yr1Actual >= yr1Floor ? "partial" : "missed";
    const yr2Status = yr2Actual >= yr2Hurdle ? "met" : yr2Actual >= yr2Floor ? "partial" : "missed";
    return { yr1Tranche, yr2Tranche, yr1Floor, yr2Floor, yr1Pay, yr1Unpaid, yr1EbitdaShortfall, yr2BasePay, yr1Recovery, yr2Pay, totalPaid, yr1Status, yr2Status };
  }, [yr1Actual, yr2Actual]);

  const statusColors = { met: "bg-green-500", partial: "bg-yellow-500", missed: "bg-red-500" };
  const statusLabels = { met: "ACHIEVED", partial: "PARTIAL", missed: "BELOW TARGET" };

  const Slider = ({ label, value, set, min, max, hurdle, floor, status, mgmtForecast }: any) => {
    const pctPos = ((value - min) / (max - min)) * 100;
    const hurdlePct = ((hurdle - min) / (max - min)) * 100;
    const floorPct = ((floor - min) / (max - min)) * 100;
    const mgmtPct = ((mgmtForecast - min) / (max - min)) * 100;
    return (
      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-semibold text-sm">{label}</span>
            <span className="text-[10px] text-gray-400 ml-2">Target: {fmtFull(hurdle)} (vs Mgmt forecast of {fmtFull(mgmtForecast)})</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${statusColors[status as keyof typeof statusColors]}`}>{statusLabels[status as keyof typeof statusLabels]}</span>
        </div>
        <div className="relative mb-3">
          <div className="h-3 rounded-full bg-gray-200 relative overflow-visible">
            <div className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10" style={{ left: `${floorPct}%` }}>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-red-500 whitespace-nowrap">Floor {fmtFull(floor)}</div>
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-green-600 z-10" style={{ left: `${hurdlePct}%` }}>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-green-600 whitespace-nowrap">Target {fmtFull(hurdle)}</div>
            </div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10 border-dashed" style={{ left: `${mgmtPct}%` }}>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-blue-400 whitespace-nowrap">Mgmt {fmtFull(mgmtForecast)}</div>
            </div>
            <div className={`absolute top-0 left-0 bottom-0 rounded-full transition-all ${status === 'met' ? 'bg-green-400' : status === 'partial' ? 'bg-yellow-400' : 'bg-red-300'}`}
              style={{ width: `${Math.min(100, pctPos)}%` }} />
          </div>
          <input type="range" min={min} max={max} step={50} value={value} onChange={e => set(+e.target.value)}
            className="w-full -mt-2.5 relative z-20 appearance-none bg-transparent cursor-pointer"
            style={{ height: 20 }} />
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className="text-gray-400">{fmtFull(min)}</span>
          <span className="font-mono font-bold text-lg">{fmtFull(value)}</span>
          <span className="text-gray-400">{fmtFull(max)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">The earnout aligns the interests of both parties. {fmtFull(DEFERRED_TOTAL)} of the consideration is linked to EBITDA performance over the first two years, funded by HoldCo and paid in two tranches. Includes <strong>carry forward</strong> — if Year 1 falls short, Year 2 must exceed its own target by the EBITDA shortfall amount to recover the unpaid tranche.</p>

      {/* Structure boxes */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{fmtFull(DEFERRED_TOTAL)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Earnout</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{fmtFull(c.yr1Tranche)}</div>
          <div className="text-xs text-gray-500 mt-1">Year 1<br />(30% of total)</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-800">{fmtFull(c.yr2Tranche)}</div>
          <div className="text-xs text-gray-500 mt-1">Year 2<br />(70% of total)</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-8">
        <Slider label="Year 1 EBITDA Performance" value={yr1Actual} set={setYr1Actual}
          min={5000} max={12000} hurdle={yr1Hurdle} floor={c.yr1Floor} status={c.yr1Status} mgmtForecast={yr1MgmtForecast} />
        <Slider label="Year 2 EBITDA Performance" value={yr2Actual} set={setYr2Actual}
          min={5000} max={12000} hurdle={yr2Hurdle} floor={c.yr2Floor} status={c.yr2Status} mgmtForecast={yr2MgmtForecast} />
      </div>

      {/* Payout details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2">Year 1 Payment</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Available (30% tranche)</span><span className="font-mono">{fmtFull(c.yr1Tranche)}</span></div>
            <div className="flex justify-between font-bold text-green-700"><span>Payable</span><span className="font-mono">{fmtFull(c.yr1Pay)}</span></div>
            {c.yr1Unpaid > 0 && <div className="flex justify-between text-orange-600"><span>Unpaid (carry forward)</span><span className="font-mono">{fmtFull(c.yr1Unpaid)}</span></div>}
            {c.yr1EbitdaShortfall > 0 && <div className="flex justify-between text-orange-500"><span>EBITDA gap to recover in Yr 2</span><span className="font-mono">{fmtFull(c.yr1EbitdaShortfall)}</span></div>}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 italic">Pro-rata: payout = actual ÷ target × tranche. Below floor = zero. {c.yr1EbitdaShortfall > 0 ? `Year 2 must exceed its target by ${fmtFull(c.yr1EbitdaShortfall)} to recover the carried amount.` : 'Full tranche achieved.'}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2">Year 2 Payment</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Base tranche (70%)</span><span className="font-mono">{fmtFull(c.yr2Tranche)}</span></div>
            <div className="flex justify-between"><span>Base payout</span><span className="font-mono">{fmtFull(c.yr2BasePay)}</span></div>
            {c.yr1Recovery > 0 && <div className="flex justify-between text-green-600"><span>(+) Year 1 recovery</span><span className="font-mono">{fmtFull(c.yr1Recovery)}</span></div>}
            <div className="flex justify-between font-bold text-green-700 border-t border-gray-200 pt-1"><span>Total Year 2 Payable</span><span className="font-mono">{fmtFull(c.yr2Pay)}</span></div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 italic">{c.yr1Unpaid > 0 ? `Year 1 carry of ${fmtFull(c.yr1Unpaid)} requires Year 2 EBITDA to exceed ${fmtFull(yr2Hurdle)} by ${fmtFull(c.yr1EbitdaShortfall)} (i.e., ${fmtFull(yr2Hurdle + c.yr1EbitdaShortfall)}) for full recovery.` : 'Pro-rata: payout = actual ÷ target × tranche. Below floor = zero.'}</p>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-blue-900 text-white rounded-xl p-5">
        <div>
          <div className="text-sm font-bold">Total Earnout Payable</div>
          <div className="text-xs opacity-70">of {fmtFull(DEFERRED_TOTAL)} total</div>
        </div>
        <div className="text-3xl font-bold">{fmtFull(c.totalPaid)}</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 3 — GROUP STRUCTURE
// ════════════════════════════════════════════════════════════════════════
function HoldcoTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Current */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <h3 className="font-bold text-sm text-gray-700">TODAY&apos;S STRUCTURE</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: "Carats & Co", rev: "S$20M", desc: "Signage Design & Build", color: "from-slate-500 to-slate-600",
                holders: ["Albert 23.3%", "Raymond 23.3%", "Charlie 20.0%", "Ann 17.1%", "TH 8.7%", "Susie 7.7%"] },
              { name: "Gleamedia", rev: "S$6M", desc: "OOH Media", color: "from-slate-400 to-slate-500",
                holders: ["Raymond 22%", "Albert 22%", "TH 22%", "Geng Hao 30%", "Keith 4%"] },
              { name: "Adactive", rev: "S$2M", desc: "Digital Kiosks / Software", color: "from-slate-400 to-slate-500",
                holders: ["Yu Hang 50%", "Ann 25%", "Susie 25%"] },
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
          <div className="mt-4 space-y-1.5 text-xs text-gray-600">
            <p>&bull; Three separate legal entities, each with its own shareholders</p>
            <p>&bull; Shareholding percentages vary across entities</p>
            <p>&bull; Transfer pricing to be formalised under new structure</p>
            <p>&bull; Separate dividend policies across entities</p>
          </div>
        </div>

        {/* Proposed */}
        <div className="bg-white rounded-xl border-2 border-green-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h3 className="font-bold text-sm text-green-800">PROPOSED STRUCTURE</h3>
          </div>

          <div className="border-2 border-green-400 rounded-xl p-4 bg-gradient-to-b from-green-50 to-emerald-50 text-center">
            <div className="font-bold text-lg text-green-900">HoldCo</div>
            <div className="flex justify-center gap-3 mt-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-bold">Movement 70%</span>
              <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-bold">Management 30%</span>
            </div>
          </div>

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
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Single ownership structure &mdash; 70/30 at HoldCo level</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> All shareholders treated fairly at agreed group valuation</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Formalised transfer pricing across all entities</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Unified cash management, governance, and strategy</p>
            <p className="flex items-start gap-1.5"><span className="text-green-500 mt-0.5">&#x2714;</span> Future-ready structure for continued growth</p>
            <p className="flex items-start gap-1.5"><span className="text-gray-400 mt-0.5">&#x25CB;</span> <span className="text-gray-500">(To be discussed) Adactive integrated under Carats for operational efficiency</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 4 — PROPOSED TIMELINE
// ════════════════════════════════════════════════════════════════════════
function TimelineTab() {
  const phases = [
    { task: "Submit Draft LOI", start: 1, dur: 2, color: "#1e40af", group: "LOI" },
    { task: "LOI Discussion & Agreement", start: 2, dur: 2, color: "#3b82f6", group: "LOI" },
    { task: "Growth Plan & Revenue Pipeline", start: 4, dur: 6, color: "#6d28d9", group: "DD" },
    { task: "Business Unit Review", start: 4, dur: 4, color: "#8b5cf6", group: "DD" },
    { task: "Earnings Review", start: 5, dur: 5, color: "#a78bfa", group: "DD" },
    { task: "Working Capital & Balance Sheet Review", start: 6, dur: 4, color: "#c4b5fd", group: "DD" },
    { task: "Legal & Structural Review", start: 4, dur: 8, color: "#ddd6fe", group: "DD" },
    { task: "Agreement Drafting", start: 10, dur: 4, color: "#059669", group: "SPA" },
    { task: "Leadership Continuity & Team Alignment", start: 10, dur: 4, color: "#7c3aed", group: "SPA" },
    { task: "Completion", start: 14, dur: 2, color: "#10b981", group: "Close" },
  ];
  const maxW = 16;
  const gc = { LOI: "bg-blue-100 text-blue-700", DD: "bg-purple-100 text-purple-700", SPA: "bg-green-100 text-green-700", Close: "bg-emerald-100 text-emerald-700" };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="overflow-x-auto">
          <div style={{ minWidth: 700 }}>
            <div className="flex mb-1">
              <div style={{ width: 260, flexShrink: 0 }} />
              {Array.from({ length: maxW }, (_, i) => (
                <div key={i} className="flex-1 text-center text-gray-400" style={{ fontSize: 9, borderLeft: '1px solid #f3f4f6' }}>W{i + 1}</div>
              ))}
            </div>
            <div className="flex mb-3">
              <div style={{ width: 260, flexShrink: 0 }} />
              {["Month 1", "Month 2", "Month 3", "Month 4"].map((m, i) => (
                <div key={i} className="text-center text-xs font-semibold text-gray-500" style={{ flex: 4, borderLeft: '1px solid #e5e7eb' }}>{m}</div>
              ))}
            </div>

            {phases.map((p, i) => (
              <div key={i} className="flex items-center mb-2">
                <div style={{ width: 260, flexShrink: 0, paddingLeft: 4, paddingRight: 8 }} className="flex items-center gap-1.5">
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

      {/* Key DD Topics */}
      <h3 className="text-sm font-bold text-gray-700 mt-2">Key DD Topics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { num: 1, title: "5-Year Growth Plan", desc: "Develop a shared vision for the group over the next 5 years. Define revenue/margin targets, new market entry, operational effectiveness and investment plans across all BUs." },
          { num: 2, title: "Revenue Pipeline & Sustainability", desc: "Review the order book depth and new business pipeline across all BUs. Understand the sustainability of each revenue stream — contracted vs recurring vs project-based — and the pipeline of opportunities for FY2026-2027." },
          { num: 3, title: "Business Unit Review", desc: "Understand the economics of each business unit independently, including how they work together and the value of the integrated platform." },
          { num: 4, title: "Earnings Review", desc: "Understand the true operational earnings of the group." },
          { num: 5, title: "Working Capital & Balance Sheet", desc: "Review receivables, payables, and cash requirements to agree on the working capital baseline for the transaction." },
          { num: 6, title: "Leadership Continuity & Team Alignment", desc: "Runs alongside the agreement drafting. Ensure the right people are in the right roles and aligned on the growth plan going forward." },
        ].map(card => (
          <div key={card.num} className="rounded-xl p-4 border" style={{ backgroundColor: "#faf5ff", borderColor: "#e9d5ff" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#7c3aed" }}>{card.num}</span>
              <h4 className="text-sm font-bold" style={{ color: "#7c3aed" }}>{card.title}</h4>
            </div>
            <p className="text-xs text-gray-600 ml-8">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 5 — TERM SHEET (IC Discussion Draft + SPV Walkthrough)
// ════════════════════════════════════════════════════════════════════════
function TermSheetTab() {
  // Structure 3 (Javier): SPV funds S$31.4M at closing; earnout is future HoldCo liability
  const UPFRONT = 31400;          // S$31.4M paid to sellers at close = SPV funding need
  const EARNOUT_AMT = 8600;       // S$8.6M deferred earnout (paid from operating cash flow)
  const MGMT_VALUE = UPFRONT * 0.30;  // 9,420 — mgmt's 30% of closing equity (no-debt case)
  const [levX, setLevX] = useState(1.5);

  // Leverage scenarios: SPV raises S$31.4M (equity + debt) to pay upfront consideration
  const scenarios = useMemo(() => {
    return [0, 1.0, 1.5, 2.0].map(lev => {
      const debt = lev * EBITDA_2025;
      const totalEquity = UPFRONT - debt;             // equity + debt = S$31.4M at closing
      const movementEquity = totalEquity * 0.70;
      const mgmtEquity = totalEquity * 0.30;          // mgmt reinvestment for 30% of SPV
      const netCashToShareholders = UPFRONT - mgmtEquity;  // = Movement equity + debt
      const totalPotentialCash = netCashToShareholders + EARNOUT_AMT;
      return { lev, debt, totalEquity, movementEquity, mgmtEquity, netCashToShareholders, totalPotentialCash };
    });
  }, []);

  const active = scenarios.find(s => s.lev === levX) || scenarios[2];

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
      {/* How we envisage a partnership with you */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4">
          <div className="bg-blue-950 rounded-lg px-4 py-3 mb-5">
            <p className="text-xs text-blue-100 leading-relaxed"><strong className="text-white">Movement</strong> is a private investment firm backed by a global family office with generational time horizons. Through our affiliates including DVC Partners, we have invested in and grown 40+ companies across Europe, North America and Asia, with ~65% of recent transactions being add-on acquisitions to existing portfolio companies.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Partnership, Not Just Capital</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Movement + family as co-owners (70/30),</strong> aligned on long-term value creation</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Board representation</strong> for family, reserved matters protecting key decisions (hiring, capex, contracts)</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Continuation of culture and team</strong> - no day-1 changes; improvements come through working together</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Access to Movement&apos;s network:</strong> portfolio company connections, APAC deal flow, landlord/property relationships for growth and expansion</span></li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Unlocking Growth Together</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Overseas expansion:</strong> leverage Movement&apos;s family office, government and regional network to accelerate new relationships and source potential acquisition targets</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Regional delivery:</strong> institutionalise the CKD/installer model for SEA and beyond, building on Mumbai and KL as proof points</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Technology and digital:</strong> invest in AI, digital and cybersecurity capabilities across the group</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Production capacity:</strong> operational planning, selective outsourcing, and securing additional space to support growth</span></li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Building the Next Generation</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Business transformation:</strong> stretch goals across each business unit, tied to the 5-year growth plan developed during due diligence</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Organisation transformation:</strong> structured development for Gen-2 leaders, including cross-BU projects, overseas expansion leadership, and new business mandates</span></li>
                <li className="flex gap-1.5"><span className="text-amber-500 mt-0.5 flex-shrink-0">•</span><span><strong>Assessment and progression:</strong> clear criteria developed collaboratively with the family, with Movement providing coaching, benchmarking, and exposure to portfolio company best practices</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-5 bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-700 leading-relaxed">We see Carats not as a signage fabricator but as a potential regional leader providing integrated visual solutions. <strong>The partnership is designed so that when we succeed together, the 30% continuing stake could be worth multiples of its entry value.</strong></p>
          </div>
        </div>
      </div>

      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-wide">Term Sheet Outline</h2>
            <p className="text-blue-200 text-xs mt-0.5">Discussion Draft — Strictly Confidential</p>
          </div>
          <div className="flex gap-4 text-xs text-blue-200">
            <span>EV: S$40.0M</span>
            <span>~{ENTRY_MULT.toFixed(1)}x FY25 EBITDA</span>
            <span>March 2026</span>
          </div>
        </div>
      </div>

      {/* Section 1: Transaction Overview */}
      <Section title="1. Transaction Overview" tag="STANDARD">
        <div className="mt-3">
          <Row label="Target">Carats & Co Pte Ltd, Gleamedia Pte Ltd, and Adactive Pte Ltd</Row>
          <Row label="Parties">Newly formed HoldCo (SPV) — Movement 70% / Existing Shareholders 30%</Row>
          <Row label="Transaction">100% of all operating entities consolidated into HoldCo. Existing shareholders receive cash and/or rollover equity at agreed group valuation.</Row>
          <Row label="Enterprise Value">{fmtFull(EV)} (~{ENTRY_MULT.toFixed(1)}x unaudited FY2025 EBITDA of {fmtFull(EBITDA_2025)}). Assumes FY2025 audited EBITDA of no less than S$7,172,000</Row>
          <Row label="Equity Value">Subject to independent financial due diligence on debt, cash, and working capital positions at completion</Row>
          <Row label="Payment">Combination of upfront cash consideration and deferred earnout. Final amounts determined per EV-to-equity bridge adjustments.</Row>
          <Row label="Basis">Cash-free, debt-free, subject to normalised working capital</Row>
          <Row label="Adjustments">Equity value derived from EV-to-equity bridge (less debt, working capital normalisation, operating reserve; plus unrestricted cash). Final positions confirmed through independent financial due diligence, calculated on a consistent basis as at the locked box date of 31 March 2026.</Row>
        </div>
        <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 text-xs text-gray-600">
          <strong className="text-gray-800">Valuation note:</strong> Subject to independent financial due diligence. Final EV may be adjusted based on audited FY2025 results and working capital true-up at completion. We suggest a locked box date of [31 March 2026] for better transaction certainty, with no material cash leakage from that date until completion except as mutually agreed.
        </div>
      </Section>

      {/* Section 2: Rollover Equity */}
      <Section title="2. Rollover Equity" tag="TBD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="Rollover">Existing family stakeholders will elect to rollover equity into HoldCo, representing 30% of the total equity on mutually agreed terms. We can discuss the list of rollover stakeholders and their respective stakes with you during diligence.</Row>
          <Row label="Purpose">Family members to continue to drive long-term growth of the unified group.</Row>
          <Row label="Governance">Rollover shareholders would hold equity alongside Movement&apos;s 70% stake and be subject to the same shareholder agreement terms.</Row>
        </div>
      </Section>


      {/* Section 3: Earnout Structure */}
      <Section title="3. Earnout Structure" tag="STANDARD" defaultOpen={false}>
        <table className="w-full text-xs mt-3">
          <thead><tr className="bg-gray-50 text-gray-500"><th className="text-left py-2 px-3 font-semibold">Parameter</th><th className="text-left py-2 px-3 font-semibold">Year 1</th><th className="text-left py-2 px-3 font-semibold">Year 2</th><th className="text-left py-2 px-3 font-semibold">Total Earnout</th></tr></thead>
          <tbody>
            <tr><td className="py-2 px-3">Tranche</td><td className="py-2 px-3 font-mono">30% (S$2.58M)</td><td className="py-2 px-3 font-mono">70% (S$6.02M)</td><td className="py-2 px-3 font-mono">S$8,600,000 (if all Targets achieved)</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">EBITDA Target</td><td className="py-2 px-3 font-mono">{fmtFull(7500)}</td><td className="py-2 px-3 font-mono">{fmtFull(8000)}</td><td className="py-2 px-3"></td></tr>
            <tr><td className="py-2 px-3">Mgmt Forecast</td><td className="py-2 px-3 font-mono text-gray-400">{fmtFull(7890)}</td><td className="py-2 px-3 font-mono text-gray-400">{fmtFull(8522)}</td><td className="py-2 px-3"></td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">Floor</td><td className="py-2 px-3 font-mono">S$6,000,000 (80% of target)</td><td className="py-2 px-3 font-mono">S$6,400,000 (80% of target)</td><td className="py-2 px-3"></td></tr>
            <tr><td className="py-2 px-3">Pro Rata Scaling</td><td className="py-2 px-3" colSpan={3}>Earnout scales proportionally with performance. The full amount is payable when the target is achieved. Any balance carries forward to Year 2.</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">Measurement</td><td className="py-2 px-3" colSpan={3}>EBITDA for earnout purposes calculated on the same normalised basis agreed during due diligence. Any disagreements on the calculation may be referred to an independent accounting firm appointed by Holdco.</td></tr>
          </tbody>
        </table>

        {/* Worked Example */}
        <div className="mt-5 bg-blue-50 rounded-xl p-5">
          <div className="text-sm font-bold text-blue-900 mb-2">How does the pro rata scaling work?</div>
          <p className="text-xs text-gray-700 mb-3">The formula is: <strong>Earnout = (Actual EBITDA ÷ Target EBITDA) × Tranche</strong></p>
          <div className="bg-white rounded-lg p-4 text-xs text-gray-700">
            <p className="font-semibold mb-1">Worked example — Year 1 EBITDA comes in at S$7.0M (below S$7.5M Target and above S$6.0M Floor):</p>
            <p>Earnout = S$7.0M ÷ S$7.5M × S$2.58M</p>
            <p>= <strong>93.3% × S$2.58M = S$2.41M</strong></p>
            <p className="mt-2 text-gray-500">The remaining S$0.17M (S$2.58M less S$2.41M) carries forward to Year 2. To unlock this amount, Year 2 EBITDA needs to exceed S$8.0M by the shortfall amount (S$0.5M), i.e. achieve at least S$8.5M.</p>
          </div>
        </div>

        {/* Q&A Scenarios */}
        <div className="mt-5">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Scenarios — Q&A</h4>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-800 mb-1">Q: What if both Year 1 and Year 2 EBITDA targets are met?</div>
              <div className="text-xs text-gray-600">A: Full earnout of {fmtFull(DEFERRED_TOTAL)} is paid — S$2.58M after Year 1 and S$6.02M after Year 2.</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-800 mb-1">Q: What if Year 1 EBITDA is below the target but above the floor (80%)?</div>
              <div className="text-xs text-gray-600">A: The Year 1 tranche (S$2.58M) pays out <strong>pro rata</strong> based on the percentage of the target achieved. The formula is: <em>Earnout = (Actual ÷ Target) × Tranche</em>. For example, if Year 1 EBITDA is S$7.0M: earnout = S$7.0M ÷ S$7.5M × S$2.58M = <strong>93.3% × S$2.58M = S$2.41M</strong>. The unpaid S$0.17M carries forward, but recovering it requires Year 2 to <strong>exceed</strong> its own S$8.0M target by the EBITDA shortfall in Year 1 (S$0.5M in this case). Year 2 would need S$8.5M to fully recover the carried amount.</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-800 mb-1">Q: What if Year 1 EBITDA falls below the floor (80% of target)?</div>
              <div className="text-xs text-gray-600">A: No Year 1 earnout is paid, and there is also no carry forward or recovery in Year 2.</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-800 mb-1">Q: What if Year 2 EBITDA falls between the target and floor?</div>
              <div className="text-xs text-gray-600">A: The Year 2 tranche (S$6.02M) pays out <strong>pro rata</strong> based on the percentage of the target achieved, using the same formula: <em>Earnout = (Actual ÷ Target) × Tranche</em>. Any unpaid balance carries forward to Year 3, which uses the same target (S$8.0M) and floor (S$6.4M) as Year 2.</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-800 mb-1">Q: What if both Year 1 and Year 2 EBITDA fall below the floor?</div>
              <div className="text-xs text-gray-600">A: No earnout is payable for either year. The upfront cash received at closing (i.e. S$19.4M in our example) remains unaffected.</div>
            </div>
          </div>
        </div>

        {/* Mechanics & Protections */}
        <div className="mt-5">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Mechanics & Protections</h4>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-800 mb-1">Q: How is EBITDA measured for earnout purposes — and who decides?</div>
              <div className="text-xs text-gray-600">A: EBITDA for earnout measurement will be prepared by the finance team and agreed upon by all shareholders (Movement and Family). The definition of EBITDA will be mutually agreed during due diligence — this will specify how various EBITDA components such as one-off/non-recurring items, management fees, intercompany charges, and other normalisations are treated to ensure a fair and consistent basis of measurement. In the unlikely event where parties are not able to agree on how Year 1 and Year 2 EBITDA are calculated, we can involve an independent accounting firm to verify the amounts against the pre-agreed formula.</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-800 mb-1">Q: Is the upfront cash payment unconditional?</div>
              <div className="text-xs text-gray-600">A: Yes. The upfront cash payable at completion is unconditional. The earnout is a separate, additional component — non-achievement of earnout targets does not affect the upfront payment already received.</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: Purchase Price Adjustments */}

      {/* Section 4: Governance */}
      <Section title="4. Governance & Shareholder Rights" tag="STANDARD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="Board">Number of Board Seats to be agreed by all shareholders. Majority appointed by Movement, including the Chairman position.</Row>
          <Row label="Reserved Matters">Capex above threshold, new indebtedness, related-party transactions, dividend policy, key executive hires/terminations, material contracts, change of business</Row>
          <Row label="Info Rights">Monthly management accounts, quarterly board reporting, annual audited statements</Row>
          <Row label="Anti-Dilution">Pre-emptive rights on new issuances to enable maintaining of pro rata ownership</Row>
          <Row label="Sale of Shares">Standard put/call options pegged to fair market value formula, with right-of-first-refusal and tag-along rights for existing shareholders on any sale by other shareholders. Timing and trigger conditions to be agreed by all shareholders during due diligence.</Row>
          <Row label="Management Continuity">Continuing family shareholders involved in day-to-day operations will enter into service agreements with the Group on mutually agreed terms, to be finalised during due diligence. Movement is committed to continuity and stability for all team members.</Row>
          <Row label="Ordinary Course">Between signing and completion, the Group continues to operate in the normal course of business.</Row>
        </div>
      </Section>

      {/* Section 5: DD & Conditions */}
      <Section title="5. Due Diligence & Conditions Precedent" tag="STANDARD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="DD Scope">Financial, legal, tax, commercial, and operational. 3–4 months indicative period post-LOI execution.</Row>
          <Row label="Key Focus">
            <div className="space-y-1">
              <p>(1) 5-year growth plan & revenue pipeline sustainability</p>
              <p>(2) BU economics — standalone and go-forward</p>
              <p>(3) Earnings quality — normalised EBITDA, intercompany eliminations</p>
              <p>(4) Working capital & balance sheet — receivables ageing, cash requirements</p>
              <p>(5) Legal & structural — contracts, IP, regulatory, employment</p>
              <p>(6) Leadership continuity & team alignment</p>
              <p className="text-gray-400 italic">Indicative list for illustration only, actual diligence scope to be determined in consultation with professional advisors</p>
            </div>
          </Row>
          <Row label="Conditions">Satisfactory due diligence; no material adverse change; audited FY2025 confirmation; formalised transfer pricing; key leadership continuity arrangements agreed; any other key material findings from diligence; locked box compliance confirmed as at [31 March 2026]</Row>
        </div>
      </Section>

      {/* Section 6: Funding Sources */}
      <Section title="6. Funding Sources" tag="STANDARD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="Equity">Movement fund (patient capital, MAS-approved family office domiciled in Singapore). No financing contingency.</Row>
          <Row label="Transaction Financing">Potential senior-secured debt at HoldCo level. Quantum and financing terms to be discussed and decided amongst shareholders during diligence.</Row>
        </div>
      </Section>

      {/* Section 7: Indicative Timeline */}
      <Section title="7. Indicative Timeline (~4 months from LOI signing)" tag="STANDARD" defaultOpen={false}>
        <table className="w-full text-xs mt-3">
          <thead><tr className="bg-gray-50 text-gray-500"><th className="text-left py-2 px-3 font-semibold">Phase</th><th className="text-left py-2 px-3 font-semibold">Activity</th><th className="text-left py-2 px-3 font-semibold">Weeks</th></tr></thead>
          <tbody>
            <tr><td className="py-2 px-3 font-bold text-blue-800">LOI</td><td className="py-2 px-3">Submit draft, discussion & agreement</td><td className="py-2 px-3 font-mono">W1–3</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3 font-bold text-purple-800">DD</td><td className="py-2 px-3">All workstreams (financial, legal, tax, commercial and operational)</td><td className="py-2 px-3 font-mono">W4–11</td></tr>
            <tr><td className="py-2 px-3 font-bold text-green-800">SPA</td><td className="py-2 px-3">Agreement drafting, leadership alignment</td><td className="py-2 px-3 font-mono">W10–13</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3 font-bold text-emerald-800">Close</td><td className="py-2 px-3">Signing & closing</td><td className="py-2 px-3 font-mono">W14–16</td></tr>
          </tbody>
        </table>
      </Section>

      {/* Section 8: Exclusivity */}
      <Section title="8. Exclusivity" tag="CORE" defaultOpen={false}>
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">If the family is keen to proceed, we would request an exclusivity period of 4 months from signing the LOI. During this time:</p>
          <div className="text-xs text-gray-700 space-y-2">
            <p>The company and its shareholders would cease discussions with any other potential buyers or investors</p>
            <p>No soliciting or entertaining alternative offers during the exclusivity period</p>
            <p>If an unsolicited approach comes in from a third party, the company would promptly let Movement know</p>
          </div>
          <p className="text-xs text-gray-500">This is standard for transactions like this — it gives both sides the confidence to invest significant time and resources into due diligence and negotiations.</p>
        </div>
      </Section>
      <div className="border-t-2 border-dashed border-gray-300 my-6" />

      {/* Section 9: SPV Structure & Management Rollover */}
      <Section title="9. SPV Structure & Management Rollover" tag="CORE">
        <p className="text-xs text-gray-500 mt-3 mb-4">
          Illustrative total consideration of S$40M — comprising <strong className="text-gray-800">{fmt(UPFRONT)} upfront</strong> at close and <strong className="text-gray-800">{fmt(EARNOUT_AMT)} deferred earnout</strong> over 2 years. The SPV raises {fmt(UPFRONT)} at closing (equity + debt) to pay the upfront consideration; the earnout is paid later from operating cash flow. Management <strong className="text-gray-800">reinvests</strong> a portion of their proceeds back into the SPV for their 30% continuing stake. The more debt at SPV level, the less equity is needed — meaning <strong className="text-green-700">less reinvestment and more cash to the family at close</strong>.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-xs text-gray-600 mb-4">
          <strong className="text-gray-800">Note:</strong> The figures below are illustrative. Final amounts will be adjusted for actual net debt/cash and working capital at completion per the Purchase Price Adjustments mechanism.
        </div>

        {/* 3-step summary boxes */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="border-2 border-gray-200 rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Step 1: Upfront</div>
            <div className="text-2xl font-bold">{fmt(UPFRONT)}</div>
            <div className="text-xs text-gray-500 mt-1">Paid to all shareholders at close</div>
            <div className="text-[10px] text-gray-400 mt-0.5">of S$40M total consideration</div>
          </div>
          <div className="border-2 border-blue-400 rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold text-blue-500 uppercase mb-2">Step 2: Reinvestment</div>
            <div className="text-2xl font-bold text-blue-600">({fmt(active.mgmtEquity)})</div>
            <div className="text-xs text-gray-500 mt-1">Mgmt reinvests for 30% SPV equity</div>
            <div className="text-[10px] text-gray-400 mt-0.5">↑ Less with more debt</div>
          </div>
          <div className="border-2 border-green-400 rounded-xl p-4 text-center bg-green-50">
            <div className="text-[10px] font-bold text-green-600 uppercase mb-2">Net Cash at Close</div>
            <div className="text-2xl font-bold text-green-700">{fmt(active.netCashToShareholders)}</div>
            <div className="text-xs text-gray-500 mt-1">Cash home to all shareholders</div>
            <div className="text-[10px] text-green-600 font-semibold mt-0.5">+ {fmt(EARNOUT_AMT)} earnout potential</div>
          </div>
        </div>

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

        {/* Stacked bars */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 w-[100px] text-right">SPV Funding</span>
            <div className="flex-1 h-9 bg-gray-100 rounded-md overflow-hidden flex">
              <div className="bg-blue-900 h-full flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.movementEquity / UPFRONT) * 100}%` }}>
                {(active.movementEquity / UPFRONT) * 100 > 14 ? fmt(active.movementEquity) : ''}
              </div>
              <div className="bg-blue-500 h-full flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.mgmtEquity / UPFRONT) * 100}%` }}>
                {(active.mgmtEquity / UPFRONT) * 100 > 14 ? fmt(active.mgmtEquity) : ''}
              </div>
              {active.debt > 0 && (
                <div className="bg-amber-500 h-full flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.debt / UPFRONT) * 100}%` }}>
                  {(active.debt / UPFRONT) * 100 > 10 ? fmt(active.debt) : ''}
                </div>
              )}
            </div>
            <span className="text-xs font-mono font-bold w-[70px]">{fmt(UPFRONT)}</span>
          </div>
          <div className="flex gap-4 ml-[112px] text-[10px] text-gray-500 mb-3">
            <span><span className="inline-block w-2.5 h-2.5 bg-blue-900 rounded-sm mr-1"></span>Movement Equity</span>
            <span><span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-sm mr-1"></span>Mgmt Reinvestment</span>
            <span><span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-sm mr-1"></span>Acq. Debt</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 w-[100px] text-right">Upfront Split</span>
            <div className="flex-1 h-9 bg-gray-100 rounded-md overflow-hidden flex">
              <div className="bg-green-500 h-full flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.netCashToShareholders / UPFRONT) * 100}%` }}>
                {fmt(active.netCashToShareholders)} net cash
              </div>
              <div className="bg-blue-500 h-full flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.mgmtEquity / UPFRONT) * 100}%` }}>
                {fmt(active.mgmtEquity)} reinvested
              </div>
            </div>
            <span className="text-xs font-mono font-bold w-[70px]">{fmt(UPFRONT)}</span>
          </div>
        </div>

        {/* Two side-by-side tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Cash to Shareholders */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2">Cash to Shareholders</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left py-1.5 px-2 font-semibold">S$&apos;000</th>
                  {scenarios.map(s => <th key={s.lev} className={`text-right py-1.5 px-2 font-semibold ${s.lev === levX ? 'bg-amber-50 text-amber-800' : ''}`}>{s.lev === 0 ? '0x' : `${s.lev.toFixed(1)}x`}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1.5 px-2">Upfront to sellers</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(UPFRONT)}</td>)}</tr>
                <tr className="bg-gray-50"><td className="py-1.5 px-2">(-) Mgmt Reinvestment</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono ${s.lev === levX ? 'bg-amber-50' : ''}`}>({fmtK(s.mgmtEquity)})</td>)}</tr>
                <tr className="bg-green-50 border-t-2 border-gray-200"><td className="py-1.5 px-2 font-bold text-green-800">Net Cash at Close</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono font-bold text-green-800 ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.netCashToShareholders)}</td>)}</tr>
                <tr><td className="py-1.5 px-2 text-gray-400">(+) Earnout (if met)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono text-gray-400 ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(EARNOUT_AMT)}</td>)}</tr>
                <tr className="bg-gray-50 font-bold"><td className="py-1.5 px-2">Total Potential Cash</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono font-bold ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.totalPotentialCash)}</td>)}</tr>
              </tbody>
            </table>
          </div>
          {/* SPV Funding Sources */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2">SPV Funding Sources</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left py-1.5 px-2 font-semibold">S$&apos;000</th>
                  {scenarios.map(s => <th key={s.lev} className={`text-right py-1.5 px-2 font-semibold ${s.lev === levX ? 'bg-amber-50 text-amber-800' : ''}`}>{s.lev === 0 ? '0x' : `${s.lev.toFixed(1)}x`}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-1.5 px-2">Movement Equity (70%)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.movementEquity)}</td>)}</tr>
                <tr className="bg-gray-50"><td className="py-1.5 px-2">Mgmt Rollover (30%)</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(s.mgmtEquity)}</td>)}</tr>
                <tr><td className="py-1.5 px-2">Acquisition Debt</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono text-amber-600 ${s.lev === levX ? 'bg-amber-50' : ''}`}>{s.debt === 0 ? 'S$0' : fmtK(s.debt)}</td>)}</tr>
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-200"><td className="py-1.5 px-2">Total Sources at Close</td>{scenarios.map(s => <td key={s.lev} className={`text-right py-1.5 px-2 font-mono font-bold ${s.lev === levX ? 'bg-amber-50' : ''}`}>{fmtK(UPFRONT)}</td>)}</tr>
              </tbody>
            </table>
          </div>
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
              <div className="text-sm font-bold text-blue-900 mb-1">HoldCo raises {fmt(UPFRONT)} to pay the upfront consideration</div>
              <div className="text-xs text-gray-500 mb-2">The {fmt(UPFRONT)} comes from equity (Movement + management) and optionally a bank loan. The more HoldCo borrows, the less equity is needed. The {fmt(EARNOUT_AMT)} earnout is paid later from operating cash flow.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-[11px] font-semibold text-gray-500 mb-1.5">SOURCES OF FUNDS AT CLOSING</div>
                <div className="flex h-9 rounded-md overflow-hidden mb-2">
                  <div className="bg-blue-900 flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.movementEquity / UPFRONT) * 100}%` }}>
                    {(active.movementEquity / UPFRONT) * 100 > 14 ? fmt(active.movementEquity) : ''}
                  </div>
                  <div className="bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.mgmtEquity / UPFRONT) * 100}%` }}>
                    {(active.mgmtEquity / UPFRONT) * 100 > 14 ? fmt(active.mgmtEquity) : ''}
                  </div>
                  {active.debt > 0 && (
                    <div className="bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold transition-all" style={{ width: `${(active.debt / UPFRONT) * 100}%` }}>
                      {(active.debt / UPFRONT) * 100 > 10 ? fmt(active.debt) : ''}
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
                  <div className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold">{fmt(UPFRONT)}</div><div className="text-[10px] text-gray-400">Upfront</div></div>
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
              <div className="text-sm font-bold text-blue-900 mb-1">HoldCo buys 100% of the group — {fmt(UPFRONT)} paid upfront + {fmt(EARNOUT_AMT)} deferred</div>
              <div className="text-xs text-gray-500 mb-2">Total consideration is S$40M. Shareholders receive {fmt(UPFRONT)} at close; the remaining {fmt(EARNOUT_AMT)} is paid as earnout over 2 years if EBITDA targets are met.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-4 py-2.5 bg-green-50 min-w-[120px]"><div className="text-base font-bold text-green-700">{fmt(UPFRONT)}</div><div className="text-[10px] text-gray-500">Upfront at close</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-dashed border-purple-400 rounded-lg px-4 py-2.5 bg-purple-50 min-w-[120px]"><div className="text-base font-bold text-purple-600">{fmt(EARNOUT_AMT)}</div><div className="text-[10px] text-gray-500">Earnout (deferred)</div></div>
                  <span className="text-gray-400 font-bold">=</span>
                  <div className="border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white min-w-[120px]"><div className="text-base font-bold">S$40.0M</div><div className="text-[10px] text-gray-400">Total consideration</div></div>
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
              <div className="text-sm font-bold text-blue-900 mb-1">Management reinvests {fmt(active.mgmtEquity)} back for 30% ownership</div>
              <div className="text-xs text-gray-500 mb-2">Of the {fmt(UPFRONT)} upfront, management puts {fmt(active.mgmtEquity)} back into HoldCo. The bank loan means they keep more.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold">{fmt(UPFRONT)}</div><div className="text-[10px] text-gray-400">Upfront received</div></div>
                  <span className="text-gray-400 font-bold text-lg">−</span>
                  <div className="border-2 border-blue-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-blue-500">{fmt(active.mgmtEquity)}</div><div className="text-[10px] text-gray-400">Mgmt reinvests</div></div>
                  <span className="text-gray-400 font-bold text-lg">=</span>
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-green-50 min-w-[120px]"><div className="text-xl font-bold text-green-700">{fmt(active.netCashToShareholders)}</div><div className="text-[10px] text-gray-500">Net cash at close</div></div>
                </div>
              </div>
              <div className="bg-blue-50 border-l-3 border-blue-400 rounded-r-lg p-3 text-xs text-gray-600 mt-3">
                <strong>Why not reinvest the full {fmt(MGMT_VALUE)}?</strong> Because the bank loan covers part of the {fmt(UPFRONT)}. Less equity is needed, so management&apos;s 30% share costs less. At {levX === 0 ? 'no debt' : `${levX.toFixed(1)}x`} leverage, reinvestment drops from {fmt(MGMT_VALUE)} to <strong className="text-blue-600">{fmt(active.mgmtEquity)}</strong>.
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
              <div className="text-sm font-bold text-green-800 mb-1">Total Consideration: cash + 30% ownership + earnout potential</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-green-50 flex-1 max-w-[150px]"><div className="text-base font-bold text-green-700">{fmt(active.netCashToShareholders)}</div><div className="text-[10px] text-gray-500">Net cash at close</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-blue-500 rounded-lg px-3 py-2 bg-white flex-1 max-w-[150px]"><div className="text-base font-bold text-blue-500">30%</div><div className="text-[10px] text-gray-500">Ownership in unified group</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-purple-300 rounded-lg px-3 py-2 bg-purple-50 flex-1 max-w-[150px]"><div className="text-base font-bold text-purple-600">{fmt(EARNOUT_AMT)}</div><div className="text-[10px] text-gray-500">Earnout if targets met</div></div>
                </div>
                <div className="text-center mt-3 text-xs text-gray-500">Total potential cash: <strong className="text-green-700">{fmt(active.totalPotentialCash)}</strong></div>
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

      </Section>

      {/* Section 10: Purchase Price Adjustments */}
      <Section title="10. Purchase Price Adjustments" tag="STANDARD" defaultOpen={false}>
        <div className="mt-3">
          <Row label="NWC Adjustment">All payments of the Purchase Price shall be subject to a net working capital adjustment. The applicable target net working capital (&quot;NWC Target&quot;) shall be agreed to by the Parties following the completion of the Purchaser&apos;s financial due diligence.</Row>
          <Row label="Net Debt / Cash">Final equity value adjusted for actual net debt (or net cash) at completion versus the reference balance used in the EV-to-equity bridge.</Row>
          <Row label="True-Up">Completion accounts to be prepared post-close. Any variance between actual NWC and the agreed NWC Target will result in a dollar-for-dollar adjustment to the Purchase Price (up or down).</Row>
        </div>
      </Section>

      {/* Non-binding */}
      <div className="text-[10px] text-gray-400 text-center py-4">
        This term sheet outline is indicative and non-binding. Intended for internal IC discussion only. Final terms subject to satisfactory DD, definitive documentation, and all necessary approvals.
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// TAB 6 — FAMILY OVERVIEW (layman-friendly summary + leadership framework)
// ════════════════════════════════════════════════════════════════════════
function FamilyOverviewTab() {
  const UPFRONT_CASH = 19400;
  const ROLLOVER = 12000;
  const EARNOUT_AMT = 8600;

  const FamilySection = ({ title, icon, children, defaultOpen = true }: { title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5 shadow-sm">
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left">
          <span className="text-xl">{icon}</span>
          <span className="font-bold text-base text-gray-900 flex-1">{title}</span>
          <span className={`text-gray-400 transition-transform ${open ? '' : '-rotate-90'}`}>▼</span>
        </button>
        {open && <div className="px-6 pb-6 border-t border-gray-100">{children}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 text-white text-center">
        <h2 className="text-xl font-bold mb-2">Partnership Proposal — For the CARATS Family</h2>
        <p className="text-blue-200 text-sm max-w-2xl mx-auto">A straightforward explanation of how this partnership works, what it means for the family financially, and how we plan to grow the business together.</p>
      </div>

      {/* 1. What are we proposing? */}
      <FamilySection title="What Are We Proposing?" icon="🤝">
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">Movement would like to partner with the CARATS family by acquiring a <strong>70% stake</strong> in all three businesses — Carats & Co, Gleamedia, and Adactive — while the <strong>management team retains 30%</strong> and continues running the day-to-day operations.</p>
          <p className="text-sm text-gray-700 leading-relaxed">All three businesses will sit under one holding company (&quot;HoldCo&quot;), making it simpler to manage the group as a whole. This replaces the current setup of three separate companies with different shareholdings.</p>
          <div className="bg-blue-50 rounded-xl p-4 mt-3">
            <div className="text-sm font-semibold text-blue-900 mb-2">The agreed value of the group is S$40 million</div>
            <p className="text-xs text-gray-600">This is based on approximately 5.6 times the group&apos;s earnings (EBITDA) of S$7.17 million in FY2025. The final number may adjust slightly after we complete our financial review together.</p>
          </div>
        </div>
      </FamilySection>

      {/* 2. How much cash will the family receive? */}
      <FamilySection title="How Much Cash Will the Family Receive?" icon="💰">
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">The total consideration of S$40 million is split into three parts:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="text-2xl font-bold text-green-700">S$19.4M</div>
              <div className="text-sm font-semibold text-green-800 mt-1">Paid upfront at closing</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">S$12.0M</div>
              <div className="text-sm font-semibold text-blue-800 mt-1">30% rollover into HoldCo</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{fmt(EARNOUT_AMT)}</div>
              <div className="text-sm font-semibold text-purple-800 mt-1">Earnout — paid over 2 years</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <div className="text-center">
              <div className="text-xs text-gray-500">If all earnout targets are met, total consideration to shareholders:</div>
              <div className="text-xl font-bold text-gray-900 mt-1">S$40.0M</div>
            </div>
          </div>
        </div>
      </FamilySection>

      {/* 3. How does the earnout work? */}
      <FamilySection title="How Does the Earnout Work?" icon="📊">
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">The S$8.6M earnout rewards the family for continued strong performance. It&apos;s paid in two instalments based on EBITDA (essentially profit before interest, tax, and accounting adjustments):</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm font-bold text-gray-900 mb-2">Year 1 — S$2.58M (30%)</div>
              <div className="text-xs text-gray-600 space-y-1.5">
                <p><strong>Target:</strong> EBITDA of S$7.5M</p>
                <p><strong>Minimum threshold:</strong> S$6.0M (80% of target)</p>
                <p>Hit the target → full S$2.58M is paid</p>
                <p>Between S$6.0M and S$7.5M → pro-rata payout (actual ÷ target × tranche)</p>
                <p>Below S$6.0M → no payment for this year and the amount is forfeited</p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm font-bold text-gray-900 mb-2">Year 2 — S$6.02M (70%)</div>
              <div className="text-xs text-gray-600 space-y-1.5">
                <p><strong>Target:</strong> EBITDA of S$8.0M</p>
                <p><strong>Minimum threshold:</strong> S$6.4M (80% of target)</p>
                <p>Same pro-rata scaling as Year 1</p>
                <p>If Year 1 EBITDA was between the floor and target (pro-rata paid), the unpaid portion carries forward and can be recovered if Year 2 <em>exceeds</em> its target</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm font-bold text-blue-900 mb-2">How does the pro-rata scaling actually work?</div>
            <p className="text-xs text-gray-700 mb-2">The formula is straightforward: <strong>Payout = (Actual EBITDA ÷ Target EBITDA) × Tranche</strong></p>
            <div className="bg-white rounded-lg p-3 text-xs text-gray-700">
              <p className="font-semibold mb-1">Worked example — Year 1 EBITDA comes in at S$7.0M:</p>
              <p>Payout = S$7.0M ÷ S$7.5M × S$2.58M</p>
              <p>= <strong>93.3% × S$2.58M = S$2.41M paid</strong></p>
              <p className="mt-2 text-gray-500">The remaining S$0.17M (S$2.58M less S$2.41M) carries forward to Year 2. To recover it, Year 2 EBITDA needs to exceed S$8.0M by the shortfall amount (S$0.5M), i.e. hit at least S$8.5M.</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 text-sm text-gray-700">
            <strong>Important:</strong> The earnout targets (S$7.5M and S$8.0M) are set <em>below</em> management&apos;s own forecasts of S$7.89M and S$8.52M. This means that if the business performs in line with what the team expects, the full earnout should be achieved.
          </div>

          {/* Q&A Scenarios */}
          <div className="mt-2">
            <h4 className="text-sm font-bold text-gray-700 mb-3">Common Questions</h4>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-800 mb-1">Q: What if both Year 1 and Year 2 targets are met?</div>
                <div className="text-xs text-gray-600">A: The full S$8.6M earnout is paid — S$2.58M after Year 1 and S$6.02M after Year 2. Combined with the S$19.4M upfront cash, total cash to shareholders reaches S$28.0M (plus the 30% continuing stake in HoldCo).</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-800 mb-1">Q: What if Year 1 EBITDA is below the target but above the minimum (80%)?</div>
                <div className="text-xs text-gray-600">A: You receive a pro-rata portion of the Year 1 tranche based on the percentage of the target achieved. For example, S$7.0M EBITDA = 93.3% of the S$7.5M target, so 93.3% × S$2.58M = S$2.41M is paid. The remaining S$0.17M (S$2.58M less S$2.41M) carries forward — to recover it, Year 2 EBITDA must <strong>exceed</strong> its own S$8.0M target by the shortfall amount (S$0.5M in this case, i.e. Year 2 needs S$8.5M).</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-800 mb-1">Q: What if Year 1 EBITDA falls below the minimum threshold (S$6.0M)?</div>
                <div className="text-xs text-gray-600">A: No Year 1 earnout is paid. The amount is forfeited and cannot be carried forward or recovered in Year 2.</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-800 mb-1">Q: What if both years fall below the minimum threshold?</div>
                <div className="text-xs text-gray-600">A: No earnout is payable. Total cash received would be the S$19.4M upfront amount only (plus the 30% continuing stake in HoldCo).</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-800 mb-1">Q: How is EBITDA measured — and who decides?</div>
                <div className="text-xs text-gray-600">A: EBITDA will be prepared by the finance team and agreed upon by all shareholders (Movement and Family). The exact definition of &quot;Adjusted EBITDA&quot; will be agreed during due diligence — covering adjustments for one-off items, management fees, and other normalisations to ensure a fair and consistent basis. In the event of a disagreement, an independent accounting firm may be brought in to resolve the dispute.</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-800 mb-1">Q: Does management keep running the business during the earnout period?</div>
                <div className="text-xs text-gray-600">A: Yes. Management retains day-to-day operational control, subject to agreed reserved matters. This ensures management has a fair opportunity to hit the targets. If there&apos;s a disagreement on the earnout calculation, it gets referred to an independent accounting firm whose decision is final.</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-blue-800 mb-1">Q: Is the upfront cash guaranteed regardless of earnout results?</div>
                <div className="text-xs text-gray-600">A: Yes. The S$19.4M upfront cash at closing is unconditional and cannot be clawed back. The earnout is a separate, additional component — missing earnout targets does not affect the upfront payment already received.</div>
              </div>
            </div>
          </div>
        </div>
      </FamilySection>

      {/* 4. What protections does the family have? */}
      <FamilySection title="What Protections Does the Family Have?" icon="🛡️">
        <div className="mt-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-2">Guaranteed exit path</div>
              <p className="text-xs text-gray-600">After a lock-up period (3–5 years), the 30% holders have a <strong>put option</strong> — the right to sell their shares to Movement at fair market value, determined by an independent valuation. No more being stuck in an illiquid private company.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-2">Right of first refusal</div>
              <p className="text-xs text-gray-600">If any 30% holder wants to sell their shares, Movement has the right to buy them first. This prevents unwanted third parties from entering the shareholder base.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-2">Tag-along rights</div>
              <p className="text-xs text-gray-600">If Movement ever sells its 70% stake to someone else, the family has the right to sell their 30% <strong>on the same terms and at the same price</strong>. You won&apos;t be left behind with a new majority owner you didn&apos;t choose.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-2">Board representation & oversight</div>
              <p className="text-xs text-gray-600">A seat on the board is reserved for continuing management. Major decisions — large spending, new debt, key hires — require board approval, giving the family a voice in how the company is run.</p>
            </div>
          </div>
          <div className="bg-red-50 border-l-4 border-red-400 p-3 text-xs text-red-800 font-semibold">
            <strong>Important:</strong> Detailed mechanics for all of the above will be set out in the shareholders&apos; agreement (SHA) and sale and purchase agreement (SPA).
          </div>
        </div>
      </FamilySection>

      {/* 5. Growth Vision */}
      <FamilySection title="Where Do We See the Group Going?" icon="🚀">
        <div className="mt-3 space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-gray-700">
            <strong>To be further discussed and refined with Management during due diligence.</strong>
          </div>

          {/* Carats */}
          <div className="rounded-xl border-2 border-red-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">1</div>
              <div>
                <div className="text-sm font-bold text-red-700">Carats & Co — Regional Signage Leader</div>
                <div className="text-[11px] text-gray-500">Core business • ~S$20M revenue</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 space-y-2 ml-10">
              <p><strong>Organic growth:</strong> Leverage the S$51M backlog and long-term Stellar Ace/Lifestyle contracts (through 2033–2034) as a stable base. Focus on winning more institutional clients — transit operators, airports, commercial landlords — and extend into adjacent services like digital signage integration and smart wayfinding.</p>
              <p><strong>Regional expansion:</strong> Replicate the Singapore model in Malaysia and Australia, where infrastructure-led signage demand is growing. Enter via partnerships with local contractors or through targeted acquisitions of smaller signage firms that provide an instant client base and local licences.</p>
              <p><strong>Margin improvement:</strong> Standardise fabrication processes and invest in modular signage systems that reduce per-project engineering hours. Rationalise the subcontractor base to improve procurement terms.</p>
            </div>
          </div>

          {/* Gleamedia */}
          <div className="rounded-xl border-2 border-orange-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">2</div>
              <div>
                <div className="text-sm font-bold text-orange-700">Gleamedia — Scale the Media Network</div>
                <div className="text-[11px] text-gray-500">OOH media & advertising • ~S$6M revenue</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 space-y-2 ml-10">
              <p><strong>Supply-side — more screens, more locations:</strong> Penetrate more landlords and venue operators (malls, transit hubs, commercial buildings) with a capex-light model — Gleamedia provides the media management expertise; the landlord provides the location. Target a 2–3x expansion of the installed screen base over 5 years.</p>
              <p><strong>Demand-side — more advertisers, higher yields:</strong> Build a dedicated sales team to pitch national and regional advertisers. Offer programmatic buying options (automated, data-driven ad placement) to attract digital-native advertisers who currently bypass traditional OOH. Package cross-network deals — advertisers buy presence across multiple locations in a single campaign.</p>
              <p><strong>Data monetisation:</strong> Equip screens with anonymised audience measurement (footfall, dwell time, demographic profiling via Adactive&apos;s camera analytics). Advertisers pay a premium for measurable impressions versus traditional &quot;eyeball guesses.&quot;</p>
            </div>
          </div>

          {/* Adactive */}
          <div className="rounded-xl border-2 border-yellow-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-bold text-yellow-600">3</div>
              <div>
                <div className="text-sm font-bold text-yellow-700">Adactive — The Tech Layer That Goes Global First</div>
                <div className="text-[11px] text-gray-500">Digital kiosks & software • ~S$2M revenue • capex-light</div>
              </div>
            </div>
            <div className="text-xs text-gray-700 space-y-2 ml-10">
              <p><strong>International expansion via existing OOH networks:</strong> Adactive&apos;s software is capex-light and platform-based, making it the natural first mover for overseas growth. Target partnerships with established international OOH operators — Clear Channel, JCDecaux, Moove Media — who already have the physical infrastructure but need digital interactivity and content management software.</p>
              <p><strong>Cross-functional value within the group:</strong> Bundle Adactive&apos;s capabilities with the other BUs to offer integrated solutions that competitors can&apos;t easily replicate: digital wayfinding powered by Carats&apos; signage installations, camera analytics integrated with Gleamedia&apos;s media screens to track real-time personalised impressions, and interactive kiosks that serve as both information points and advertising platforms.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
            <strong className="text-gray-800">The integrated advantage:</strong> Separately, each BU competes in its own market. Together, the group offers something unique — an end-to-end solution from physical signage design and build (Carats), to media sales and network management (Gleamedia), to interactive digital technology (Adactive). This integrated platform is harder to replicate and more valuable to clients and partners.
          </div>
        </div>
      </FamilySection>

      {/* 6. Next-Gen Leadership Development */}
      <FamilySection title="Next-Generation Leadership Development" icon="🌱">
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">A key part of this partnership is supporting the next generation of leaders within the CARATS family. Movement has deep experience working alongside family businesses through generational transitions — we want to make sure the 2nd generation is set up to succeed, with real responsibilities and clear milestones.</p>

          {/* 4 Pillars */}
          <div className="text-sm font-bold text-gray-900 mb-1">How We Assess Readiness — 4 Pillars</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                <div className="text-sm font-bold text-blue-900">Running the Numbers</div>
              </div>
              <p className="text-xs text-gray-700 ml-9">Each candidate takes ownership of a business unit or major initiative with real financial targets — revenue, margins, cash flow. Not advisory, but direct accountability for results against a plan they helped build.</p>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                <div className="text-sm font-bold text-purple-900">Thinking Ahead</div>
              </div>
              <p className="text-xs text-gray-700 ml-9">Each candidate develops a 5-year growth plan for their area — new markets, new capabilities, potential partnerships or acquisitions. Movement provides the frameworks and market data to pressure-test their thinking.</p>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                <div className="text-sm font-bold text-green-900">Working Across the Group</div>
              </div>
              <p className="text-xs text-gray-700 ml-9">Rotate candidates across BUs or assign cross-functional projects — for example, leading a joint Gleamedia + Carats initiative on integrated media offerings. Whoever leads the group one day needs to work across all three businesses, not just their own.</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">4</div>
                <div className="text-sm font-bold text-amber-900">Representing the Group</div>
              </div>
              <p className="text-xs text-gray-700 ml-9">Candidates lead key client relationships, bank discussions, and partner conversations — with Movement&apos;s coaching. The question: can they represent the group externally with confidence to clients, lenders, and potential partners?</p>
            </div>
          </div>

          {/* How Movement Helps */}
          <div className="text-sm font-bold text-gray-900 mt-4 mb-2">How Movement Supports This Process</div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <div className="text-sm font-bold text-gray-900">Governance & accountability</div>
                <p className="text-xs text-gray-600 mt-0.5">We help establish a proper board with independent oversight and quarterly performance reviews against agreed KPIs — transparent and fair across all candidates.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <div className="text-sm font-bold text-gray-900">Mentorship from our team</div>
                <p className="text-xs text-gray-600 mt-0.5">Movement&apos;s senior team provides direct guidance on financial discipline, strategic planning, and execution. The 2nd generation gets hands-on exposure to institutional thinking and best practices.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <div className="text-sm font-bold text-gray-900">Real stretch assignments</div>
                <p className="text-xs text-gray-600 mt-0.5">We co-design 12–18 month assignments with TH — for example, &quot;launch Gleamedia into one new market&quot; or &quot;improve Carats maintenance revenue by 20%.&quot; These are real tests with real consequences, not training exercises.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <div className="text-sm font-bold text-gray-900">Best practices from outside</div>
                <p className="text-xs text-gray-600 mt-0.5">Movement brings in learnings from other portfolio companies and industries, so the 2nd generation can see what &quot;great&quot; looks like beyond the family business.</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="text-sm font-bold text-gray-900 mt-4 mb-2">Suggested Timeline</div>
          <div className="relative">
            {[
              { phase: "Months 1–3", title: "Setup", desc: "Define roles, KPIs, and stretch assignments — collaboratively with TH", color: "bg-blue-600" },
              { phase: "Months 3–15", title: "Execute & Review", desc: "Candidates execute their assignments with quarterly check-ins and performance reviews", color: "bg-purple-600" },
              { phase: "Month 18", title: "Assessment", desc: "Formal assessment and recommendation on leadership readiness", color: "bg-green-600" },
              { phase: "Months 18–24", title: "Transition", desc: "Selected candidate moves into deputy CEO role, with TH transitioning to an advisory capacity", color: "bg-amber-600" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 mb-1">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} shrink-0 mt-1.5`}></div>
                  {i < 3 && <div className="w-0.5 flex-1 bg-gray-200 min-h-[24px]"></div>}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${item.color}`}>{item.phase}</span>
                    <span className="text-sm font-bold text-gray-900">{item.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FamilySection>

      {/* 7. What happens next? */}
      {/* Purchase Price Adjustments */}
      <FamilySection title="Purchase Price Adjustments" icon="⚖️" defaultOpen={false}>
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">The S$40M enterprise value is the headline number, but the final amount paid may be adjusted slightly based on the company&apos;s actual financial position at closing. This is standard in transactions like this and protects both sides.</p>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Working Capital Adjustment</div>
              <p className="text-xs text-gray-600">The business needs a certain level of &quot;working capital&quot; (cash tied up in day-to-day operations — money owed by customers, money owed to suppliers, etc.) to run normally. We&apos;ll agree on a target level of working capital during due diligence. If the actual working capital at closing is higher or lower than this target, the purchase price adjusts dollar-for-dollar up or down.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Net Debt / Cash Adjustment</div>
              <p className="text-xs text-gray-600">The final price is adjusted for the actual amount of debt (loans, borrowings) and cash on the balance sheet at closing, compared to the reference numbers used in the valuation. More cash than expected = price goes up; more debt = price comes down.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">True-Up After Closing</div>
              <p className="text-xs text-gray-600">After the deal closes, accountants prepare a final set of &quot;completion accounts&quot; to confirm the exact working capital and net debt/cash figures. Any difference from what was estimated at closing gets trued up — either party pays or receives the difference. This ensures no one is short-changed.</p>
            </div>
          </div>
        </div>
      </FamilySection>

      {/* Governance & Shareholder Rights */}
      <FamilySection title="Governance & Shareholder Rights" icon="🏛️" defaultOpen={false}>
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">The new HoldCo will have a proper board and governance structure. This gives the family a formal voice in how the company is run, alongside Movement.</p>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Board of Directors</div>
              <p className="text-xs text-gray-600">Movement appoints the majority of the board. One seat is reserved for continuing management (likely TH or Raymond). The board oversees major decisions and strategic direction.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Reserved Matters</div>
              <p className="text-xs text-gray-600">Certain big decisions require board approval (not just Movement acting alone). These include: large capital expenditures, taking on new debt, related-party transactions, dividend policy, hiring/firing key executives, entering material contracts, and any change of business direction.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Information Rights</div>
              <p className="text-xs text-gray-600">All shareholders receive monthly management accounts, quarterly board reports, and annual audited financial statements. Full transparency on how the business is performing.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Anti-Dilution Protection</div>
              <p className="text-xs text-gray-600">If the company issues new shares, existing shareholders have the right to participate proportionally to maintain their ownership percentage. Your 30% stays at 30%.</p>
            </div>
          </div>
        </div>
      </FamilySection>

      {/* Due Diligence & Conditions */}
      <FamilySection title="Due Diligence & Conditions" icon="🔍" defaultOpen={false}>
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">Before the deal can close, both sides need to complete their homework. This is a collaborative process — not an interrogation — designed to make sure everyone is comfortable proceeding.</p>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm font-bold text-gray-900 mb-2">What We&apos;ll Be Looking At</div>
            <div className="text-xs text-gray-600 space-y-1.5">
              <p><strong>(1) 5-year growth plan</strong> — revenue pipeline sustainability, where the business is headed</p>
              <p><strong>(2) Business unit economics</strong> — how each of Carats, Gleamedia, and Adactive performs on its own</p>
              <p><strong>(3) Earnings quality</strong> — normalised EBITDA after removing one-off items and intercompany adjustments</p>
              <p><strong>(4) Working capital & balance sheet</strong> — receivables, payables, cash requirements</p>
              <p><strong>(5) Legal & structural</strong> — contracts, IP, regulatory, employment matters</p>
              <p><strong>(6) Leadership continuity</strong> — ensuring the right people are in the right roles going forward</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-sm font-bold text-gray-900 mb-2">Conditions to Closing</div>
            <p className="text-xs text-gray-600">The deal is subject to: satisfactory completion of due diligence, no material adverse change in the business, confirmation of audited FY2025 results, formalised transfer pricing across all entities, and key management retention agreements being in place.</p>
          </div>

          <p className="text-xs text-gray-500">Indicative DD period: 6–8 weeks from LOI execution.</p>
        </div>
      </FamilySection>

      {/* Financing */}
      <FamilySection title="Financing" icon="🏦" defaultOpen={false}>
        <div className="mt-3 space-y-4">
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Movement&apos;s Capital</div>
              <p className="text-xs text-gray-600">Movement is backed by patient, family-office capital. There is no financing contingency — this deal does not depend on us raising money from third parties. When we commit, we can close.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">Acquisition Debt</div>
              <p className="text-xs text-gray-600">We expect to use a senior secured loan at the HoldCo level of 1.0x–2.0x EBITDA (roughly S$7M–S$14M). Indicative terms: ~4.0% interest per year, repaid over 5 years. This debt benefits the family — more debt means management needs to reinvest less, so more cash comes home at closing.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-bold text-gray-900 mb-1">No Personal Guarantees</div>
              <p className="text-xs text-gray-600">The debt sits at the company level and is serviced by operating cash flow. No management shareholder is personally liable or required to guarantee the loan.</p>
            </div>
          </div>
        </div>
      </FamilySection>

      {/* Exclusivity */}
      <FamilySection title="Exclusivity" icon="🔒" defaultOpen={false}>
        <div className="mt-3 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">If the family agrees to proceed, we would ask for an exclusivity period of 4 months from signing the LOI. During this time:</p>
          <div className="text-xs text-gray-700 space-y-2">
            <p>• The company and its shareholders would stop discussions with any other potential buyers or investors</p>
            <p>• No soliciting or entertaining alternative offers during the exclusivity period</p>
            <p>• If an unsolicited approach comes in from a third party, the company would promptly let Movement know</p>
          </div>
          <p className="text-xs text-gray-500">This is standard for transactions like this — it gives both sides the confidence to invest significant time and resources into due diligence and negotiations without the risk of the process being derailed.</p>
        </div>
      </FamilySection>

      {/* What Happens Next */}
      <FamilySection title="What Happens Next?" icon="📋">
        <div className="mt-3 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">If the family is comfortable with the broad terms, the next steps are:</p>
          <div className="space-y-2">
            {[
              { step: "1", title: "Letter of Intent (LOI)", desc: "We put the key terms in writing. This is non-binding but signals mutual intent and starts a period of exclusivity." },
              { step: "2", title: "Due Diligence (6–8 weeks)", desc: "Both sides do their homework. We review the financials, contracts, and operations. You get to know us better. This is a collaborative process, not an interrogation." },
              { step: "3", title: "Final Agreement (SPA)", desc: "Once DD is complete and everyone is satisfied, we draft the formal sale and purchase agreement with all the detailed terms." },
              { step: "4", title: "Closing", desc: "Sign the papers, complete the transaction, and begin the new chapter together." },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{item.step}</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{item.title}</div>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Indicative timeline: 14–16 weeks from LOI to closing, subject to the pace of due diligence and mutual agreement on final terms.</p>
        </div>
      </FamilySection>

      {/* Footer note */}
      <div className="text-[10px] text-gray-400 text-center py-4">
        This document is for discussion purposes only and does not constitute a binding offer. All terms are indicative and subject to due diligence, definitive documentation, and mutual agreement.
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PASSWORD GATE
// ════════════════════════════════════════════════════════════════════════
const PASS_HASH = "8e1e3e1c88e04ede7c0a4a449e44f2ab1e877f60c17b2193c8914aecd11f196f";

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
          <p className="text-xs text-gray-400 mb-6">Confidential</p>
          <form onSubmit={handleSubmit}>
            <input type="password" value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter access code" autoFocus
              className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
            {error && <p className="text-xs text-red-500 mt-2">Incorrect access code</p>}
            <button type="submit" className="w-full mt-4 py-3 bg-blue-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition-colors">
              Access
            </button>
          </form>
          <p className="text-[10px] text-gray-300 mt-6">Movement &mdash; Authorised Access Only</p>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SWAN TERM SHEET TAB
// ════════════════════════════════════════════════════════════════════════
function SwanTermSheetTab() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["0", "2", "6"]); // defaultOpen for Transaction, Deferred, S&U

  const toggleSection = (id: string) => {
    setExpandedSections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const sections = [
    {
      id: "0",
      title: "Transaction Overview",
      tag: "STANDARD",
      rows: [
        { label: "Target", value: "Multron Systems Pte Ltd" },
        { label: "Parties", value: "Newly formed HoldCo (SPV) — Movement 90% / Existing Shareholders 10%" },
        { label: "Transaction", value: "100% of Multron consolidated into HoldCo. Existing shareholders receive cash, vendor take-back financing, and rollover equity at agreed valuation." },
        { label: "Enterprise Value", value: "S$8,507,000 (~4.7x unaudited FY2025 EBITDA of S$1,810,000)" },
        { label: "Equity Value", value: "S$17,467,000 (EV + Net Cash S$8,960,000). Subject to independent financial DD on debt, cash, and working capital." },
        { label: "Upfront Equity", value: "S$15,467,000 (Equity Value less S$2,000,000 contingent consideration)" },
        { label: "Payment", value: "Combination of upfront cash (S$13,557K equity to sellers at close), vendor take-back financing (S$1,910K in 3 tranches), and contingent consideration (S$2,000K on JTC lease renewal)." },
        { label: "Basis", value: "Cash-free, debt-free, subject to normalised working capital" },
      ]
    },
    {
      id: "1",
      title: "Rollover Equity",
      tag: "TBD",
      rows: [
        { label: "Rollover", value: "Family shareholders rollover 10% equity into HoldCo on mutually agreed terms." },
        { label: "Purpose", value: "Alignment on long-term value creation. Mr Wong to stay 1-2 years, consult thereafter." },
        { label: "Governance", value: "Rollover shareholders hold equity alongside Movement's 90% stake." },
      ]
    },
    {
      id: "2",
      title: "Deferred Consideration",
      tag: "CORE",
      rows: [
        { label: "Total Deferred", value: "S$3,910,000 (22.2% of total transaction value)" },
        { label: "VTB Tranche 1", value: "S$637,000 — Vendor take-back financing (1.0x EBITDA total, split into 3 equal tranches)" },
        { label: "VTB Tranche 2", value: "S$637,000" },
        { label: "VTB Tranche 3", value: "S$637,000" },
        { label: "Contingent Consideration", value: "S$2,000,000 — Payable on successful JTC lease renewal for 217 Kallang Bahru (60-year leasehold, ~7 years remaining)" },
        { label: "JTC Mechanism", value: "Joint letter to JTC at signing as condition precedent. Payable upon confirmed lease extension." },
        { label: "Property Note", value: "Property OMV S$5-6M (book S$2.6M). 2 vacant floors generating S$228K/yr rental income." },
      ]
    },
    {
      id: "3",
      title: "Founder Protections",
      tag: "STANDARD",
      rows: [
        { label: "Underwriting", value: "Founders ok to underwrite aged receivables and obsolete inventory if required during DD" },
        { label: "Key-man", value: "Mr Wong handles supplier relationships (3 China-based) and overseas BD. Client relationships held by sales team + distributors." },
        { label: "Succession", value: "External MD (management-focused) + internal GM (existing manager). Mr Wong has candidates in mind." },
        { label: "Personal Expenses", value: "~S$100K personal expenses currently run through business. Added back to EBITDA." },
      ]
    },
    {
      id: "4",
      title: "Governance",
      tag: "STANDARD",
      rows: [
        { label: "Board", value: "Majority Movement, including Chairman" },
        { label: "Reserved Matters", value: "Capex above threshold, new indebtedness, RP transactions, dividend policy, key hires, material contracts" },
        { label: "Info Rights", value: "Monthly mgmt accounts, quarterly board reporting, annual audited statements" },
        { label: "Management Continuity", value: "Mr Wong stays 1-2 years. OK with earnout. Free consulting after." },
      ]
    },
    {
      id: "5",
      title: "DD & Conditions",
      tag: "STANDARD",
      rows: [
        { label: "DD Scope", value: "Financial, legal, tax, commercial, operational. 3-4 months post-LOI." },
        { label: "Key Focus", value: "(1) Installed base analysis + AMC conversion, (2) Order book/pipeline, (3) DC client depth, (4) Overseas revenue reconciliation, (5) Key-man transition, (6) JTC lease" },
        { label: "Conditions", value: "Satisfactory DD, no MAC, audited FY25 (expected early April), JTC lease renewal letter, key leadership arrangements" },
      ]
    },
    {
      id: "6",
      title: "Sources & Uses",
      tag: "CORE",
      rows: [
        { label: "— SOURCES —", value: "" },
        { label: "Acquisition Debt (2.0x)", value: "S$3,620,000 (20.6%)" },
        { label: "Seller Financing / VTB (1.0x)", value: "S$1,910,000" },
        { label: "Contingent Consideration", value: "S$2,000,000 (11.4%)" },
        { label: "Total Equity Required", value: "S$11,975,000 — Sponsor S$10,777K (61.3%) / Rollover S$1,197K (6.8%)" },
        { label: "Total Sources", value: "S$17,595,000 (excl. excess cash — zero extraction)" },
        { label: "— USES —", value: "" },
        { label: "Equity Value to Sellers", value: "S$13,557,000 (77.1%)" },
        { label: "Transaction Costs (~1.5%)", value: "S$128,000 (0.7%)" },
        { label: "Total at Close", value: "S$13,685,000" },
        { label: "Deferred (VTB + Contingent)", value: "S$3,910,000 (22.2%)" },
        { label: "Total Uses", value: "S$17,595,000" },
        { label: "— NOTE —", value: "Movement fund (patient capital, family office). No financing contingency. Debt: Secured term loan, 4.5% p.a., 5yr straight-line amort." },
      ]
    },
    {
      id: "7",
      title: "Timeline",
      tag: "STANDARD",
      rows: [
        { label: "LOI", value: "W1-2" },
        { label: "DD", value: "W3-10" },
        { label: "SPA", value: "W9-12" },
        { label: "Close", value: "W13-15" },
      ]
    },
    {
      id: "8",
      title: "Exclusivity",
      tag: "CORE",
      rows: [
        { label: "Term", value: "4-month exclusivity from LOI signing. Standard terms." },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Partnership Intro Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <h3 className="font-bold text-gray-800 text-sm mb-2">Partnership, Not Just Capital</h3>
          <p className="text-xs text-gray-700 leading-relaxed">Movement + family as co-owners (90/10), board representation, continuation of culture and team, access to Movement's network</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <h3 className="font-bold text-gray-800 text-sm mb-2">Unlocking Growth Together</h3>
          <p className="text-xs text-gray-700 leading-relaxed">BD activation (1-2 new hires), Malaysia JV (dormant entity, 60/40 with existing distributor), Data centre vertical expansion, Clean room HVAC bolt-on opportunity</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
          <h3 className="font-bold text-gray-800 text-sm mb-2">Building the Next Generation</h3>
          <p className="text-xs text-gray-700 leading-relaxed">Professional management (external MD + internal GM), Structured succession for Mr Wong, Cross-portfolio learnings from Movement's other investments</p>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-1">Term Sheet Outline</h2>
        <p className="text-blue-100 text-sm mb-4">Discussion Draft — Strictly Confidential</p>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-blue-200 text-xs font-semibold">Enterprise Value</p>
            <p className="font-bold text-lg">S$8.5M</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs font-semibold">Multiple</p>
            <p className="font-bold text-lg">~4.7x FY25 EBITDA</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs font-semibold">Date</p>
            <p className="font-bold text-lg">March 2026</p>
          </div>
        </div>
      </div>

      {/* Key Terms Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Key Terms Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 font-semibold mb-1">Target</p>
            <p className="text-gray-800 font-semibold">Multron Systems</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 font-semibold mb-1">Parties</p>
            <p className="text-gray-800 font-semibold">Mov 90% / Fam 10%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 font-semibold mb-1">FY25 EBITDA</p>
            <p className="text-gray-800 font-semibold">S$1,810K</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-500 font-semibold mb-1">Total at Close</p>
            <p className="text-gray-800 font-semibold">S$13,685K</p>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-3">
        {sections.map(section => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                  section.tag === "CORE" ? "bg-red-100 text-red-700" :
                  section.tag === "TBD" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {section.tag}
                </span>
                <h3 className="text-sm font-bold text-gray-800">{section.title}</h3>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.includes(section.id) ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            {expandedSections.includes(section.id) && (
              <div className="border-t border-gray-200 px-5 py-4 space-y-3">
                {section.rows.map((row, idx) => (
                  <div key={idx} className="flex gap-4 text-xs">
                    <p className="font-semibold text-gray-600 min-w-[140px]">{row.label}</p>
                    <p className="text-gray-700 flex-1 leading-relaxed">{row.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD WITH PROJECT SELECTOR
// ════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const [tab, setTab] = useState(0);
  const [activeProject, setActiveProject] = useState<"diamond" | "swan">("diamond");

  const diamondContent = [<ValueTab key={0} />, <EarnoutTab key={1} />, <HoldcoTab key={2} />, <TimelineTab key={3} />, <TermSheetTab key={4} />, <FamilyOverviewTab key={5} />];

  const getDiamondHeader = () => (
    <>
      <h1 className="text-2xl font-bold text-blue-900 tracking-tight">PROJECT DIAMOND</h1>
      <p className="text-xs text-gray-400 mt-0.5">Preliminary Discussion &mdash; Confidential</p>
      <p className="text-[11px] text-gray-500 mt-3 max-w-3xl mx-auto leading-relaxed italic">Movement is pleased to present this Partnership Proposal, reflecting our commitment to a lasting partnership with both generations<br />of the CARATS family to drive the Group&apos;s next chapter of growth.</p>
    </>
  );

  const getSwanHeader = () => (
    <>
      <h1 className="text-2xl font-bold text-blue-900 tracking-tight">PROJECT SWAN</h1>
      <p className="text-xs text-gray-400 mt-0.5">Multron Systems Pte Ltd — Discussion Draft</p>
      <p className="text-[11px] text-gray-500 mt-3 max-w-3xl mx-auto leading-relaxed italic">Movement is pleased to present this partnership outline with Multron Systems, our vision for unlocking next-generation growth opportunities in the data centre and HVAC verticals.</p>
    </>
  );

  const swanContent = [<SwanTermSheetTab key={0} />];
  const swanTabs = ["Term Sheet"];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div className="w-[200px] bg-gray-900 text-white flex flex-col border-r border-gray-800">
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-800">
          <div className="text-xs font-bold text-blue-400 tracking-widest">MOVEMENT</div>
          <p className="text-[10px] text-gray-500 mt-1">Deal Tools</p>
        </div>

        {/* Project List */}
        <div className="flex-1 p-4 space-y-2">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Projects</div>
          <button
            onClick={() => { setActiveProject("diamond"); setTab(0); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeProject === "diamond"
                ? "bg-blue-900 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <div className="font-semibold">Project Diamond</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Carats & Co</div>
          </button>
          <button
            onClick={() => { setActiveProject("swan"); setTab(0); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeProject === "swan"
                ? "bg-blue-900 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <div className="font-semibold">Project Swan</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Multron Systems</div>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 text-[10px] text-gray-500">
          <p>Movement</p>
          <p className="mt-1">March 2026</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-4">
          <header className="text-center py-3 mb-4">
            {activeProject === "diamond" ? getDiamondHeader() : getSwanHeader()}
          </header>

          {activeProject === "diamond" ? (
            <>
              <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                {TABS.map((t, i) => (
                  <button key={i} onClick={() => setTab(i)}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${tab === i ? 'bg-blue-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {t}
                  </button>
                ))}
              </div>
              {diamondContent[tab]}
            </>
          ) : (
            <>
              <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                {swanTabs.map((t, i) => (
                  <button key={i} onClick={() => setTab(i)}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${tab === i ? 'bg-blue-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                    {t}
                  </button>
                ))}
              </div>
              {swanContent[tab]}
            </>
          )}

          <footer className="text-center text-[10px] text-gray-300 py-6 mt-8">Movement &mdash; March 2026</footer>
        </div>
      </div>
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
