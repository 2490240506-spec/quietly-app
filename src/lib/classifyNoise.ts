import type { AudioFeatures, NoiseType } from '../types/audio';

export function classifyNoise(features: AudioFeatures): NoiseType {
  const quietThreshold = 0.02;
  const veryQuietThreshold = 0.012;
  const stableVariance = 0.0001;

  if (features.rms < veryQuietThreshold) {
    return 'quiet';
  }

  if (
    features.rms > quietThreshold * 1.25 &&
    features.midFreqRatio > 0.3 &&
    features.volumeVariance > 0.00016
  ) {
    return 'speech';
  }

  if (features.suddenPeakDetected && features.rms > quietThreshold * 1.2) {
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

  if (features.volumeVariance < stableVariance && features.rms >= quietThreshold) {
    return 'fan';
  }

  if (features.midFreqRatio > 0.28 && features.volumeVariance > 0.00012) {
    return 'speech';
  }

  return 'unknown';
}

export function calculateIntensity(features: AudioFeatures): number {
  const rmsScore = Math.min(features.rms * 900, 82);
  const varianceScore = Math.min(features.volumeVariance * 9000, 18);
  return Math.max(0, Math.min(Math.round(rmsScore + varianceScore), 100));
}
