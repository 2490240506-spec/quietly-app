import type { AudioFeatures, NoiseType } from '../types/audio';

export function classifyNoise(features: AudioFeatures): NoiseType {
  const quietThreshold = 0.028;
  const veryQuietThreshold = 0.018;
  const stableVariance = 0.00012;

  if (features.rms < veryQuietThreshold) {
    return 'quiet';
  }

  if (features.suddenPeakDetected && features.rms > quietThreshold) {
    return 'sudden';
  }

  if (features.rms < quietThreshold && features.peakCount < 8) {
    return 'quiet';
  }

  if (features.peakCount > 18 && features.highFreqRatio > 0.24) {
    return 'typing';
  }

  if (features.lowFreqRatio > 0.46 && features.volumeVariance < 0.0008) {
    return 'traffic';
  }

  if (features.volumeVariance < stableVariance && features.rms >= quietThreshold) {
    return 'fan';
  }

  if (features.midFreqRatio > 0.34 && features.volumeVariance > 0.00035) {
    return 'speech';
  }

  return 'unknown';
}

export function calculateIntensity(features: AudioFeatures): number {
  const rmsScore = Math.min(features.rms * 900, 82);
  const varianceScore = Math.min(features.volumeVariance * 9000, 18);
  return Math.max(0, Math.min(Math.round(rmsScore + varianceScore), 100));
}
