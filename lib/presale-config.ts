export interface PresalePhase {
  phase: number;
  label: string;
  startDate: Date;
  endDate: Date;
  priceUsd: number;
}

export const PRESALE_PHASES: PresalePhase[] = [
  {
    phase: 1,
    label: 'Phase 1',
    startDate: new Date('2026-04-20T00:00:00Z'),
    endDate: new Date('2026-05-25T23:59:59Z'),
    priceUsd: 0.00001,
  },
  {
    phase: 2,
    label: 'Phase 2',
    startDate: new Date('2026-05-26T00:00:00Z'),
    endDate: new Date('2026-06-26T23:59:59Z'),
    priceUsd: 0.00002,
  },
  {
    phase: 3,
    label: 'Phase 3',
    startDate: new Date('2026-06-27T00:00:00Z'),
    endDate: new Date('2026-07-27T23:59:59Z'),
    priceUsd: 0.00003,
  },
  {
    phase: 4,
    label: 'Phase 4',
    startDate: new Date('2026-07-28T00:00:00Z'),
    endDate: new Date('2026-07-29T23:59:59Z'),
    priceUsd: 0.00004,
  },
  {
    phase: 5,
    label: 'Phase 5',
    startDate: new Date('2026-07-30T00:00:00Z'),
    endDate: new Date('2026-08-31T23:59:59Z'),
    priceUsd: 0.00005,
  },
];

export const PRESALE_START = PRESALE_PHASES[0].startDate;
export const PRESALE_END = PRESALE_PHASES[PRESALE_PHASES.length - 1].endDate;
export const LAUNCH_DATE = new Date('2026-09-01T00:00:00Z');

export type PresaleStatus = 'notStarted' | 'active' | 'ended';

export function getPresaleStatus(now: Date): PresaleStatus {
  if (now < PRESALE_START) {
    return 'notStarted';
  }
  if (now <= PRESALE_END) {
    return 'active';
  }
  return 'ended';
}

export function getPhaseForDate(now: Date): PresalePhase {
  return (
    PRESALE_PHASES.find((phase) => now >= phase.startDate && now <= phase.endDate) ||
    PRESALE_PHASES[PRESALE_PHASES.length - 1]
  );
}

export function getUpcomingPhase(phase: PresalePhase): PresalePhase | null {
  return PRESALE_PHASES.find((item) => item.phase === phase.phase + 1) || null;
}

export function getActivePresalePriceUsd(now: Date): number {
  return getPhaseForDate(now).priceUsd;
}
