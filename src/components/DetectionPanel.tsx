import type { CSSProperties } from 'react';
import type { AnalyzerStatus, SceneType } from '../types/audio';
import styles from './DetectionPanel.module.css';

interface Props {
  status: AnalyzerStatus;
  onStart: () => void;
  onManualSelect?: () => void;
  error: string | null;
  currentScene: SceneType | null;
}

const sceneTitle: Record<SceneType, string> = {
  rain_focus: '\u96e8\u58f0\u4e13\u6ce8',
  cafe_murmur: '\u5496\u5561\u9986\u4f4e\u8bed',
  ocean_low: '\u6d77\u6d0b\u4f4e\u9891',
  forest_breeze: '\u68ee\u6797\u8f7b\u98ce',
  deep_focus: '\u6df1\u5ea6\u4e13\u6ce8',
};

const sceneNumber: Record<SceneType, string> = {
  rain_focus: '01',
  cafe_murmur: '02',
  ocean_low: '03',
  forest_breeze: '04',
  deep_focus: '05',
};

export function DetectionPanel({ status, onStart, onManualSelect, error, currentScene }: Props) {
  const isIdle = status === 'idle' || status === 'error';
  const isAnalyzing = status === 'requesting' || status === 'analyzing';
  const isDone = status === 'done';
  const sceneClass = currentScene ? styles[currentScene] : styles.forest_breeze;
  const sceneLabel = currentScene ? sceneTitle[currentScene] : '\u5f85\u9009\u62e9\u58f0\u573a';
  const sceneNo = currentScene ? sceneNumber[currentScene] : '00';

  return (
    <section className={`${styles.hero} ${sceneClass}`} aria-label={'\u566a\u97f3\u68c0\u6d4b'}>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>AI sound masking</p>
        <h1 className={styles.headline}>
          {'\u7528\u58f0\u97f3\u63a9\u853d\u566a\u97f3'}
          <span>{'\u627e\u56de\u4f60\u7684\u5b81\u9759'}</span>
        </h1>
        <p className={styles.subhead}>
          {'\u9002\u5408\u529e\u516c\u5ba4\u3001\u56fe\u4e66\u9986\u548c\u81ea\u4e60\u5ba4\u3002\u672c\u5730\u5206\u6790\u73af\u5883\u58f0\uff0c\u7528\u5408\u9002\u7684\u58f0\u573a\u964d\u4f4e\u5e72\u6270\u611f\u3002'}
        </p>
      </div>

      <div key={currentScene || 'empty-scene'} className={styles.illustration} aria-hidden="true">
        <div className={styles.stageWipe} />
        <div className={styles.sceneNumber}>{sceneNo}</div>
        <div className={styles.sceneRibbon}>{sceneLabel}</div>
        <div className={styles.ambientBlob} />
        <div className={styles.sunlight} />
        <div className={styles.window}>
          <div className={styles.sky} />
          <div className={styles.weatherLayer}>
            {Array.from({ length: 16 }).map((_, index) => (
              <span key={index} style={{ '--i': index } as CSSProperties} />
            ))}
          </div>
          <div className={styles.lightBeam} />
          <div className={styles.lightBeamAlt} />
          <div className={`${styles.tree} ${styles.treeOne}`} />
          <div className={`${styles.tree} ${styles.treeTwo}`} />
          <div className={styles.curtain} />
          <div className={styles.windowFrame} />
        </div>
        <div className={styles.desk} />
        <div className={styles.shadowPad} />
        <div className={styles.cup} />
        <div className={styles.steam}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.book} />
        <div className={styles.plant}>
          <b />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.noiseLabel}>{'\u5916\u90e8\u566a\u97f3'}</div>
        <div className={styles.calmLabel}>{'\u63a9\u853d\u540e\u7684\u5b89\u9759\u7a7a\u95f4'}</div>
        <div className={`${styles.waveCard} ${isAnalyzing ? styles.waveActive : ''}`}>
          <span className={styles.noiseWave} />
          <div className={styles.waveLines}>
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} style={{ '--i': index } as CSSProperties} />
            ))}
          </div>
          <div className={styles.waveOrb}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h3l2-5 4 10 2-5h5" />
            </svg>
          </div>
          <span className={styles.calmWave} />
        </div>
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
            {'\u26a0 \u65e0\u6cd5\u8bbf\u95ee\u9ea6\u514b\u98ce'}
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
