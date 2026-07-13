import { clamp01, dateToDay, daysBetween, type ISODate } from "./time";

export const SIMULATION_START: ISODate = "2026-07-01";
export const SIMULATION_END: ISODate = "2036-06-30";

export interface WorkAssumptions {
  annualRevenue: number;
  frontierPace: number;
  absorptionPace: number;
  demandResponse: number;
  identityPace: number;
}

export const DEFAULT_WORK_ASSUMPTIONS: WorkAssumptions = {
  annualRevenue: 2_900_000,
  frontierPace: 8,
  absorptionPace: 0.5,
  demandResponse: 2,
  identityPace: 0.125,
};

export interface WorkSnapshot {
  date: ISODate;
  horizonProgress: number;
  capabilityProgress: number;
  absorptionProgress: number;
  distributionProgress: number;
  marketEntryProgress: number;
  identityProgress: number;
  work: {
    aiWork: number;
    interregnum: number;
    humanWork: number;
    constitutiveCore: number;
    newWork: number;
    frontierPosition: number;
    handledPosition: number;
    identityBoundary: number;
  };
  agencyRevenueAnnual: number;
  incumbentValue: number;
  newIdentityValue: number;
  entrantValue: number;
  clientValue: number;
  evaporatedValue: number;
}

const INITIAL_FRONTIER = 0.22;
const INITIAL_ABSORPTION = 0.08;
const INITIAL_IDENTITY_BOUNDARY = 0.26;
const INITIAL_NEW_WORK = 0.04;
const CONSTITUTIVE_CORE = 0.05;
const CONTINGENT_LIMIT = 1 - CONSTITUTIVE_CORE;

const exponentialProgress = (progress: number, pace: number, intensity: number) =>
  clamp01(1 - Math.exp(-progress * pace * intensity));

export function simulateWorkAt(assumptions: WorkAssumptions, date: ISODate): WorkSnapshot {
  const horizonProgress = clamp01(
    daysBetween(SIMULATION_START, date) /
      Math.max(1, daysBetween(SIMULATION_START, SIMULATION_END)),
  );

  const capabilityProgress = exponentialProgress(horizonProgress, assumptions.frontierPace, 1.35);
  const absorptionProgress = exponentialProgress(horizonProgress, assumptions.absorptionPace, 1.55);
  const demandActivation = exponentialProgress(horizonProgress, assumptions.demandResponse, 1.25);
  const distributionProgress = Math.min(absorptionProgress, absorptionProgress * demandActivation);
  const marketEntryProgress = exponentialProgress(horizonProgress, assumptions.demandResponse, 3.5);
  const identityProgress = exponentialProgress(horizonProgress, assumptions.identityPace, 0.9);

  const frontierPosition =
    INITIAL_FRONTIER + (CONTINGENT_LIMIT - INITIAL_FRONTIER) * capabilityProgress;
  const clientAbsorptionPosition =
    INITIAL_ABSORPTION + (frontierPosition - INITIAL_ABSORPTION) * absorptionProgress;
  const marketHandlingProgress = clamp01(
    1 - (1 - absorptionProgress) * (1 - marketEntryProgress * 0.8),
  );
  const handledPosition =
    INITIAL_ABSORPTION + (frontierPosition - INITIAL_ABSORPTION) * marketHandlingProgress;
  const identityBoundary =
    INITIAL_IDENTITY_BOUNDARY + (CONTINGENT_LIMIT - INITIAL_IDENTITY_BOUNDARY) * identityProgress;

  const aiWork = handledPosition;
  const interregnum = Math.max(0, frontierPosition - handledPosition);
  const humanWork = Math.max(0, CONTINGENT_LIMIT - frontierPosition);
  const clientAbsorbedGain = Math.max(0, clientAbsorptionPosition - INITIAL_ABSORPTION);
  const newWork = INITIAL_NEW_WORK + capabilityProgress * 0.5;

  // Capability opens possible work immediately. Clients realize it through
  // absorption; entrants and new identities can realize it at founding speed.
  const realizationProgress = clamp01(distributionProgress + marketEntryProgress * 0.35);
  const realizedNewWork = newWork * (0.08 + 0.92 * realizationProgress);

  const baseline = assumptions.annualRevenue;
  const legacyRetention = 1 - 0.95 * capabilityProgress;
  const constitutiveCapture =
    CONSTITUTIVE_CORE * capabilityProgress * (0.35 + 0.65 * identityProgress);
  const incumbentExpansion = realizedNewWork * identityProgress * 0.12;
  const incumbentValue = baseline * Math.max(0, legacyRetention + constitutiveCapture + incumbentExpansion);
  const newIdentityValue = baseline * (
    realizedNewWork * marketEntryProgress * (0.12 + 0.28 * identityProgress)
  );
  const entrantValue = baseline * (
    Math.max(0, handledPosition - clientAbsorptionPosition) * 0.35 +
    realizedNewWork * (1 - identityProgress) * 0.35
  );
  const clientValue = baseline * (
    clientAbsorbedGain * (0.55 + 0.25 * absorptionProgress) +
    realizedNewWork * absorptionProgress * 0.25
  );
  const evaporatedValue = baseline * capabilityProgress * (1 - absorptionProgress) * 0.3;

  return {
    date,
    horizonProgress,
    capabilityProgress,
    absorptionProgress,
    distributionProgress,
    marketEntryProgress,
    identityProgress,
    work: {
      aiWork,
      interregnum,
      humanWork,
      constitutiveCore: CONSTITUTIVE_CORE,
      newWork,
      frontierPosition,
      handledPosition,
      identityBoundary,
    },
    agencyRevenueAnnual: incumbentValue + newIdentityValue,
    incumbentValue,
    newIdentityValue,
    entrantValue,
    clientValue,
    evaporatedValue,
  };
}

export function isWithinSimulation(date: ISODate) {
  const day = dateToDay(date);
  return day >= dateToDay(SIMULATION_START) && day <= dateToDay(SIMULATION_END);
}
