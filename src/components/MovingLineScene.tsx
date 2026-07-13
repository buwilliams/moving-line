import { useState, type CSSProperties, type KeyboardEvent } from "react";
import type { WorkSnapshot } from "../model/workModel";

interface MovingLineSceneProps {
  snapshot: WorkSnapshot;
  baselineRevenue: number;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percent = (value: number) => `${Math.round(value * 100)}%`;
type DetailKey = "ai" | "gap" | "human" | "core" | "new" | "turnover";

export function MovingLineScene({ snapshot, baselineRevenue }: MovingLineSceneProps) {
  const [activeDetail, setActiveDetail] = useState<DetailKey | null>(null);
  const position = (share: number) => Math.max(0, Math.min(1, share)) * 100;
  const handled = position(snapshot.work.handledPosition);
  const frontier = position(snapshot.work.frontierPosition);
  const identity = position(snapshot.work.identityBoundary);
  const core = position(1 - snapshot.work.constitutiveCore);
  const newWorkStart = position(1 - snapshot.work.newWork);
  const revenueRatio = Math.min(1, snapshot.incumbentValue / Math.max(1, baselineRevenue));
  const sceneStyle = {
    "--handled": `${handled}%`,
    "--frontier": `${frontier}%`,
    "--identity": `${identity}%`,
    "--core": `${core}%`,
    "--new-start": `${newWorkStart}%`,
    "--revenue-ratio": `${revenueRatio * 100}%`,
  } as CSSProperties;

  const captureOpacity = (value: number) => Math.min(1, value / Math.max(1, baselineRevenue * 0.04));
  const entrantOpacity = captureOpacity(snapshot.entrantValue);
  const identityOpacity = captureOpacity(snapshot.newIdentityValue);
  const clientOpacity = captureOpacity(snapshot.clientValue);
  const evaporationOpacity = Math.min(1, snapshot.evaporatedValue / Math.max(1, baselineRevenue * 0.12));
  const nodeSize = (value: number) => `${Math.max(10, Math.min(48, 10 + Math.sqrt(value / Math.max(1, baselineRevenue)) * 54))}px`;
  const workUnits = (share: number) => Math.round(share * snapshot.work.totalWorkIndex * 100);
  const details = {
    ai: {
      title: "AI Work",
      definition: "Viable work currently handled by AI across clients, entrants, and new identities.",
      metrics: [["Current share", percent(snapshot.work.aiWork)], ["Work quantity", `${workUnits(snapshot.work.aiWork)} index points`]],
    },
    gap: {
      title: "Capability gap",
      definition: "Work AI can perform that the market has not yet converted into AI Work. This is not the interregnum: the period when the old revenue model is dead and new demand has not yet materialized.",
      metrics: [["Current share", percent(snapshot.work.capabilityGap)], ["Work quantity", `${workUnits(snapshot.work.capabilityGap)} index points`]],
    },
    human: {
      title: "Human Work",
      definition: "Viable work beyond current AI capability. Its contents change as models improve.",
      metrics: [["Current share", percent(snapshot.work.humanWork)], ["Work quantity", `${workUnits(snapshot.work.humanWork)} index points`]],
    },
    core: {
      title: "Human core",
      definition: "Trust, liability, accountability, and legitimacy. These obligations persist even when surrounding labor changes.",
      metrics: [["Current share", percent(snapshot.work.constitutiveCore)], ["Work quantity", `${workUnits(snapshot.work.constitutiveCore)} index points`]],
    },
    new: {
      title: "New Work",
      definition: "Work opened by new capability, including initiatives already visible at the opening date. It expands the current 100%, not the space outside it.",
      metrics: [["Current share", percent(snapshot.work.newWork)], ["Work quantity", `${workUnits(snapshot.work.newWork)} index points`]],
    },
    turnover: {
      title: "Work turnover",
      definition: "New Work expands the current field. Retired work became infrastructure or was replaced and no longer counts as viable work.",
      metrics: [["Current work index", `${Math.round(snapshot.work.totalWorkIndex * 100)}`], ["Retired from opening", percent(snapshot.work.retiredWork)]],
    },
  } satisfies Record<DetailKey, { title: string; definition: string; metrics: string[][] }>;
  const detailProps = (key: DetailKey) => ({
    tabIndex: 0,
    "aria-describedby": activeDetail === key ? "scene-detail-popover" : undefined,
    onMouseEnter: () => setActiveDetail(key),
    onMouseLeave: () => setActiveDetail(null),
    onFocus: () => setActiveDetail(key),
    onBlur: () => setActiveDetail(null),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") {
        setActiveDetail(null);
        event.currentTarget.blur();
      }
    },
  });
  const detail = activeDetail ? details[activeDetail] : null;

  return (
    <section className="moving-line-scene" style={sceneStyle} aria-label="The race between AI capability and what clients hire the agency to do">
      <div className="scene-field-caption">
        <span>Current work: routine to contextual</span>
        <span className="scene-field-metrics" {...detailProps("turnover")}><strong>{Math.round(snapshot.work.totalWorkIndex * 100)}</strong> work index / <strong>{percent(snapshot.work.retiredWork)}</strong> retired</span>
      </div>
      <div className="scene-field">
        <div className="scene-segment scene-segment--ai" aria-label="AI Work details" {...detailProps("ai")}>
          <span className="scene-segment__reading"><b data-short="AI work">AI Work</b><strong>{percent(snapshot.work.aiWork)}</strong></span>
        </div>
        <div className="scene-segment scene-segment--gap" aria-label="Capability gap details" {...detailProps("gap")}>
          <span className="scene-segment__reading"><b data-short="The gap">Capability gap</b><strong>{percent(snapshot.work.capabilityGap)}</strong><small>AI can; the market has not</small></span>
        </div>
        <div className="scene-segment scene-segment--human" aria-label="Human Work details" {...detailProps("human")}>
          <span className="scene-segment__reading"><b data-short="Human work">Human Work</b><strong>{percent(snapshot.work.humanWork)}</strong></span>
        </div>
        <div className="scene-segment scene-segment--core" aria-label="Human core details" {...detailProps("core")}>
          <span className="scene-segment__reading"><b data-short="Core">Human core</b><strong>{percent(snapshot.work.constitutiveCore)}</strong><small>trust + liability</small></span>
        </div>
        <div className="scene-new-overlay" />

        <div className="scene-boundary scene-boundary--frontier"><span><b>AI can do</b><strong>{percent(snapshot.work.frontierPosition)}</strong></span></div>
        <div className="scene-boundary scene-boundary--identity"><span><b>Clients hire us for</b><strong>{percent(snapshot.work.identityBoundary)}</strong></span></div>
        <div className="scene-original-boundary"><span>Problem frontier</span></div>
        <div className="scene-new-work-reading" aria-label="New Work details" {...detailProps("new")}><span>New Work</span><strong>{percent(snapshot.work.newWork)}</strong></div>
      </div>

      {detail && <div id="scene-detail-popover" className="scene-detail-popover" role="tooltip">
        <strong>{detail.title}</strong>
        <p>{detail.definition}</p>
        <dl>{detail.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </div>}

      <div className="scene-revenue">
        <span>Incumbent revenue <strong>{money.format(snapshot.incumbentValue)}</strong></span>
        <i />
      </div>

      <div className="scene-evaporation" style={{ left: `${Math.max(8, handled * 0.55)}%`, opacity: evaporationOpacity }} aria-hidden="true">
        <i />
        <span>Below the cost of external exchange</span>
      </div>

      <div className="scene-capture" aria-label="Where value moves">
        <div className="scene-capture__node scene-capture__node--client" style={{ opacity: clientOpacity }}>
          <i style={{ width: nodeSize(snapshot.clientValue), height: nodeSize(snapshot.clientValue) }} />
          <span>Clients<strong>{money.format(snapshot.clientValue)}</strong></span>
        </div>
        <div className="scene-capture__node scene-capture__node--entrant" style={{ opacity: entrantOpacity }}>
          <i style={{ width: nodeSize(snapshot.entrantValue), height: nodeSize(snapshot.entrantValue) }} />
          <span>AI-native entrants<strong>{money.format(snapshot.entrantValue)}</strong></span>
        </div>
        <div className="scene-capture__node scene-capture__node--identity" style={{ opacity: identityOpacity }}>
          <i style={{ width: nodeSize(snapshot.newIdentityValue), height: nodeSize(snapshot.newIdentityValue) }} />
          <span>New identity<strong>{money.format(snapshot.newIdentityValue)}</strong></span>
        </div>
      </div>
    </section>
  );
}
