import type { CSSProperties } from 'react';
import type { SceneType } from '../types/audio';
import { scenes } from '../data/scenes';
import styles from './SceneSelector.module.css';

interface Props {
  currentScene: SceneType | null;
  recommendedScene: SceneType | null;
  onSelect: (scene: SceneType) => void;
  manualOverride: boolean;
  onRestoreAuto?: () => void;
}

const sceneIcons: Record<SceneType, string> = {
  rain_focus: '\u2614',
  cafe_murmur: '\u2615',
  ocean_low: '\u224b',
  forest_breeze: '\u273f',
  deep_focus: '\u25d0',
};

export function SceneSelector({
  currentScene,
  recommendedScene,
  onSelect,
  manualOverride,
  onRestoreAuto,
}: Props) {
  return (
    <section className={styles.section} data-section="scene-selector" aria-label={'\u58f0\u573a\u9009\u62e9'}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>{'\u9009\u62e9\u4f60\u7684\u58f0\u573a'}</h2>
          {manualOverride && onRestoreAuto && (
            <button className={styles.restoreBtn} onClick={onRestoreAuto}>
              {'\u2190 \u6062\u590d\u81ea\u52a8\u63a8\u8350'}
            </button>
          )}
        </div>
        <span>{'\u667a\u80fd\u63a8\u8350\u53ef\u624b\u52a8\u8986\u76d6'}</span>
      </div>
      <div className={styles.grid} role="listbox" aria-label={'\u9009\u62e9\u63a9\u853d\u58f0\u573a'}>
        {scenes.map((scene) => {
          const isSelected = currentScene === scene.id;
          const isRecommended = recommendedScene === scene.id;

          return (
            <button
              key={scene.id}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
              style={{ '--card-index': scenes.indexOf(scene) } as CSSProperties}
              onClick={() => onSelect(scene.id)}
              role="option"
              aria-selected={isSelected}
            >
              <span className={styles.icon}>{sceneIcons[scene.id]}</span>
              <span className={styles.name}>{scene.name}</span>
              <span className={styles.desc}>{scene.description}</span>
              {isRecommended && <span className={styles.badge}>{'\u63a8\u8350'}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
