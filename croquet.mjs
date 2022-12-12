// Subtle and fagile timing!
// In the browser, everything gets bound synchronously, using the window global, which we include in the header, so it's ready by the time this gets loaded.
// In NodeJS, it's bound right away, but doesn't have a value until the await import completes, which HAPPENS to be faster than the binding is used because it's not going through a server.
export const { Croquet } = (typeof window !== 'undefined') ? window : await import('@kilroy-code/croquet-in-memory/index.mjs');
