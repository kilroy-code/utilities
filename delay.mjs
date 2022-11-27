export function delay(ms = 30, value = true) { // Default is for small network ping time.
  return new Promise(resolve => setTimeout(_ => resolve(value), ms));
}
export function tick() { // The name reflects the usage.
  return delay(0);
}
