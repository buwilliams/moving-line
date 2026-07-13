import { useState, type CSSProperties } from "react";
import { dateToDay, dayToDate, type ISODate } from "../model/time";
import {
  SIMULATION_END,
  SIMULATION_START,
  type InterregnumWindow,
  type WorkSnapshot,
} from "../model/workModel";

interface TimelineControlProps {
  date: ISODate;
  interregnum: InterregnumWindow | null;
  snapshot: WorkSnapshot;
  onDateChange: (date: ISODate) => void;
}

const year = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function TimelineControl({ date, interregnum, snapshot, onDateChange }: TimelineControlProps) {
  const [showInterregnumDetail, setShowInterregnumDetail] = useState(false);
  const start = dateToDay(SIMULATION_START);
  const end = dateToDay(SIMULATION_END);
  const current = dateToDay(date);
  const progress = Math.max(0, Math.min(1, (current - start) / Math.max(1, end - start)));
  const ticks = Array.from({ length: 6 }, (_, index) => {
    const day = start + ((end - start) * index) / 5;
    return { day, progress: index / 5 };
  });
  const markerTransform = progress < 0.04 ? "translateX(0)" : progress > 0.96 ? "translateX(-100%)" : "translateX(-50%)";
  const style = { "--timeline-progress": `${progress * 100}%` } as CSSProperties;
  const interregnumStart = interregnum ? dateToDay(interregnum.start) : null;
  const interregnumEnd = interregnum?.end ? dateToDay(interregnum.end) : end;
  const interregnumLeft = interregnumStart === null ? 0 : ((interregnumStart - start) / (end - start)) * 100;
  const interregnumWidth = interregnumStart === null ? 0 : ((interregnumEnd - interregnumStart) / (end - start)) * 100;
  const interregnumActive = interregnumStart !== null && current >= interregnumStart && current <= interregnumEnd;

  return (
    <section className="timeline-control" style={style} aria-label="Simulation timeline">
      <output className="timeline-control__current" style={{ left: `${progress * 100}%`, transform: markerTransform }}>
        <strong>{monthYear.format(new Date(`${date}T00:00:00Z`))}</strong>
        <small>{interregnumActive ? "Inside the interregnum" : "Current moment"}</small>
      </output>
      {interregnum && <div
        className={`timeline-control__interregnum ${interregnum.end ? "" : "is-open-ended"}`}
        style={{ left: `${interregnumLeft}%`, width: `${interregnumWidth}%` }}
        tabIndex={0}
        aria-describedby={showInterregnumDetail ? "interregnum-detail" : undefined}
        onMouseEnter={() => setShowInterregnumDetail(true)}
        onMouseLeave={() => setShowInterregnumDetail(false)}
        onFocus={() => setShowInterregnumDetail(true)}
        onBlur={() => setShowInterregnumDetail(false)}
      >
        <span>Interregnum</span>
      </div>}
      {showInterregnumDetail && interregnum && <div id="interregnum-detail" className="timeline-detail-popover" role="tooltip">
        <strong>Interregnum</strong>
        <p>The period in which the old revenue model is dead and new demand has not yet materialized.</p>
        <dl>
          <div><dt>Legacy revenue now</dt><dd>{money.format(snapshot.legacyRevenueAnnual)}</dd></div>
          <div><dt>New demand now</dt><dd>{money.format(snapshot.replacementDemandAnnual)}</dd></div>
        </dl>
        <small>Modeled: legacy below 50% until demand crossover | {monthYear.format(new Date(`${interregnum.start}T00:00:00Z`))} - {interregnum.end ? monthYear.format(new Date(`${interregnum.end}T00:00:00Z`)) : "Beyond model"}</small>
      </div>}
      <label className="timeline-control__range">
        <span className="sr-only">Simulation date</span>
        <input
          type="range"
          min={start}
          max={end}
          value={current}
          onChange={(event) => onDateChange(dayToDate(Number(event.target.value)))}
        />
      </label>
      <div className="timeline-control__years" aria-hidden="true">
        {ticks.map((tick, index) => (
          <span
            key={tick.day}
            style={{ left: `${tick.progress * 100}%`, transform: index === 0 ? "none" : index === ticks.length - 1 ? "translateX(-100%)" : "translateX(-50%)" }}
          >
            {year.format(new Date(tick.day * 86_400_000))}
          </span>
        ))}
      </div>
    </section>
  );
}
