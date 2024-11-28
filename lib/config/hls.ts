export const HLS_CONFIG = {
  enableWorker: true,
  lowLatencyMode: true,
  liveSyncDurationCount: 2, // Reduced for lower latency
  liveMaxLatencyDurationCount: 3, // Reduced for lower latency
  maxBufferSize: 10 * 1000 * 1000, // 10MB - reduced for lower memory usage
  maxBufferLength: 5, // Reduced for lower latency
  manifestLoadingTimeOut: 10000,
  manifestLoadingMaxRetry: 2,
  manifestLoadingRetryDelay: 500,
  levelLoadingTimeOut: 5000,
  levelLoadingMaxRetry: 2,
  levelLoadingRetryDelay: 500,
  fragLoadingTimeOut: 5000,
  fragLoadingMaxRetry: 2,
  fragLoadingRetryDelay: 500,
  startFragPrefetch: true,
  testBandwidth: true,
  progressive: true,
  backBufferLength: 5, // Reduced for lower memory usage
  maxMaxBufferLength: 10,
  maxFragLookUpTolerance: 0.2,
  liveDurationInfinity: true,
  liveBackBufferLength: 5, // Keep only 5 seconds of back buffer
  enableWebVTT: false,
  enableIMSC1: false,
  enableCEA708Captions: false,
  autoStartLoad: true,
  startPosition: -1,
  defaultAudioCodec: undefined,
  debug: false,
  capLevelOnFPSDrop: true,
  capLevelToPlayerSize: true,
  ignoreDevicePixelRatio: true,
  // ABR configuration for low latency
  abrEwmaDefaultEstimate: 500000,
  abrEwmaFastLive: 2,
  abrEwmaSlowLive: 5,
  abrBandWidthFactor: 0.9,
  abrBandWidthUpFactor: 0.7,
  abrMaxWithRealBitrate: true,
  // Low latency specific settings
  highBufferWatchdogPeriod: 1,
  nudgeOffset: 0.1,
  nudgeMaxRetry: 3,
  maxStarvationDelay: 1,
  maxLoadingDelay: 1,
  minAutoBitrate: 0
} as const