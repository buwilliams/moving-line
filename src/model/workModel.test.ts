import { describe, expect, it } from "vitest";
import {
  DEFAULT_WORK_ASSUMPTIONS,
  SIMULATION_END,
  SIMULATION_START,
  simulateWorkAt,
} from "./workModel";

describe("work landscape model", () => {
  it("opens with client demand narrowly ahead of AI capability", () => {
    const snapshot = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_START);
    expect(snapshot.work.identityBoundary).toBeGreaterThan(snapshot.work.frontierPosition);
    expect(snapshot.agencyRevenueAnnual).toBeCloseTo(DEFAULT_WORK_ASSUMPTIONS.annualRevenue, 2);
  });

  it("makes capability outrun absorption and identity", () => {
    const snapshot = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, "2029-07-01");
    expect(snapshot.capabilityProgress).toBeGreaterThan(snapshot.absorptionProgress);
    expect(snapshot.absorptionProgress).toBeGreaterThan(snapshot.identityProgress);
    expect(snapshot.work.frontierPosition).toBeGreaterThan(snapshot.work.identityBoundary);
    expect(snapshot.work.interregnum).toBeGreaterThan(0.1);
    expect(snapshot.distributionProgress).toBeLessThanOrEqual(snapshot.absorptionProgress);
    expect(
      snapshot.work.aiWork +
      snapshot.work.interregnum +
      snapshot.work.humanWork +
      snapshot.work.constitutiveCore,
    ).toBeCloseTo(1, 8);
  });

  it("moves the capability line across roughly 95% of work within five years", () => {
    const fiveYears = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, "2031-07-01");
    expect(fiveYears.work.frontierPosition).toBeGreaterThan(0.945);
    expect(fiveYears.work.handledPosition).toBeLessThan(fiveYears.work.frontierPosition);
    expect(fiveYears.work.identityBoundary).toBeLessThan(fiveYears.work.frontierPosition);
  });

  it("starts every clock immediately while preserving their different speeds", () => {
    const opening = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_START);
    const firstMonth = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, "2026-08-01");
    expect(firstMonth.work.aiWork).toBeGreaterThan(opening.work.aiWork);
    expect(firstMonth.work.frontierPosition).toBeGreaterThan(opening.work.frontierPosition);
    expect(firstMonth.distributionProgress).toBeGreaterThan(opening.distributionProgress);
    expect(firstMonth.marketEntryProgress).toBeGreaterThan(opening.marketEntryProgress);
    expect(firstMonth.identityProgress).toBeGreaterThan(opening.identityProgress);
  });

  it("lets market entry close the interregnum after its early peak", () => {
    const opening = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_START);
    const firstYear = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, "2027-07-01");
    const ending = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_END);
    expect(firstYear.work.interregnum).toBeGreaterThan(opening.work.interregnum);
    expect(ending.work.interregnum).toBeLessThan(firstYear.work.interregnum);
    expect(firstYear.marketEntryProgress).toBeGreaterThan(firstYear.absorptionProgress);
  });

  it("opens with new work already visible and expands it with capability", () => {
    const opening = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_START);
    const firstYear = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, "2027-07-01");
    const ending = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_END);
    expect(opening.work.newWork).toBeCloseTo(0.04, 8);
    expect(firstYear.work.newWork).toBeGreaterThan(opening.work.newWork);
    expect(ending.work.newWork).toBeGreaterThan(0.4);
  });

  it("moves value away from the incumbent over the default path", () => {
    const opening = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_START);
    const ending = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_END);
    expect(ending.agencyRevenueAnnual).toBeLessThan(opening.agencyRevenueAnnual * 0.2);
    expect(ending.entrantValue).toBeGreaterThan(ending.newIdentityValue);
    expect(ending.clientValue).toBeGreaterThan(ending.incumbentValue);
  });

  it("scales all monetary outputs with starting revenue", () => {
    const base = simulateWorkAt(DEFAULT_WORK_ASSUMPTIONS, SIMULATION_END);
    const doubled = simulateWorkAt(
      { ...DEFAULT_WORK_ASSUMPTIONS, annualRevenue: DEFAULT_WORK_ASSUMPTIONS.annualRevenue * 2 },
      SIMULATION_END,
    );
    expect(doubled.agencyRevenueAnnual).toBeCloseTo(base.agencyRevenueAnnual * 2, 4);
    expect(doubled.clientValue).toBeCloseTo(base.clientValue * 2, 4);
  });
});
