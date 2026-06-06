import type { CSSProperties } from 'react';
import type { AnalyzerStatus, SceneType } from '../types/audio';
import { assetPath } from '../lib/assetPath';
import styles from './DetectionPanel.module.css';

interface Props {
  status: AnalyzerStatus;
  onStart: () => void;
  onManualSelect?: () => void;
  error: string | null;
  currentScene: SceneType | null;
}

const sceneMeta: Record<SceneType, { label: string; description: string; image: string }> = {
  rain_focus: {
    label: '\u96e8\u58f0\u4e13\u6ce8',
    description: '\u7ec6\u5bc6\u96e8\u58f0\u9002\u5408\u63a9\u853d\u4f4e\u8bed\u3001\u952e\u76d8\u548c\u7ffb\u4e66\u58f0\u3002',
    image: assetPath('/scenes/rain-focus.webp'),
  },
  cafe_murmur: {
    label: '\u5496\u5561\u9986\u4f4e\u8bed',
    description: '\u67d4\u548c\u80cc\u666f\u6c1b\u56f4\u5f31\u5316\u7a81\u5140\u804a\u5929\u58f0\u3002',
    image: assetPath('/scenes/cafe-murmur.webp'),
  },
  ocean_low: {
    label: '\u6d77\u6d0b\u4f4e\u9891',
    description: '\u4f4e\u9891\u6d77\u6d6a\u9002\u5408\u8986\u76d6\u8f66\u6d41\u3001\u7a7a\u8c03\u548c\u8fdc\u5904\u8f70\u9e23\u3002',
    image: assetPath('/scenes/ocean-low.webp'),
  },
  forest_breeze: {
    label: '\u68ee\u6797\u8f7b\u98ce',
    description: '\u8f7b\u67d4\u81ea\u7136\u58f0\u9002\u5408\u5b89\u9759\u73af\u5883\u4e0b\u8fdb\u5165\u4e13\u6ce8\u3002',
    image: assetPath('/scenes/forest-breeze.webp'),
  },
  deep_focus: {
    label: '\u6df1\u5ea6\u4e13\u6ce8',
    description: '\u7a33\u5b9a\u8fde\u7eed\u58f0\u573a\u9002\u5408\u957f\u65f6\u95f4\u5b66\u4e60\u548c\u5199\u4f5c\u3002',
    image: assetPath('/scenes/deep-focus.webp'),
  },
};

function SceneParticles({ scene }: { scene: SceneType }) {
  const count = scene === 'rain_focus' ? 46 : scene === 'deep_focus' ? 18 : 14;

  return (
    <div className={`${styles.particles} ${styles[`${scene}Particles`]}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          style={{
            '--i': index,
            '--x': `${(index * 17 + 9) % 100}%`,
            '--y': `${(index * 23 + 7) % 100}%`,
            '--delay': `${index * -0.17}s`,
            '--len': `${10 + (index % 6) * 5}px`,
            '--alpha': `${0.12 + (index % 5) * 0.055}`,
            '--dur': `${2.2 + (index % 7) * 0.34}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function WaveOverlay({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className={`${styles.waveCard} ${isAnalyzing ? styles.waveActive : ''}`}>
      <div className={styles.waveNoise} />
      <div className={styles.waveLines}>
        {Array.from({ length: 22 }).map((_, index) => (
          <span key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
      <div className={styles.waveOrb}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h3l2-5 4 10 2-5h5" />
        </svg>
      </div>
    </div>
  );
}

export function DetectionPanel({ status, onStart, onManualSelect, error, currentScene }: Props) {
  const isIdle = status === 'idle' || status === 'error';
  const isAnalyzing = status === 'requesting' || status === 'analyzing';
  const isDone = status === 'done';
  const scene = currentScene || 'forest_breeze';
  const meta = sceneMeta[scene];

  return (
    <section className={`${styles.hero} ${styles[scene]}`} aria-label={'\u566a\u97f3\u68c0\u6d4b'}>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>AI sound masking</p>
        <h1 className={styles.headline}>
          {'\u7528\u58f0\u97f3\u63a9\u853d\u566a\u97f3'}
          <span>{'\u627e\u56de\u4f60\u7684\u5b81\u9759'}</span>
        </h1>
        <p className={styles.subhead}>
          {'\u672c\u5730\u5206\u6790\u73af\u5883\u58f0\uff0c\u81ea\u52a8\u5339\u914d\u9002\u5408\u4f60\u7684\u4e13\u6ce8\u58f0\u573a\u3002'}
        </p>
      </div>

      <div key={scene} className={styles.sceneStage} aria-hidden="true">
        <div className={styles.stageWipe} />
        <img
          className={styles.sceneImage}
          src={meta.image}
          width="1280"
          height="720"
          decoding="async"
          fetchPriority={scene === 'forest_breeze' ? 'high' : 'auto'}
          alt=""
        />
        <div className={styles.sceneShade} />
        <div className={styles.curtainLeft} />
        <div className={styles.curtainRight} />
        <div className={styles.lightSweep} />
        <div className={styles.sceneLabel}>
          <strong>{meta.label}</strong>
          <span>{meta.description}</span>
        </div>
        <SceneParticles scene={scene} />
        <WaveOverlay isAnalyzing={isAnalyzing} />
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.primaryBtn} ${isAnalyzing ? styles.analyzing : ''}`}
          onClick={onStart}
          disabled={isAnalyzing}
          aria-busy={isAnalyzing}
        >
          {isIdle && '\u5f00\u59cb\u68c0\u6d4b'}
          {isAnalyzing && '\u6b63\u5728\u5206\u6790\u73af\u5883\u58f0'}
          {isDone && '\u91cd\u65b0\u68c0\u6d4b'}
        </button>
        {onManualSelect && (
          <button className={styles.secondaryBtn} onClick={onManualSelect}>
            {'\u624b\u52a8\u9009\u62e9\u58f0\u573a'}
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <span className={styles.errorBannerTitle}>
            {'\u65e0\u6cd5\u8bbf\u95ee\u9ea6\u514b\u98ce'}
          </span>
          <span>
            {'\u4f60\u4ecd\u7136\u53ef\u4ee5\u624b\u52a8\u9009\u62e9\u58f0\u573a\uff0c\u76f4\u63a5\u5f00\u59cb\u63a9\u853d\u3002'}
          </span>
          <span className={styles.errorBannerHint}>
            {'\u5982\u9700\u6d4b\u8bd5\u81ea\u52a8\u8bc6\u522b\uff0c\u8bf7\u5728 Chrome / Edge \u4e2d\u5141\u8bb8\u9ea6\u514b\u98ce\u6743\u9650\u3002'}
          </span>
        </div>
      )}

      <p className={styles.privacy}>
        {'\u4ec5\u672c\u5730\u5206\u6790\uff0c\u4e0d\u5f55\u97f3\u3001\u4e0d\u4fdd\u5b58\u3001\u4e0d\u4e0a\u4f20\u97f3\u9891'}
      </p>
    </section>
  );
}
