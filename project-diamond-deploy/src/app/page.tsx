"use client";

import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList,
} from "recharts";

const fmt = (n: number) => "S$" + (Math.abs(n) >= 1000 ? (n / 1000).toFixed(1) + "M" : n.toFixed(0) + "K");
const fmtK = (n: number) => "S$" + Math.round(n).toLocaleString("en-SG");
// Full dollar formatter: converts S$'000 to full dollars (e.g. 8000 -> "S$8,000,000")
const fmtFull = (n: number) => "S$" + (n * 1000).toLocaleString("en-SG", { maximumFractionDigits: 0 });
const TABS = ["Value to Shareholders", "Earnout", "Group Structure", "Timeline & Key DD Topics", "Term Sheet"];

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

    const yr1Ratio = Math.min(1, Math.max(0, (yr1Actual - yr1Floor) / (yr1Hurdle - yr1Floor)));
    const yr1Pay = yr1Actual >= yr1Floor ? yr1Tranche * yr1Ratio : 0;
    const yr1Shortfall = yr1Tranche - yr1Pay;

    let yr2Pay = 0;
    if (yr2Actual >= yr2Floor) {
      const yr2Pool = yr2Tranche + yr1Shortfall;
      const yr2Ratio = Math.min(1, (yr2Actual - yr2Floor) / (yr2Hurdle - yr2Floor));
      yr2Pay = yr2Pool * yr2Ratio;
    }

    const totalPaid = yr1Pay + yr2Pay;
    const yr1Status = yr1Actual >= yr1Hurdle ? "met" : yr1Actual >= yr1Floor ? "partial" : "missed";
    const yr2Status = yr2Actual >= yr2Hurdle ? "met" : yr2Actual >= yr2Floor ? "partial" : "missed";
    return { yr1Tranche, yr2Tranche, yr1Floor, yr2Floor, yr1Pay, yr1Shortfall, yr2Pay, totalPaid, yr1Status, yr2Status };
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
      <p className="text-sm text-gray-600">The earnout aligns the interests of both parties. {fmtFull(DEFERRED_TOTAL)} of the consideration is linked to EBITDA performance over the first two years, funded by the HoldCo and paid in two tranches.</p>

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
            {c.yr1Shortfall > 0 && <div className="flex justify-between text-orange-600"><span>Balance carries to Year 2</span><span className="font-mono">{fmtFull(c.yr1Shortfall)}</span></div>}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 italic">Payment scales proportionally with performance. The full amount is payable when the target is achieved. Any balance carries forward to Year 2.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2">Year 2 Payment</h4>
          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Available (70% tranche{c.yr1Shortfall > 0 ? " + carry" : ""})</span><span className="font-mono">{fmtFull(c.yr2Tranche + c.yr1Shortfall)}</span></div>
            <div className="flex justify-between font-bold text-green-700"><span>Payable</span><span className="font-mono">{fmtFull(c.yr2Pay)}</span></div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 italic">Payment scales proportionally with performance, including any balance carried from Year 1. Strong Year 2 results can make up for any Year 1 shortfall.</p>
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
                holders: ["Raymond 22%", "Ann 22%", "TH 22%", "Geng Hao 30%", "Keith 4%"] },
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
  // Structure 2: Earnout WITHIN S$40M envelope
  const UPFRONT = 31400;          // S$31.4M upfront to sellers at close
  const MGMT_REINVEST = 8800;     // S$8.8M management reinvests for 30%
  const NET_CASH_CLOSE = UPFRONT - MGMT_REINVEST; // S$22.6M
  const EARNOUT_AMT = 8600;       // S$8.6M deferred earnout
  const TOTAL_IF_EARNOUT = NET_CASH_CLOSE + EARNOUT_AMT; // S$31.2M

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
            <span>~{ENTRY_MULT.toFixed(1)}x FY25 EBITDA</span>
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
          <Row label="Enterprise Value">{fmtFull(EV)} (~{ENTRY_MULT.toFixed(1)}x unaudited FY2025 EBITDA of {fmtFull(EBITDA_2025)})</Row>
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
          Total consideration is capped at S$40M — comprising <strong className="text-gray-800">S$31.4M upfront</strong> at close and <strong className="text-gray-800">S$8.6M deferred earnout</strong> over 2 years. Management <strong className="text-gray-800">reinvests S$8.8M</strong> from their share of the upfront proceeds back into the SPV for their 30% continuing stake. Net cash to all shareholders at close: <strong className="text-green-700">S$22.6M</strong>.
        </p>

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
            <div className="text-2xl font-bold text-blue-600">({fmt(MGMT_REINVEST)})</div>
            <div className="text-xs text-gray-500 mt-1">Mgmt reinvests for 30% SPV equity</div>
          </div>
          <div className="border-2 border-green-400 rounded-xl p-4 text-center bg-green-50">
            <div className="text-[10px] font-bold text-green-600 uppercase mb-2">Net Cash at Close</div>
            <div className="text-2xl font-bold text-green-700">{fmt(NET_CASH_CLOSE)}</div>
            <div className="text-xs text-gray-500 mt-1">Cash home to all shareholders</div>
            <div className="text-[10px] text-green-600 font-semibold mt-0.5">+ {fmt(EARNOUT_AMT)} earnout potential = {fmt(TOTAL_IF_EARNOUT)}</div>
          </div>
        </div>

        {/* Consideration waterfall bar */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 w-[100px] text-right">Total Deal</span>
            <div className="flex-1 h-9 bg-gray-100 rounded-md overflow-hidden flex">
              <div className="bg-green-600 h-full flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${(UPFRONT / EV) * 100}%` }}>
                {fmt(UPFRONT)} upfront
              </div>
              <div className="bg-purple-400 h-full flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${(EARNOUT_AMT / EV) * 100}%` }}>
                {fmt(EARNOUT_AMT)} earnout
              </div>
            </div>
            <span className="text-xs font-mono font-bold w-[70px]">S$40.0M</span>
          </div>
          <div className="flex gap-4 ml-[112px] text-[10px] text-gray-500 mb-3">
            <span><span className="inline-block w-2.5 h-2.5 bg-green-600 rounded-sm mr-1"></span>Upfront at Close</span>
            <span><span className="inline-block w-2.5 h-2.5 bg-purple-400 rounded-sm mr-1"></span>Deferred Earnout</span>
            <span><span className="inline-block w-2.5 h-2.5 bg-blue-500 rounded-sm mr-1"></span>Mgmt Reinvestment</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 w-[100px] text-right">Upfront Split</span>
            <div className="flex-1 h-9 bg-gray-100 rounded-md overflow-hidden flex">
              <div className="bg-green-500 h-full flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${(NET_CASH_CLOSE / UPFRONT) * 100}%` }}>
                {fmt(NET_CASH_CLOSE)} net cash
              </div>
              <div className="bg-blue-500 h-full flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${(MGMT_REINVEST / UPFRONT) * 100}%` }}>
                {fmt(MGMT_REINVEST)} reinvested
              </div>
            </div>
            <span className="text-xs font-mono font-bold w-[70px]">{fmt(UPFRONT)}</span>
          </div>
        </div>

        {/* Summary table */}
        <div className="mb-5">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Cash to Shareholders</h4>
          <table className="w-full text-xs">
            <tbody>
              <tr><td className="py-1.5 px-2">Upfront to all shareholders</td><td className="text-right py-1.5 px-2 font-mono">{fmtK(UPFRONT)}</td></tr>
              <tr className="bg-gray-50"><td className="py-1.5 px-2">(-) Mgmt reinvestment for 30%</td><td className="text-right py-1.5 px-2 font-mono text-blue-600">({fmtK(MGMT_REINVEST)})</td></tr>
              <tr className="bg-green-50 border-t-2 border-gray-200"><td className="py-1.5 px-2 font-bold text-green-800">Net cash at close</td><td className="text-right py-1.5 px-2 font-mono font-bold text-green-800">{fmtK(NET_CASH_CLOSE)}</td></tr>
              <tr><td className="py-1.5 px-2 text-gray-400">(+) Earnout (if targets met)</td><td className="text-right py-1.5 px-2 font-mono text-gray-400">{fmtK(EARNOUT_AMT)}</td></tr>
              <tr className="bg-gray-50 font-bold"><td className="py-1.5 px-2">Total potential cash</td><td className="text-right py-1.5 px-2 font-mono font-bold">{fmtK(TOTAL_IF_EARNOUT)}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Key point callout */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-xs text-gray-600 mb-5">
          <strong className="text-gray-800">Key point for Gen-1s:</strong> Total consideration is capped at S$40M. You receive S$31.4M upfront. Management reinvests S$8.8M back for their 30% continuing stake, leaving <strong className="text-green-700">S$22.6M net cash</strong> at close. If earnout targets are met, an additional S$8.6M flows to shareholders over 2 years — bringing total potential cash to S$31.2M.
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
              <div className="text-sm font-bold text-blue-900 mb-1">HoldCo raises funds to pay {fmt(UPFRONT)} upfront to sellers</div>
              <div className="text-xs text-gray-500 mb-2">The money comes from Movement equity, management reinvestment, bank debt, and excess cash from the target businesses.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-[11px] font-semibold text-gray-500 mb-1.5">CONSIDERATION STRUCTURE</div>
                <div className="flex h-9 rounded-md overflow-hidden mb-2">
                  <div className="bg-green-600 flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${(UPFRONT / EV) * 100}%` }}>
                    {fmt(UPFRONT)} upfront
                  </div>
                  <div className="bg-purple-400 flex items-center justify-center text-white text-[10px] font-bold" style={{ width: `${(EARNOUT_AMT / EV) * 100}%` }}>
                    {fmt(EARNOUT_AMT)}
                  </div>
                </div>
                <div className="flex gap-3 text-[10px] text-gray-500 mb-3">
                  <span><span className="inline-block w-2 h-2 bg-green-600 rounded-sm mr-1"></span>Upfront at Close</span>
                  <span><span className="inline-block w-2 h-2 bg-purple-400 rounded-sm mr-1"></span>Deferred Earnout (if targets met)</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-green-700">{fmt(UPFRONT)}</div><div className="text-[10px] text-gray-400">Upfront to sellers</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-dashed border-purple-400 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-purple-600">{fmt(EARNOUT_AMT)}</div><div className="text-[10px] text-gray-400">Earnout (deferred)</div></div>
                  <span className="text-gray-400 font-bold">=</span>
                  <div className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold">S$40.0M</div><div className="text-[10px] text-gray-400">Total Consideration</div></div>
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
              <div className="text-sm font-bold text-blue-900 mb-1">HoldCo buys 100% of the group → {fmt(UPFRONT)} paid upfront to all shareholders</div>
              <div className="text-xs text-gray-500 mb-2">Every current shareholder receives their share of the upfront consideration. The remaining S$8.6M is deferred as earnout.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 flex-wrap text-center">
                  <div className="border-2 border-blue-900 rounded-lg px-4 py-2.5 bg-white min-w-[120px]"><div className="text-base font-bold">{fmt(UPFRONT)}</div><div className="text-[10px] text-gray-400">HoldCo pays at close</div></div>
                  <span className="text-xl text-gray-400">→</span>
                  <div className="border-2 border-green-500 rounded-lg px-4 py-2.5 bg-green-50 min-w-[180px]"><div className="text-base font-bold text-green-700">{fmt(UPFRONT)} to shareholders</div><div className="text-[10px] text-gray-500">Cash at close</div></div>
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
              <div className="text-sm font-bold text-blue-900 mb-1">Management reinvests {fmt(MGMT_REINVEST)} back for 30% ownership</div>
              <div className="text-xs text-gray-500 mb-2">Of the {fmt(UPFRONT)} upfront, management puts {fmt(MGMT_REINVEST)} back into HoldCo for their 30% continuing stake.</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold">{fmt(UPFRONT)}</div><div className="text-[10px] text-gray-400">Upfront received</div></div>
                  <span className="text-gray-400 font-bold text-lg">−</span>
                  <div className="border-2 border-blue-500 rounded-lg px-3 py-2 bg-white min-w-[100px]"><div className="text-base font-bold text-blue-500">{fmt(MGMT_REINVEST)}</div><div className="text-[10px] text-gray-400">Mgmt reinvests</div></div>
                  <span className="text-gray-400 font-bold text-lg">=</span>
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-green-50 min-w-[120px]"><div className="text-xl font-bold text-green-700">{fmt(NET_CASH_CLOSE)}</div><div className="text-[10px] text-gray-500">Net cash at close</div></div>
                </div>
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
              <div className="text-sm font-bold text-green-800 mb-1">You walk away with {fmt(NET_CASH_CLOSE)} cash + 30% ownership + earnout potential</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-3 flex-wrap text-center">
                  <div className="border-2 border-green-500 rounded-lg px-3 py-2 bg-green-50 flex-1 max-w-[150px]"><div className="text-base font-bold text-green-700">{fmt(NET_CASH_CLOSE)}</div><div className="text-[10px] text-gray-500">Net cash at close</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-blue-500 rounded-lg px-3 py-2 bg-white flex-1 max-w-[150px]"><div className="text-base font-bold text-blue-500">30%</div><div className="text-[10px] text-gray-500">Ownership in unified group</div></div>
                  <span className="text-gray-400 font-bold">+</span>
                  <div className="border-2 border-purple-300 rounded-lg px-3 py-2 bg-purple-50 flex-1 max-w-[150px]"><div className="text-base font-bold text-purple-600">{fmt(EARNOUT_AMT)}</div><div className="text-[10px] text-gray-500">Earnout if targets met</div></div>
                </div>
                <div className="text-center mt-3 text-xs text-gray-500">Total potential cash: <strong className="text-green-700">{fmt(TOTAL_IF_EARNOUT)}</strong></div>
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

        {/* ═══ CONSIDERATION BREAKDOWN TABLE ═══ */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-5">
          <h3 className="text-base font-bold text-gray-900 mb-1">How Does the S$40M Flow?</h3>
          <p className="text-xs text-gray-500 mb-4">Total consideration is capped at S$40M — split between upfront cash and deferred earnout.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left py-2 px-3 font-semibold">S$&apos;000</th>
                  <th className="text-right py-2 px-3 font-semibold">Amount</th>
                  <th className="text-left py-2 px-3 font-semibold">Timing</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-2 px-3">Upfront consideration to all shareholders</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(UPFRONT)}</td><td className="py-2 px-3">At close</td></tr>
                <tr className="bg-gray-50"><td className="py-2 px-3 text-blue-600">(-) Management reinvests for 30% SPV equity</td><td className="text-right py-2 px-3 font-mono text-blue-600">({fmtK(MGMT_REINVEST)})</td><td className="py-2 px-3">At close</td></tr>
                <tr className="bg-green-50 border-t-2 border-gray-200"><td className="py-2 px-3 font-bold text-green-800">Net cash to all shareholders</td><td className="text-right py-2 px-3 font-mono font-bold text-green-800">{fmtK(NET_CASH_CLOSE)}</td><td className="py-2 px-3">At close</td></tr>
                <tr><td colSpan={3} className="py-1 border-none"></td></tr>
                <tr><td className="py-2 px-3 text-gray-400">Earnout — Year 1 (30%)</td><td className="text-right py-2 px-3 font-mono text-gray-400">2,582</td><td className="py-2 px-3 text-gray-400">Year 1</td></tr>
                <tr className="bg-gray-50"><td className="py-2 px-3 text-gray-400">Earnout — Year 2 (70%)</td><td className="text-right py-2 px-3 font-mono text-gray-400">6,024</td><td className="py-2 px-3 text-gray-400">Year 2</td></tr>
                <tr className="border-t-2 border-gray-200"><td className="py-2 px-3 font-bold">Total potential cash (if earnout met)</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(TOTAL_IF_EARNOUT)}</td><td className="py-2 px-3"></td></tr>
                <tr className="bg-gray-50"><td className="py-2 px-3 font-bold">Total consideration (capped)</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(EV)}</td><td className="py-2 px-3"></td></tr>
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
          <h3 className="text-base font-bold text-green-800 mb-1">Your 30% Stake — What It Means</h3>
          <p className="text-xs text-green-600 mb-4">Management reinvests {fmt(MGMT_REINVEST)} for a 30% stake in the unified group. Here&apos;s what that could be worth.</p>
          <p className="text-xs text-gray-500 mb-4"><strong>Assumptions:</strong> 5-year hold, revenue grows {REV_CAGR}% p.a., EBITDA margin stays at {EBITDA_MARGIN}%, loan fully repaid from cash flow.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="text-left py-2 px-3 font-semibold">Your 30% stake (S$&apos;000)</th>
                  <th className="text-right py-2 px-3 font-semibold">{ENTRY_MULT.toFixed(1)}x exit</th>
                  <th className="text-right py-2 px-3 font-semibold">7.0x exit</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="py-2 px-3">You reinvest today</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(MGMT_REINVEST)}</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(MGMT_REINVEST)}</td></tr>
                <tr className="bg-gray-50"><td className="py-2 px-3">Your 30% at exit (Year 5)</td><td className="text-right py-2 px-3 font-mono text-green-700">15,665</td><td className="text-right py-2 px-3 font-mono text-green-700">19,581</td></tr>
                <tr className="bg-green-50 border-t-2 border-gray-200"><td className="py-2 px-3 font-bold">Gain</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">+{fmtK(15665 - MGMT_REINVEST)}</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">+{fmtK(19581 - MGMT_REINVEST)}</td></tr>
                <tr className="bg-green-50"><td className="py-2 px-3 font-bold">MOIC</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">{(15665 / MGMT_REINVEST).toFixed(1)}x</td><td className="text-right py-2 px-3 font-mono font-bold text-green-700">{(19581 / MGMT_REINVEST).toFixed(1)}x</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border-l-3 border-green-400 rounded-r-lg p-3 text-xs text-gray-600 mt-4">
            <strong>Key takeaway:</strong> Your {fmt(MGMT_REINVEST)} reinvestment buys a 30% stake in a unified, professionally managed group. Even at the same entry multiple ({ENTRY_MULT.toFixed(1)}x), business growth alone creates meaningful value. At a platform re-rating to 7.0x, the return is even more compelling.
          </div>
        </div>

        {/* ═══ SAFETY NOTE ═══ */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 text-xs text-gray-600 rounded-r-xl">
          <strong className="text-gray-800">A note on safety:</strong> Total consideration is capped at S$40M — there is no open-ended liability. The S$8.6M earnout is funded by the operating businesses&apos; future performance, not by any individual. No family member signs a personal guarantee. The businesses continue to operate exactly as before.
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
              <th className="text-left py-2 px-3 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-2 px-3 font-bold">Upfront to all shareholders</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(UPFRONT)}</td><td className="py-2 px-3">Completion</td><td className="py-2 px-3">Cash at close</td></tr>
            <tr className="bg-blue-50"><td className="py-2 px-3 pl-6 text-blue-700">of which: Mgmt reinvestment (30%)</td><td className="text-right py-2 px-3 font-mono text-blue-600">({fmtK(MGMT_REINVEST)})</td><td className="py-2 px-3">Completion</td><td className="py-2 px-3">Reinvested into SPV</td></tr>
            <tr className="bg-green-50"><td className="py-2 px-3 font-bold text-green-800">Net cash to shareholders</td><td className="text-right py-2 px-3 font-mono font-bold text-green-800">{fmtK(NET_CASH_CLOSE)}</td><td className="py-2 px-3">Completion</td><td className="py-2 px-3">Cash home</td></tr>
            <tr><td className="py-2 px-3">Earnout — Year 1 (30%)</td><td className="text-right py-2 px-3 font-mono">2,582</td><td className="py-2 px-3">Year 1</td><td className="py-2 px-3">EBITDA-linked</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">Earnout — Year 2 (70%)</td><td className="text-right py-2 px-3 font-mono">6,024</td><td className="py-2 px-3">Year 2</td><td className="py-2 px-3">EBITDA-linked</td></tr>
            <tr className="border-t-2 border-gray-200"><td className="py-2 px-3 font-bold">Total Consideration (capped)</td><td className="text-right py-2 px-3 font-mono font-bold">{fmtK(EV)}</td><td className="py-2 px-3"></td><td className="py-2 px-3"></td></tr>
          </tbody>
        </table>
        <p className="text-[10px] text-gray-400 mt-2">Earnout at 100% achievement. Actual payouts scale proportionally between 80% floor and target. Total consideration inclusive of earnout.</p>
      </Section>

      {/* Section 5: Earnout */}
      <Section title="5. Earnout Structure" tag="STANDARD" defaultOpen={false}>
        <table className="w-full text-xs mt-3">
          <thead><tr className="bg-gray-50 text-gray-500"><th className="text-left py-2 px-3 font-semibold">Parameter</th><th className="text-left py-2 px-3 font-semibold">Year 1</th><th className="text-left py-2 px-3 font-semibold">Year 2</th></tr></thead>
          <tbody>
            <tr><td className="py-2 px-3">Tranche</td><td className="py-2 px-3 font-mono">30% (S$2.58M)</td><td className="py-2 px-3 font-mono">70% (S$6.02M)</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">EBITDA Target</td><td className="py-2 px-3 font-mono">{fmtFull(7500)}</td><td className="py-2 px-3 font-mono">{fmtFull(8000)}</td></tr>
            <tr><td className="py-2 px-3">Mgmt Forecast</td><td className="py-2 px-3 font-mono text-gray-400">{fmtFull(7890)}</td><td className="py-2 px-3 font-mono text-gray-400">{fmtFull(8522)}</td></tr>
            <tr className="bg-gray-50"><td className="py-2 px-3">Floor</td><td className="py-2 px-3" colSpan={2}>80% of target — below floor, zero payout</td></tr>
            <tr><td className="py-2 px-3">Carry-Forward</td><td className="py-2 px-3" colSpan={2}>Year 1 shortfall carries into Year 2 pool</td></tr>
            <tr className="bg-gray-50 font-bold"><td className="py-2 px-3">Total</td><td className="py-2 px-3" colSpan={2}>{fmtFull(DEFERRED_TOTAL)} (funded by HoldCo)</td></tr>
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
// MAIN
// ════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const [tab, setTab] = useState(0);
  const content = [<ValueTab key={0} />, <EarnoutTab key={1} />, <HoldcoTab key={2} />, <TimelineTab key={3} />, <TermSheetTab key={4} />];

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="text-center py-3 mb-4">
        <h1 className="text-2xl font-bold text-blue-900 tracking-tight">PROJECT DIAMOND</h1>
        <p className="text-xs text-gray-400 mt-0.5">Preliminary Discussion &mdash; Confidential</p>
        <p className="text-[11px] text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed italic">Movement is pleased to present this Partnership Proposal, reflecting our commitment to a lasting partnership with both generations<br />of the CARATS family to drive the Group&apos;s next chapter of growth.</p>
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
      <footer className="text-center text-[10px] text-gray-300 py-6 mt-8">Movement &mdash; March 2026</footer>
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
