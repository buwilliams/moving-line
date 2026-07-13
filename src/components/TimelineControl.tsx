import type { CSSProperties } from "react";
import { dateToDay, dayToDate, type ISODate } from "../model/time";
import { SIMULATION_END, SIMULATION_START } from "../model/workModel";

interface TimelineControlProps {
  date: ISODate;
  onDateChange: (date: ISODate) => void;
}

const year = new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export function TimelineControl({ date, onDateChange }: TimelineControlProps) {
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

  return (
    <section className="timeline-control" style={style} aria-label="Simulation timeline">
      <output className="timeline-control__current" style={{ left: `${progress * 100}%`, transform: markerTransform }}>
        <strong>{monthYear.format(new Date(`${date}T00:00:00Z`))}</strong>
        <small>Current moment</small>
      </output>
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
