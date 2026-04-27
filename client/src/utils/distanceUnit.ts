import { ref } from 'vue';

export type DistanceUnit = 'km' | 'miles';

const KM_PER_MILE = 1.60934;
const CONVERSION_DECIMALS = 6;

const stored = localStorage.getItem('distanceUnit');
export const distanceUnit = ref<DistanceUnit>(stored === 'miles' ? 'miles' : 'km');

export function setDistanceUnit(unit: DistanceUnit) {
  distanceUnit.value = unit;
  localStorage.setItem('distanceUnit', unit);
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Convert a km value from the DB into the display unit */
export function fromKm(km: number, unit: DistanceUnit = distanceUnit.value): number {
  const converted = unit === 'miles' ? km / KM_PER_MILE : km;
  return roundTo(converted, CONVERSION_DECIMALS);
}

/** Convert a user-entered value in the current unit back to km for storage */
export function toKm(value: number, unit: DistanceUnit = distanceUnit.value): number {
  const converted = unit === 'miles' ? value * KM_PER_MILE : value;
  return roundTo(converted, CONVERSION_DECIMALS);
}

/** Format a km value for display with label */
export function formatDistance(km: number | null | undefined, unit: DistanceUnit = distanceUnit.value): string {
  if (km == null) return '—';
  const val = fromKm(km, unit);
  return `${val.toFixed(2)} ${unit}`;
}
