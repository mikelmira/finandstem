export interface NumericRange {
  min: number;
  max: number;
}

export function parseRange(input: string | undefined | null): NumericRange | null {
  if (!input) return null;
  const cleaned = String(input).trim();
  if (!cleaned) return null;
  // No aquarium parameter is negative, so we deliberately do NOT treat a
  // leading `-` as a sign. That keeps ASCII-hyphen ranges ("22-28") parsing
  // identically to en-dash ("22–28") and em-dash ("22—28") — otherwise the
  // hyphen before the second number reads as a negative sign and inverts
  // the range (min: -28, max: 22).
  const match = cleaned.match(/\d+(?:\.\d+)?/g);
  if (!match || match.length === 0) return null;
  const nums = match.map((n) => Number(n));
  if (nums.some((n) => Number.isNaN(n))) return null;
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) };
}

export function parseLeadingNumber(input: string | undefined | null): number | null {
  if (!input) return null;
  const m = String(input).match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isNaN(n) ? null : n;
}

export function overlaps(a: NumericRange | null, b: NumericRange | null): boolean {
  if (!a || !b) return false;
  return a.min <= b.max && a.max >= b.min;
}

export function within(value: number | null, b: NumericRange | null): boolean {
  if (value === null || !b) return false;
  return value >= b.min && value <= b.max;
}
