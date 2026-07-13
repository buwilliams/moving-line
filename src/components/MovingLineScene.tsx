import { useState, type CSSProperties, type KeyboardEvent } from "react";
import type { WorkAssumptions, WorkSnapshot } from "../model/workModel";

interface MovingLineSceneProps {
  snapshot: WorkSnapshot;
  assumptions: WorkAssumptions;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percent = (value: number) => `${Math.round(value * 100)}%`;
type DetailKey = "ai" | "gap" | "human" | "core" | "new" | "turnover";
type ExpandedDetailKey = DetailKey | "frontier" | "identity" | "client" | "entrant" | "newIdentity";

interface SceneDetail {
  title: string;
  claim: string;
  assumption?: string;
  metrics: string[][];
}

export function MovingLineScene({ snapshot, assumptions }: MovingLineSceneProps) {
  const [activeDetail, setActiveDetail] = useState<ExpandedDetailKey | null>(null);
  const baselineRevenue = assumptions.annualRevenue;
  const position = (share: number) => Math.max(0, Math.min(1, share)) * 100;
  const handled = position(snapshot.work.handledPosition);
  const frontier = position(snapshot.work.frontierPosition);
  const identity = position(snapshot.work.identityBoundary);
  const core = position(1 - snapshot.work.constitutiveCore);
  const newWorkStart = position(1 - snapshot.work.newWork);
  const revenueRatio = Math.min(1, snapshot.legacyRevenueAnnual / Math.max(1, baselineRevenue));
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
  const totalCapturedValue = snapshot.incumbentValue + snapshot.newIdentityValue + snapshot.entrantValue + snapshot.clientValue;
  const capturedShare = (value: number) => percent(value / Math.max(1, totalCapturedValue));
  const formatRate = (value: number) => value < 1 ? `${value.toFixed(3).replace(/0+$/, "")}x` : `${value.toFixed(1).replace(/\.0$/, "")}x`;
  const captureIsVisible = (value: number) => value >= baselineRevenue * 0.001;
  const details: Record<ExpandedDetailKey, SceneDetail> = {
    ai: {
      title: "AI Work",
      claim: "Work already handled with AI can sit inside clients, entrants, or new identities; it is distinct from technical capability alone.",
      assumption: "Market handling combines slower client absorption with faster entry by organizations founded around current capability.",
      metrics: [["Current share", percent(snapshot.work.aiWork)], ["Work quantity", `${workUnits(snapshot.work.aiWork)} index points`]],
    },
    gap: {
      title: "Capability gap",
      claim: "Work AI can perform that the market has not yet converted into AI Work. This is not the interregnum, which is a period in the revenue transition.",
      assumption: "The gap closes through modeled client absorption and market entry rather than on a fixed date.",
      metrics: [["Current share", percent(snapshot.work.capabilityGap)], ["Work quantity", `${workUnits(snapshot.work.capabilityGap)} index points`]],
    },
    human: {
      title: "Human Work",
      claim: "This work is beyond current AI capability, not permanently human. Its contents change as models improve.",
      metrics: [["Current share", percent(snapshot.work.humanWork)], ["Work quantity", `${workUnits(snapshot.work.humanWork)} index points`]],
    },
    core: {
      title: "Constitutive core",
      claim: "Trust, liability, accountability, and legitimacy persist as social or legal relations even when surrounding labor changes.",
      assumption: `Its size is an open question, set to ${percent(assumptions.constitutiveCore)} in this scenario and held as a share of current work.`,
      metrics: [["Current share", percent(snapshot.work.constitutiveCore)], ["Work quantity", `${workUnits(snapshot.work.constitutiveCore)} index points`]],
    },
    new: {
      title: "New Work",
      claim: "New capability opens problems, products, and roles that could not previously be specified. This work expands the current 100%.",
      assumption: "The opening quantity and subsequent creation curve are explanatory coefficients, not an empirical forecast.",
      metrics: [["Current share", percent(snapshot.work.newWork)], ["Work quantity", `${workUnits(snapshot.work.newWork)} index points`]],
    },
    turnover: {
      title: "Work turnover",
      claim: "Economy-wide workload is not conserved: tasks disappear, demand expands, and entirely new work appears.",
      assumption: "The opening index is 100. Creation and retirement rates are illustrative model coefficients.",
      metrics: [["Current work index", `${Math.round(snapshot.work.totalWorkIndex * 100)}`], ["Retired from opening", percent(snapshot.work.retiredWork)]],
    },
    frontier: {
      title: "AI can do",
      claim: "The compression frontier marks work current AI can technically perform. It moves at research speed; capability is not adoption.",
      assumption: `Technical reach follows an exponential curve at the selected ${formatRate(assumptions.frontierPace)} capability pace.`,
      metrics: [["Current share", percent(snapshot.work.frontierPosition)], ["Work quantity", `${workUnits(snapshot.work.frontierPosition)} index points`]],
    },
    identity: {
      title: "Clients hire us for",
      claim: "This is the incumbent's buyer-permission boundary: the work clients believe the firm is for. Identity changes slowest.",
      assumption: `The boundary follows the selected ${formatRate(assumptions.identityPace)} identity pace and is normalized against an expanding work field, so its share can move left even while its absolute boundary changes.`,
      metrics: [["Current share", percent(snapshot.work.identityBoundary)], ["Boundary quantity", `${workUnits(snapshot.work.identityBoundary)} index points`]],
    },
    client: {
      title: "Client organizations",
      claim: "When internal use becomes cheaper than external exchange, work moves client-side. The essay locates much of the employee opportunity inside these organizations.",
      assumption: "Client capture follows absorbed capability and realized New Work in this explanatory scenario.",
      metrics: [["Annual value", money.format(snapshot.clientValue)], ["Share of modeled capture", capturedShare(snapshot.clientValue)]],
    },
    entrant: {
      title: "AI-native entrants",
      claim: "Entrants can begin near the current frontier without redrawing an inherited identity, but their positional advantage acquires identity debt over time.",
      assumption: "Entrant capture follows market entry, the capability-to-identity gap, and realized New Work.",
      metrics: [["Annual value", money.format(snapshot.entrantValue)], ["Share of modeled capture", capturedShare(snapshot.entrantValue)]],
    },
    newIdentity: {
      title: "Protected new identity",
      claim: "A separate structure can carry new economics, mandate, and selection criteria that the incumbent identity cannot automatically claim.",
      assumption: "This value remains separate from incumbent revenue and follows market entry plus identity formation.",
      metrics: [["Annual value", money.format(snapshot.newIdentityValue)], ["Share of modeled capture", capturedShare(snapshot.newIdentityValue)]],
    },
  };
  const detailProps = (key: ExpandedDetailKey, focusable = true) => ({
    tabIndex: focusable ? 0 : -1,
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
        <div className="scene-segment scene-segment--core" aria-label="Constitutive core details" {...detailProps("core")}>
          <span className="scene-segment__reading"><b data-short="Core">Constitutive core</b><strong>{percent(snapshot.work.constitutiveCore)}</strong><small>trust + liability</small></span>
        </div>
        <div className="scene-new-overlay" />

        <div className="scene-boundary scene-boundary--frontier"><span aria-label="AI can do details" {...detailProps("frontier")}><b>AI can do</b><strong>{percent(snapshot.work.frontierPosition)}</strong></span></div>
        <div className="scene-boundary scene-boundary--identity"><span aria-label="Clients hire us for details" {...detailProps("identity")}><b>Clients hire us for</b><strong>{percent(snapshot.work.identityBoundary)}</strong></span></div>
        <div className="scene-original-boundary"><span>Problem frontier</span></div>
        <div className="scene-new-work-reading" aria-label="New Work details" {...detailProps("new")}><span>New Work</span><strong>{percent(snapshot.work.newWork)}</strong></div>
      </div>

      {detail && <div id="scene-detail-popover" className="scene-detail-popover" role="tooltip">
        <strong>{detail.title}</strong>
        <small>Essay claim</small>
        <p>{detail.claim}</p>
        {detail.assumption && <><small>Model assumption</small><p>{detail.assumption}</p></>}
        <small>Live result</small>
        <dl>{detail.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </div>}

      <div className="scene-revenue">
        <span>Legacy revenue model <strong>{money.format(snapshot.legacyRevenueAnnual)}</strong></span>
        <i />
      </div>

      <div className="scene-evaporation" style={{ left: `${Math.max(8, handled * 0.55)}%`, opacity: evaporationOpacity }} aria-hidden="true">
        <i />
        <span>Below the cost of external exchange</span>
      </div>

      <div className="scene-capture" aria-label="Where value moves">
        <div className="scene-capture__node scene-capture__node--client" aria-label="Client organization capture details" style={{ opacity: clientOpacity, pointerEvents: captureIsVisible(snapshot.clientValue) ? "auto" : "none" }} {...detailProps("client", captureIsVisible(snapshot.clientValue))}>
          <i style={{ width: nodeSize(snapshot.clientValue), height: nodeSize(snapshot.clientValue) }} />
          <span>Clients<strong>{money.format(snapshot.clientValue)}</strong></span>
        </div>
        <div className="scene-capture__node scene-capture__node--entrant" aria-label="AI-native entrant capture details" style={{ opacity: entrantOpacity, pointerEvents: captureIsVisible(snapshot.entrantValue) ? "auto" : "none" }} {...detailProps("entrant", captureIsVisible(snapshot.entrantValue))}>
          <i style={{ width: nodeSize(snapshot.entrantValue), height: nodeSize(snapshot.entrantValue) }} />
          <span>AI-native entrants<strong>{money.format(snapshot.entrantValue)}</strong></span>
        </div>
        <div className="scene-capture__node scene-capture__node--identity" aria-label="Protected new identity capture details" style={{ opacity: identityOpacity, pointerEvents: captureIsVisible(snapshot.newIdentityValue) ? "auto" : "none" }} {...detailProps("newIdentity", captureIsVisible(snapshot.newIdentityValue))}>
          <i style={{ width: nodeSize(snapshot.newIdentityValue), height: nodeSize(snapshot.newIdentityValue) }} />
          <span>Protected new identity<strong>{money.format(snapshot.newIdentityValue)}</strong></span>
        </div>
      </div>
    </section>
  );
}
