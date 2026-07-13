import { Expand, ExternalLink, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MovingLineScene } from "./components/MovingLineScene";
import { Transport, type SpeedOption } from "./components/Transport";
import { TimelineControl } from "./components/TimelineControl";
import { dateToDay, dayToDate } from "./model/time";
import {
  DEFAULT_WORK_ASSUMPTIONS,
  SIMULATION_END,
  SIMULATION_START,
  findInterregnumWindow,
  simulateWorkAt,
  type WorkAssumptions,
} from "./model/workModel";

const speeds: SpeedOption[] = [
  { label: "Day", daysPerSecond: 1 },
  { label: "Week", daysPerSecond: 7 },
  { label: "Month", daysPerSecond: 30.4375 },
  { label: "Quarter", daysPerSecond: 91.3125 },
  { label: "Year", daysPerSecond: 365.2425 },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function AssumptionSlider({ label, value, onChange, left, right }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  left: string;
  right: string;
}) {
  const exponent = Math.log2(value);
  const formatRate = (rate: number) => {
    if (rate < 1) return `${rate.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}x`;
    if (rate < 10) return `${rate.toFixed(1).replace(/\.0$/, "")}x`;
    return `${Math.round(rate)}x`;
  };

  return (
    <label className="clock-control">
      <span><strong>{label}</strong><output>{formatRate(value)}</output></span>
      <input
        type="range"
        min="-5"
        max="5"
        step="0.25"
        value={exponent}
        onChange={(event) => onChange(2 ** Number(event.target.value))}
      />
      <small><span>{left}</span><span>{right}</span></small>
    </label>
  );
}

function App() {
  const [assumptions, setAssumptions] = useState<WorkAssumptions>(DEFAULT_WORK_ASSUMPTIONS);
  const [date, setDate] = useState(SIMULATION_START);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SpeedOption>(speeds[2]);
  const [controlsOpen, setControlsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = (now - last) / 1000;
      last = now;
      setDate((current) => {
        const next = dateToDay(current) + speed.daysPerSecond * elapsed;
        if (next >= dateToDay(SIMULATION_END)) {
          setPlaying(false);
          return SIMULATION_END;
        }
        return dayToDate(next);
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, speed.daysPerSecond]);

  const snapshot = useMemo(() => simulateWorkAt(assumptions, date), [assumptions, date]);
  const interregnum = useMemo(() => findInterregnumWindow(assumptions), [assumptions]);
  const revenueChange = snapshot.incumbentValue / assumptions.annualRevenue - 1;
  const currentDay = dateToDay(date);
  const interregnumIsActive = interregnum !== null &&
    currentDay >= dateToDay(interregnum.start) &&
    currentDay <= dateToDay(interregnum.end ?? SIMULATION_END);
  const insight = interregnumIsActive
    ? {
        title: "The interregnum is active",
        statement: "The old revenue model is dead while replacement demand is still forming.",
      }
    : snapshot.replacementDemandAnnual >= snapshot.legacyRevenueAnnual
      ? {
          title: "New demand is materializing",
          statement: "The problem frontier keeps expanding, while identity still decides which actors can follow it.",
        }
      : {
          title: "Identity already decides who follows",
          statement: "Every clock is moving now. Capability moves fastest; incumbent identity changes slowest.",
        };

  const reset = () => {
    setPlaying(false);
    setDate(SIMULATION_START);
    setAssumptions(DEFAULT_WORK_ASSUMPTIONS);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void rootRef.current?.requestFullscreen();
  };

  return (
    <div className="app" ref={rootRef}>
      <header className="minimal-header explanatory-header">
        <div className="minimal-brand">
          <span className="minimal-brand__line" />
          <a href="https://buddy-williams.com/writings/moving-line" target="_blank" rel="noreferrer" title="Read The Moving Line essay">
            <span>The Moving Line <ExternalLink size={11} aria-hidden="true" /></span>
            <small>Explanatory revenue simulation</small>
          </a>
        </div>
        <div className="mechanism-marker">All clocks active</div>
        <div className="minimal-actions">
          <button title="Reset simulation" onClick={reset}><RotateCcw size={17} /></button>
          <button title="Full screen" onClick={toggleFullscreen}><Expand size={17} /></button>
          <button className={controlsOpen ? "is-active" : ""} title="Change the clocks" onClick={() => setControlsOpen(true)}><SlidersHorizontal size={18} /></button>
        </div>
      </header>

      <main className="theater explanatory-theater">
        <section className="essay-heading">
          <div className="revenue-reading">
            <span className="theater-kicker">Incumbent revenue</span>
            <h1>{money.format(snapshot.incumbentValue)}</h1>
            <p>{Math.abs(revenueChange) < 0.005 ? "At baseline" : `${Math.abs(revenueChange * 100).toFixed(0)}% ${revenueChange < 0 ? "below" : "above"} baseline`}</p>
          </div>
          <div className="insight-reading">
            <h2>{insight.title}</h2>
            <p>{insight.statement}</p>
          </div>
        </section>

        <MovingLineScene snapshot={snapshot} assumptions={assumptions} />

        <TimelineControl date={date} interregnum={interregnum} snapshot={snapshot} onDateChange={setDate} />

        <Transport
          date={date}
          startDate={SIMULATION_START}
          endDate={SIMULATION_END}
          playing={playing}
          speed={speed}
          speeds={speeds}
          onPlayingChange={setPlaying}
          onDateChange={setDate}
          onSpeedChange={setSpeed}
        />

      </main>

      {controlsOpen && <button className="drawer-scrim" aria-label="Close clock controls" onClick={() => setControlsOpen(false)} />}
      <aside className={`clock-drawer ${controlsOpen ? "is-open" : ""}`}>
        <div className="drawer-head"><div><strong>Change the clocks</strong><small>Adjust rates, then press play.</small></div><button title="Close clock controls" onClick={() => setControlsOpen(false)}><X size={20} /></button></div>
        <div className="clock-controls">
          <label className="revenue-control">
            <span><strong>Starting annual incumbent revenue</strong><output>{fullMoney.format(assumptions.annualRevenue)}</output></span>
            <input
              type="range"
              min="100000"
              max="100000000"
              step="100000"
              value={assumptions.annualRevenue}
              onChange={(event) => setAssumptions((current) => ({ ...current, annualRevenue: Number(event.target.value) }))}
            />
            <small><span>$100K</span><span>$100M</span></small>
          </label>
          <div className="log-scale-note"><span>Clock range</span><strong>1/32x to 32x</strong><small>Logarithmic scale</small></div>
          <AssumptionSlider label="AI capability pace" value={assumptions.frontierPace} left="Slower research" right="Faster research" onChange={(value) => setAssumptions((current) => ({ ...current, frontierPace: value }))} />
          <AssumptionSlider label="Client absorption pace" value={assumptions.absorptionPace} left="Long change cycles" right="Rapid adoption" onChange={(value) => setAssumptions((current) => ({ ...current, absorptionPace: value }))} />
          <AssumptionSlider label="Demand response" value={assumptions.demandResponse} left="Limited elasticity" right="Boundless demand" onChange={(value) => setAssumptions((current) => ({ ...current, demandResponse: value }))} />
          <AssumptionSlider label="Client perception pace" value={assumptions.identityPace} left="Fixed expectations" right="Rapid repositioning" onChange={(value) => setAssumptions((current) => ({ ...current, identityPace: value }))} />
          <details className="advanced-assumptions">
            <summary>Advanced assumptions</summary>
            <label className="core-control">
              <span><strong>Constitutive core assumption</strong><output>{Math.round(assumptions.constitutiveCore * 100)}%</output></span>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={assumptions.constitutiveCore * 100}
                onChange={(event) => setAssumptions((current) => ({ ...current, constitutiveCore: Number(event.target.value) / 100 }))}
              />
              <small><span>0%</span><span>25%</span></small>
              <p>The essay treats the size of this persistent trust, liability, and accountability layer as an open empirical question.</p>
            </label>
          </details>
        </div>
      </aside>
    </div>
  );
}

export default App;
