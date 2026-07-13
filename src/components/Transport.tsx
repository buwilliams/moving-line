import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { dateToDay, dayToDate, type ISODate } from "../model/time";

export interface SpeedOption {
  label: string;
  daysPerSecond: number;
}

interface TransportProps {
  date: ISODate;
  startDate: ISODate;
  endDate: ISODate;
  playing: boolean;
  speed: SpeedOption;
  speeds: SpeedOption[];
  onPlayingChange: (playing: boolean) => void;
  onDateChange: (date: ISODate) => void;
  onSpeedChange: (speed: SpeedOption) => void;
}

export function Transport({
  date,
  startDate,
  endDate,
  playing,
  speed,
  speeds,
  onPlayingChange,
  onDateChange,
  onSpeedChange,
}: TransportProps) {
  const start = dateToDay(startDate);
  const end = dateToDay(endDate);
  const current = dateToDay(date);
  const step = speed.daysPerSecond <= 7 ? speed.daysPerSecond : speed.daysPerSecond <= 31 ? 7 : speed.daysPerSecond <= 92 ? 30 : 365;
  const move = (amount: number) => onDateChange(dayToDate(Math.min(end, Math.max(start, current + amount))));

  return (
    <div className="playback" aria-label="Simulation playback">
      <div className="playback__buttons">
        <button title="Restart" onClick={() => onDateChange(startDate)}>
          <RotateCcw size={18} />
        </button>
        <button title="Step backward" onClick={() => move(-step)}>
          <ChevronLeft size={20} />
        </button>
        <button
          className="playback__primary"
          title={playing ? "Pause" : "Play"}
          onClick={() => onPlayingChange(!playing)}
        >
          {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <button title="Step forward" onClick={() => move(step)}>
          <ChevronRight size={20} />
        </button>
      </div>
      <label className="playback__rate">
        <span>Rate</span>
        <select
          value={speed.label}
          onChange={(event) => onSpeedChange(speeds.find((item) => item.label === event.target.value) ?? speed)}
        >
          {speeds.map((item) => <option key={item.label}>{item.label}</option>)}
        </select>
      </label>
    </div>
  );
}
