import { useCallback, useRef, useState } from 'react';
import type { AnalyzerStatus, NoiseType } from '../types/audio';
import { extractFeatures } from '../lib/audioFeatures';
import { calculateIntensity, classifyNoise } from '../lib/classifyNoise';

const ANALYSIS_INTERVAL_MS = 260;
const STABILITY_WINDOW = 5;
const MIN_TYPE_HOLD_MS = 1800;
const INTENSITY_SMOOTHING = 0.34;

function chooseStableType(samples: NoiseType[], fallback: NoiseType | null): NoiseType | null {
  if (samples.length < 3) return fallback;

  const counts = samples.reduce<Record<NoiseType, number>>(
    (acc, item) => {
      acc[item] += 1;
      return acc;
    },
    {
      quiet: 0,
      speech: 0,
      typing: 0,
      fan: 0,
      traffic: 0,
      sudden: 0,
      unknown: 0,
    }
  );

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]) as [NoiseType, number][];
  const [candidate, votes] = sorted[0];
  const secondVotes = sorted[1]?.[1] ?? 0;

  if (candidate === 'speech' && votes >= 2) return candidate;
  if (votes >= 3 || votes - secondVotes >= 2) return candidate;
  return fallback;
}

export function useAudioAnalyzer() {
  const [status, setStatus] = useState<AnalyzerStatus>('idle');
  const [noiseType, setNoiseType] = useState<NoiseType | null>(null);
  const [intensity, setIntensity] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const samplesRef = useRef<NoiseType[]>([]);
  const currentTypeRef = useRef<NoiseType | null>(null);
  const lastTypeChangeRef = useRef(0);
  const intensityRef = useRef(0);

  const analyzeOnce = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    analyser.getByteFrequencyData(frequencyData);
    analyser.getByteTimeDomainData(timeData);

    const features = extractFeatures(
      frequencyData,
      timeData,
      audioContextRef.current?.sampleRate || 44100
    );

    const rawType = classifyNoise(features);
    const rawIntensity = calculateIntensity(features);
    const nextIntensity =
      intensityRef.current * (1 - INTENSITY_SMOOTHING) + rawIntensity * INTENSITY_SMOOTHING;

    intensityRef.current = nextIntensity;
    setIntensity(Math.round(nextIntensity));

    samplesRef.current = [...samplesRef.current, rawType].slice(-STABILITY_WINDOW);
    const stableType = chooseStableType(samplesRef.current, currentTypeRef.current);
    const now = Date.now();
    const canChange =
      !currentTypeRef.current ||
      now - lastTypeChangeRef.current >= MIN_TYPE_HOLD_MS ||
      stableType === 'sudden';

    if (stableType && stableType !== currentTypeRef.current && canChange) {
      currentTypeRef.current = stableType;
      lastTypeChangeRef.current = now;
      setNoiseType(stableType);
    } else if (!currentTypeRef.current && stableType) {
      currentTypeRef.current = stableType;
      lastTypeChangeRef.current = now;
      setNoiseType(stableType);
    }
  }, []);

  const startLoop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    analyzeOnce();
    timerRef.current = window.setInterval(analyzeOnce, ANALYSIS_INTERVAL_MS);
  }, [analyzeOnce]);

  const start = useCallback(async () => {
    setStatus('requesting');
    setError(null);

    try {
      if (!window.isSecureContext) {
        throw new Error('INSECURE_CONTEXT');
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('UNSUPPORTED_BROWSER');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.86;
      source.connect(analyser);
      analyserRef.current = analyser;

      samplesRef.current = [];
      currentTypeRef.current = null;
      lastTypeChangeRef.current = 0;
      intensityRef.current = 0;

      setStatus('analyzing');
      await new Promise((resolve) => setTimeout(resolve, 1800));
      startLoop();
      setStatus('done');
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setStatus('error');
      if (err.message === 'INSECURE_CONTEXT') {
        setError('\u5f53\u524d\u9875\u9762\u4e0d\u662f\u5b89\u5168\u4e0a\u4e0b\u6587\uff0c\u6d4f\u89c8\u5668\u4f1a\u7981\u7528\u9ea6\u514b\u98ce\u3002\u8bf7\u4f7f\u7528 localhost \u6216 HTTPS \u6253\u5f00\u3002');
      } else if (err.message === 'UNSUPPORTED_BROWSER') {
        setError('\u5f53\u524d\u5185\u7f6e\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u9ea6\u514b\u98ce\u8bbf\u95ee\u3002\u8bf7\u7528 Chrome\u3001Edge \u6216\u7cfb\u7edf\u6d4f\u89c8\u5668\u6253\u5f00\u3002');
      } else if (err.name === 'NotAllowedError') {
        setError('\u9ea6\u514b\u98ce\u6743\u9650\u88ab\u62d2\u7edd\u3002\u8bf7\u5728\u6d4f\u89c8\u5668\u5730\u5740\u680f\u6216\u7cfb\u7edf\u9690\u79c1\u8bbe\u7f6e\u4e2d\u5141\u8bb8\u9ea6\u514b\u98ce\u3002');
      } else if (err.name === 'NotFoundError') {
        setError('\u672a\u68c0\u6d4b\u5230\u53ef\u7528\u9ea6\u514b\u98ce\u3002\u4f60\u4ecd\u7136\u53ef\u4ee5\u624b\u52a8\u9009\u62e9\u58f0\u573a\u3002');
      } else {
        setError('\u9ea6\u514b\u98ce\u8bbf\u95ee\u5931\u8d25\u3002\u5982\u679c\u4f60\u5728 Codex \u5185\u7f6e\u6d4f\u89c8\u5668\u4e2d\u9884\u89c8\uff0c\u8bf7\u6539\u7528 Chrome \u6216 Edge \u6253\u5f00\u672c\u5730\u5730\u5740\u3002');
      }
    }
  }, [startLoop]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    samplesRef.current = [];
    currentTypeRef.current = null;
    setStatus('idle');
    setNoiseType(null);
    setIntensity(0);
  }, []);

  return {
    status,
    noiseType,
    intensity,
    error,
    start,
    stop,
  } as const;
}
