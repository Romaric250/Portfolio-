const enc = new TextEncoder();

export function timingSafeEqualUtf8(provided: string, expected: string): boolean {
  const a = enc.encode(provided);
  const b = enc.encode(expected);
  if (a.length !== b.length) {
    timingSafeEqualUtf8(expected, expected);
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}
