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

/* ================================================================
   SCENE-SPECIFIC ILLUSTRATION RENDERERS
   ================================================================ */

function RainIllustration({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className={styles.rainScene} aria-hidden="true">
      <div className={styles.rainWindow}>
        <div className={styles.rainSky} />
        {/* rain streaks on glass */}
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={`rd-${i}`} className={styles.rainDrop}
                style={{ '--rx': (i % 5) * 22 + 6, '--ry': -(i * 4.5), '--rs': 0.7 + (i % 4) * 0.25, '--rd': -(i * 0.16) } as CSSProperties} />
        ))}
        {/* foggy window edge */}
        <div className={styles.rainFog} />
        <div className={styles.rainWindowFrame} />
      </div>
      {/* puddle */}
      <div className={styles.rainPuddle}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={`rr-${i}`} style={{ '--ri': i } as CSSProperties} />
        ))}
      </div>
      <div className={styles.rainDesk} />
      <div className={styles.rainMug} />
      <div className={styles.rainSceneLabel}>{'\u96e8\u58f0\u4e13\u6ce8'}</div>
      <div className={`${styles.waveCard} ${isAnalyzing ? styles.waveActive : ''}`}>
        <div className={styles.waveLines}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <div className={styles.waveOrb}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h3l2-5 4 10 2-5h5" /></svg>
        </div>
      </div>
    </div>
  );
}

function CafeIllustration({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className={styles.cafeScene} aria-hidden="true">
      <div className={styles.cafeInterior}>
        <div className={styles.cafeWall} />
        <div className={styles.cafeLamp} />
        <div className={styles.cafeLight} />
        {/* warm floating motes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={`cm-${i}`} className={styles.cafeMote}
                style={{ '--mx': (i * 13 + 5) % 90, '--my': 30 + (i % 6) * 12, '--md': -(i * 0.3) } as CSSProperties} />
        ))}
      </div>
      <div className={styles.cafeTable} />
      <div className={styles.cafeCup}>
        <div className={styles.cafeSteam}>
          <span /><span /><span />
        </div>
      </div>
      <div className={styles.cafeBook} />
      <div className={styles.cafeSceneLabel}>{'\u5496\u5561\u9986\u4f4e\u8bed'}</div>
      <div className={`${styles.waveCard} ${isAnalyzing ? styles.waveActive : ''}`}>
        <div className={styles.waveLines}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <div className={styles.waveOrb}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h3l2-5 4 10 2-5h5" /></svg>
        </div>
      </div>
    </div>
  );
}

function OceanIllustration({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className={styles.oceanScene} aria-hidden="true">
      <div className={styles.oceanView}>
        <div className={styles.oceanSky} />
        <div className={styles.oceanHorizon} />
        {/* waves */}
        <div className={styles.oceanWaveBack} />
        <div className={styles.oceanWaveMid} />
        <div className={styles.oceanWaveFront} />
        {/* light shimmer on water */}
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={`os-${i}`} className={styles.oceanShimmer}
                style={{ '--sx': 10 + (i * 11), '--sy': 60 + (i % 4) * 8, '--sd': i * 0.4 } as CSSProperties} />
        ))}
      </div>
      <div className={styles.oceanSceneLabel}>{'\u6d77\u6d0b\u4f4e\u9891'}</div>
      <div className={`${styles.waveCard} ${isAnalyzing ? styles.waveActive : ''}`}>
        <div className={styles.waveLines}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <div className={styles.waveOrb}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h3l2-5 4 10 2-5h5" /></svg>
        </div>
      </div>
    </div>
  );
}

function ForestIllustration({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className={styles.forestScene} aria-hidden="true">
      <div className={styles.forestGlade}>
        <div className={styles.forestSky} />
        <div className={styles.forestSun} />
        {/* trees */}
        <div className={`${styles.forestTree} ${styles.forestTreeLeft}`}>
          <div className={styles.forestTrunk} />
          <div className={styles.forestCanopy} />
        </div>
        <div className={`${styles.forestTree} ${styles.forestTreeRight}`}>
          <div className={styles.forestTrunk} />
          <div className={styles.forestCanopy} />
        </div>
        {/* floating leaves */}
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={`fl-${i}`} className={styles.forestLeaf}
                style={{ '--lx': (i * 8 + 2) % 90, '--ly': 10 + (i % 7) * 10, '--ld': -(i * 0.5) } as CSSProperties} />
        ))}
        <div className={styles.forestGround} />
      </div>
      <div className={styles.forestSceneLabel}>{'\u68ee\u6797\u8f7b\u98ce'}</div>
      <div className={`${styles.waveCard} ${isAnalyzing ? styles.waveActive : ''}`}>
        <div className={styles.waveLines}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <div className={styles.waveOrb}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h3l2-5 4 10 2-5h5" /></svg>
        </div>
      </div>
    </div>
  );
}

function DeepFocusIllustration({ isAnalyzing }: { isAnalyzing: boolean }) {
  return (
    <div className={styles.deepScene} aria-hidden="true">
      <div className={styles.deepRoom}>
        <div className={styles.deepWall} />
        <div className={styles.deepGlow} />
        {/* subtle pulse rings */}
        <div className={styles.deepRing1} />
        <div className={styles.deepRing2} />
        <div className={styles.deepDesk} />
        <div className={styles.deepLamp} />
      </div>
      <div className={styles.deepSceneLabel}>{'\u6df1\u5ea6\u4e13\u6ce8'}</div>
      <div className={`${styles.waveCard} ${isAnalyzing ? styles.waveActive : ''}`}>
        <div className={styles.waveLines}>
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <div className={styles.waveOrb}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h3l2-5 4 10 2-5h5" /></svg>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function DetectionPanel({ status, onStart, onManualSelect, error, currentScene }: Props) {
  const isIdle = status === 'idle' || status === 'error';
  const isAnalyzing = status === 'requesting' || status === 'analyzing';
  const isDone = status === 'done';
  const sceneClass = currentScene ? styles[currentScene] : styles.forest_breeze;

  const renderIllustration = () => {
    switch (currentScene) {
      case 'rain_focus': return <RainIllustration isAnalyzing={isAnalyzing} />;
      case 'cafe_murmur': return <CafeIllustration isAnalyzing={isAnalyzing} />;
      case 'ocean_low': return <OceanIllustration isAnalyzing={isAnalyzing} />;
      case 'forest_breeze': return <ForestIllustration isAnalyzing={isAnalyzing} />;
      case 'deep_focus': return <DeepFocusIllustration isAnalyzing={isAnalyzing} />;
      default: return <ForestIllustration isAnalyzing={isAnalyzing} />;
    }
  };

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

      <div key={currentScene || 'empty'} className={styles.illustration} aria-hidden="true">
        <div className={styles.stageWipe} />
        {renderIllustration()}
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
