import type { AudioFeatures, NoiseType } from '../types/audio';

export function classifyNoise(features: AudioFeatures, noiseFloor = 0.012): NoiseType {
  const floor = Math.max(0.004, Math.min(noiseFloor, 0.035));
  const quietThreshold = Math.max(floor * 1.38, 0.010);
  const speechThreshold = Math.max(floor * 1.75, floor + 0.0055);
  const activeThreshold = Math.max(floor * 1.45, floor + 0.004);
  const stableVariance = 0.0001;

  if (features.rms < quietThreshold && features.peakCount < 6) {
    return 'quiet';
  }

  if (
    features.rms >= speechThreshold &&
    features.midFreqRatio > 0.24 &&
    features.volumeVariance > 0.000025
  ) {
    return 'speech';
  }

  if (
    features.rms >= activeThreshold &&
    features.midFreqRatio > 0.31 &&
    features.highFreqRatio < 0.58
  ) {
    return 'speech';
  }

  if (features.suddenPeakDetected && features.rms > Math.max(floor * 2.4, 0.024)) {
    return 'sudden';
  }

  if (features.rms < quietThreshold && features.peakCount < 8) {
    return 'quiet';
  }

  if (features.peakCount > 14 && features.highFreqRatio > 0.23) {
    return 'typing';
  }

  if (features.lowFreqRatio > 0.46 && features.volumeVariance < 0.0008) {
    return 'traffic';
  }

  if (features.volumeVariance < stableVariance && features.rms >= activeThreshold) {
    return 'fan';
  }

  if (
    features.rms >= activeThreshold &&
    features.midFreqRatio > 0.26 &&
    features.volumeVariance > 0.00004
  ) {
    return 'speech';
  }

  return 'unknown';
}

export function calculateIntensity(features: AudioFeatures, noiseFloor = 0.008): number {
  const floor = Math.max(0.004, Math.min(noiseFloor, 0.035));
  const relativeRms = Math.max(0, features.rms - floor);
  const rmsScore = Math.min(relativeRms * 1800 + features.rms * 300, 82);
  const varianceScore = Math.min(features.volumeVariance * 14000, 18);
  return Math.max(0, Math.min(Math.round(rmsScore + varianceScore), 100));
}
