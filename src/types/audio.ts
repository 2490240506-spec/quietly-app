export type NoiseType =
  | 'quiet'
  | 'speech'
  | 'typing'
  | 'fan'
  | 'traffic'
  | 'sudden'
  | 'unknown';

export interface NoiseTypeInfo {
  id: NoiseType;
  label: string;
  description: string;
}

export type SceneType =
  | 'rain_focus'
  | 'cafe_murmur'
  | 'ocean_low'
  | 'forest_breeze'
  | 'deep_focus';

export interface SceneInfo {
  id: SceneType;
  name: string;
  description: string;
  audioPath: string;
}

export interface AudioFeatures {
  rms: number;
  peakCount: number;
  lowFreqRatio: number;
  midFreqRatio: number;
  highFreqRatio: number;
  volumeVariance: number;
  suddenPeakDetected: boolean;
}

export type AnalyzerStatus = 'idle' | 'requesting' | 'analyzing' | 'done' | 'error';

export interface AnalysisResult {
  status: AnalyzerStatus;
  noiseType: NoiseType | null;
  intensity: number;
  features: AudioFeatures | null;
  error: string | null;
}

export type PlayerStatus = 'idle' | 'playing' | 'paused';

export interface SoundPlayerState {
  status: PlayerStatus;
  currentScene: SceneType | null;
  volume: number;
  maskingStrength: number;
}

export interface FocusTimerState {
  duration: number;
  remaining: number;
  isRunning: boolean;
}
