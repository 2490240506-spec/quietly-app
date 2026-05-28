import type { PlayerStatus } from '../types/audio';
import styles from './PlayerControls.module.css';

interface Props {
  status: PlayerStatus;
  maskingStrength: number;
  volume: number;
  onTogglePlay: () => void;
  onMaskingStrengthChange: (value: number) => void;
  onVolumeChange: (value: number) => void;
  currentSceneName?: string;
}

export function PlayerControls({
  status,
  maskingStrength,
  volume,
  onTogglePlay,
  onMaskingStrengthChange,
  onVolumeChange,
  currentSceneName,
}: Props) {
  const isPlaying = status === 'playing';

  return (
    <section className={styles.section} aria-label={'\u64ad\u653e\u63a7\u5236'}>
      <div className={styles.topRow}>
        <div>
          <p>{'\u6b63\u5728\u63a9\u853d\u566a\u97f3'}</p>
          <h2>{currentSceneName || '\u5c1a\u672a\u9009\u62e9\u58f0\u573a'}</h2>
        </div>
        <span className={styles.state}>{isPlaying ? '\u64ad\u653e\u4e2d' : '\u5df2\u6682\u505c'}</span>
      </div>

      <div className={styles.controlBody}>
        <button
          className={styles.playBtn}
          onClick={onTogglePlay}
          aria-label={isPlaying ? '\u6682\u505c' : '\u64ad\u653e'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="7" y="5" width="3.5" height="14" rx="1.4" />
              <rect x="13.5" y="5" width="3.5" height="14" rx="1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5 18 12 8 18.5z" />
            </svg>
          )}
        </button>

        <div className={styles.sliders}>
          <label className={styles.sliderRow}>
            <span>
              <b>{'\u63a9\u853d\u5f3a\u5ea6'}</b>
              <em>{maskingStrength}%</em>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={maskingStrength}
              onChange={(event) => onMaskingStrengthChange(Number(event.target.value))}
              aria-label={'\u63a9\u853d\u5f3a\u5ea6'}
            />
          </label>
          <label className={styles.sliderRow}>
            <span>
              <b>{'\u4e3b\u97f3\u91cf'}</b>
              <em>{volume}%</em>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
              aria-label={'\u4e3b\u97f3\u91cf'}
            />
          </label>
        </div>
      </div>
    </section>
  );
}
