import type { NoiseType, SceneType } from '../types/audio';
import { getNoiseTypeLabel } from '../data/noiseTypes';
import { scenes } from '../data/scenes';
import styles from './NoiseStatusCard.module.css';

interface Props {
  noiseType: NoiseType | null;
  intensity: number;
  recommendedScene: SceneType | null;
  detected: boolean;
}

export function NoiseStatusCard({ noiseType, intensity, recommendedScene, detected }: Props) {
  const sceneLabel = scenes.find((scene) => scene.id === recommendedScene)?.name || '--';

  return (
    <section className={styles.section} aria-label={'\u73af\u5883\u68c0\u6d4b\u7ed3\u679c'}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{'\u5f53\u524d\u73af\u5883'}</p>
          <h2>{detected ? '\u6b63\u5728\u7a33\u5b9a\u8bc6\u522b' : '\u7b49\u5f85\u68c0\u6d4b'}</h2>
        </div>
        <span className={`${styles.statusPill} ${detected ? styles.active : ''}`}>
          {detected ? '\u8fd0\u884c\u4e2d' : '\u5f85\u542f\u52a8'}
        </span>
      </div>

      <div className={styles.result}>
        <div className={styles.primaryMetric}>
          <span>{noiseType ? getNoiseTypeLabel(noiseType) : '\u672a\u68c0\u6d4b'}</span>
          <small>{'\u4e3b\u8981\u566a\u97f3\u7c7b\u578b'}</small>
        </div>
        <div className={styles.intensityRing} style={{ '--level': `${intensity}%` } as React.CSSProperties}>
          <span>{intensity}</span>
          <small>%</small>
        </div>
      </div>

      <div className={styles.recommendation}>
        <span>{'\u63a8\u8350\u58f0\u573a'}</span>
        <strong>{sceneLabel}</strong>
      </div>

      <div className={styles.intensityTrack} aria-hidden="true">
        <div className={styles.intensityFill} style={{ width: `${intensity}%` }} />
      </div>
    </section>
  );
}
