import type { AudioFeatures } from '../types/audio';

export function extractFeatures(
  frequencyData: Uint8Array,
  timeData: Uint8Array,
  sampleRate: number
): AudioFeatures {
  const bufferLength = frequencyData.length;
  const fftSize = bufferLength * 2;

  let sumSquares = 0;
  for (let i = 0; i < timeData.length; i += 1) {
    const normalized = (timeData[i] - 128) / 128;
    sumSquares += normalized * normalized;
  }
  const rms = Math.sqrt(sumSquares / timeData.length);

  const binWidth = sampleRate / fftSize;
  const lowEnd = Math.floor(220 / binWidth);
  const midEnd = Math.floor(2200 / binWidth);
  const highEnd = Math.floor(8200 / binWidth);

  let lowSum = 0;
  let midSum = 0;
  let highSum = 0;

  for (let i = 0; i < bufferLength; i += 1) {
    const value = frequencyData[i];
    if (i < lowEnd) lowSum += value;
    else if (i < midEnd) midSum += value;
    else if (i < highEnd) highSum += value;
  }

  const totalSum = lowSum + midSum + highSum || 1;
  const lowFreqRatio = lowSum / totalSum;
  const midFreqRatio = midSum / totalSum;
  const highFreqRatio = highSum / totalSum;

  let peakCount = 0;
  const threshold = 0.16;
  for (let i = 1; i < timeData.length; i += 1) {
    const current = Math.abs((timeData[i] - 128) / 128);
    const prev = Math.abs((timeData[i - 1] - 128) / 128);
    if (current > threshold && current > prev * 1.55) {
      peakCount += 1;
    }
  }

  const chunkSize = Math.max(1, Math.floor(timeData.length / 10));
  const chunkRms: number[] = [];

  for (let i = 0; i < 10; i += 1) {
    let chunkSum = 0;
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, timeData.length);
    for (let j = start; j < end; j += 1) {
      const normalized = (timeData[j] - 128) / 128;
      chunkSum += normalized * normalized;
    }
    chunkRms.push(Math.sqrt(chunkSum / Math.max(1, end - start)));
  }

  const avgRms = chunkRms.reduce((sum, value) => sum + value, 0) / chunkRms.length;
  const volumeVariance =
    chunkRms.reduce((sum, value) => sum + (value - avgRms) ** 2, 0) / chunkRms.length;

  const maxChunk = Math.max(...chunkRms);
  const suddenPeakDetected = maxChunk > avgRms * 3.2 && maxChunk > 0.11;

  return {
    rms,
    peakCount,
    lowFreqRatio,
    midFreqRatio,
    highFreqRatio,
    volumeVariance,
    suddenPeakDetected,
  };
}
