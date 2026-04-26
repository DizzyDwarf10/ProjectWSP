import { ref } from 'vue';

export type DistanceUnit = 'km' | 'miles';

const KM_PER_MILE = 1.60934;

const stored = localStorage.getItem('distanceUnit');
export const distanceUnit = ref<DistanceUnit>(stored === 'miles' ? 'miles' : 'km');

export function setDistanceUnit(unit: DistanceUnit) {
  distanceUnit.value = unit;
  localStorage.setItem('distanceUnit', unit);
}

/** Convert a km value from the DB into the display unit */
export function fromKm(km: number, unit: DistanceUnit = distanceUnit.value): number {
  return unit === 'miles' ? km / KM_PER_MILE : km;
}

/** Convert a user-entered value in the current unit back to km for storage */
export function toKm(value: number, unit: DistanceUnit = distanceUnit.value): number {
  return unit === 'miles' ? value * KM_PER_MILE : value;
}

/** Format a km value for display with label */
export function formatDistance(km: number | null | undefined, unit: DistanceUnit = distanceUnit.value): string {
  if (km == null) return '—';
  const val = fromKm(km, unit);
  return `${val.toFixed(2)} ${unit}`;
}
