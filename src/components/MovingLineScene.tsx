import type { CSSProperties } from "react";
import type { WorkSnapshot } from "../model/workModel";

interface MovingLineSceneProps {
  snapshot: WorkSnapshot;
  baselineRevenue: number;
  phaseIndex: number;
}

const ORIGINAL_FIELD_WIDTH = 84;
const NEW_FIELD_WIDTH = 16;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percent = (value: number) => `${Math.round(value * 100)}%`;

export function MovingLineScene({ snapshot, baselineRevenue, phaseIndex }: MovingLineSceneProps) {
  const position = (share: number) => Math.max(0, Math.min(1, share)) * ORIGINAL_FIELD_WIDTH;
  const handled = position(snapshot.work.handledPosition);
  const frontier = position(snapshot.work.frontierPosition);
  const identity = position(snapshot.work.identityBoundary);
  const core = position(1 - snapshot.work.constitutiveCore);
  const newWork = Math.min(1, snapshot.work.newWork / 0.65) * NEW_FIELD_WIDTH;
  const revenueRatio = Math.min(1, snapshot.incumbentValue / Math.max(1, baselineRevenue));
  const sceneStyle = {
    "--handled": `${handled}%`,
    "--frontier": `${frontier}%`,
    "--identity": `${identity}%`,
    "--core": `${core}%`,
    "--new-work": `${newWork}%`,
    "--revenue-ratio": `${revenueRatio * 100}%`,
  } as CSSProperties;

  const entrantOpacity = phaseIndex >= 1 && phaseIndex <= 4 ? 1 : 0;
  const identityOpacity = phaseIndex >= 2 && phaseIndex <= 4 ? 1 : 0;
  const clientOpacity = phaseIndex >= 3 && phaseIndex <= 4 ? 1 : 0;
  const nodeSize = (value: number) => `${Math.max(10, Math.min(48, 10 + Math.sqrt(value / Math.max(1, baselineRevenue)) * 54))}px`;

  return (
    <section className={`moving-line-scene moving-line-scene--act-${phaseIndex + 1}`} style={sceneStyle} aria-label="The race between AI capability and what clients hire the agency to do">
      <div className="scene-field-caption">Today's work: routine to contextual</div>
      <div className="scene-field">
        <div className="scene-segment scene-segment--ai">
          <span className="scene-segment__reading"><b data-short="AI work">AI Work</b><strong>{percent(snapshot.work.aiWork)}</strong></span>
        </div>
        <div className="scene-segment scene-segment--interregnum">
          <span className="scene-segment__reading"><b data-short="The gap">The interregnum</b><strong>{percent(snapshot.work.interregnum)}</strong><small>AI can; the market has not</small></span>
        </div>
        <div className="scene-segment scene-segment--human">
          <span className="scene-segment__reading"><b data-short="Human work">Human Work</b><strong>{percent(snapshot.work.humanWork)}</strong></span>
        </div>
        <div className="scene-segment scene-segment--core">
          <span className="scene-segment__reading"><b data-short="Core">Human core</b><strong>{percent(snapshot.work.constitutiveCore)}</strong><small>trust + liability</small></span>
        </div>
        <div className="scene-segment scene-segment--new">
          {phaseIndex === 5 && newWork > 4 && <span className="scene-segment__reading"><b data-short="New work">New work</b><strong>+{percent(snapshot.work.newWork)}</strong></span>}
        </div>

        <div className="scene-boundary scene-boundary--frontier"><span><b>AI can do</b><strong>{percent(snapshot.work.frontierPosition)}</strong></span></div>
        <div className="scene-boundary scene-boundary--identity"><span><b>Clients hire us for</b><strong>{percent(snapshot.work.identityBoundary)}</strong></span></div>
        <div className="scene-original-boundary"><span>Today's work ends</span></div>
        <div className="scene-new-work-reading"><span>New problems</span><strong>+{percent(snapshot.work.newWork)}</strong></div>
      </div>

      <div className="scene-revenue">
        <span>Incumbent revenue <strong>{money.format(snapshot.incumbentValue)}</strong></span>
        <i />
      </div>

      <div className="scene-evaporation" style={{ left: `${Math.max(8, handled * 0.55)}%` }} aria-hidden="true">
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
