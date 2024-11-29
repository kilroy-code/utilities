export const performance = (typeof window !== 'undefined') ? window.performance : (await import('perf_hooks')).performance ;
