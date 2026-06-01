import { useCallback, useEffect, useRef, useState } from 'react';
import { DetectionPanel } from './DetectionPanel';
import { FocusTimer } from './FocusTimer';
import { Header } from './Header';
import { NoiseStatusCard } from './NoiseStatusCard';
import { PlayerControls } from './PlayerControls';
import { PrincipleCard } from './PrincipleCard';
import { SceneSelector } from './SceneSelector';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import { useFocusTimer } from '../hooks/useFocusTimer';
import { useSoundPlayer } from '../hooks/useSoundPlayer';
import { getRecommendedScene } from '../lib/recommendations';
import type { SceneType } from '../types/audio';

const AUTO_SCENE_COOLDOWN_MS = 30000;
const AUTO_SCENE_CONFIRM_MS = 6500;
const QUIET_SCENE_CONFIRM_MS = 16000;
const SPEECH_SCENE_CONFIRM_MS = 2600;

export function AppShell() {
  const analyzer = useAudioAnalyzer();
  const player = useSoundPlayer();
  const timer = useFocusTimer();
  const [manualOverride, setManualOverride] = useState(false);
  const lastAutoSceneAtRef = useRef(0);
  const [startupDone, setStartupDone] = useState(false);
  const [sceneFlashing, setSceneFlashing] = useState(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingSceneRef = useRef<SceneType | null>(null);
  const pendingSceneSinceRef = useRef(0);

  useEffect(() => {
    const timerId = setTimeout(() => setStartupDone(true), 2100);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('.scroll-reveal'));

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [startupDone]);

  const triggerSceneFlash = useCallback(() => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    setSceneFlashing(true);
    flashTimerRef.current = setTimeout(() => setSceneFlashing(false), 360);
  }, []);

  const recommendedScene = analyzer.noiseType
    ? getRecommendedScene(analyzer.noiseType)
    : null;
  const sceneClass = player.currentScene ? `theme-${player.currentScene}` : 'theme-forest_breeze';

  useEffect(() => {
    if (
      analyzer.status !== 'done' ||
      !analyzer.noiseType ||
      !recommendedScene ||
      manualOverride
    ) {
      return;
    }

    const now = Date.now();

    if (!player.currentScene) {
      lastAutoSceneAtRef.current = now;
      triggerSceneFlash();
      player.setScene(recommendedScene);
      pendingSceneRef.current = null;
      pendingSceneSinceRef.current = 0;
    } else if (player.currentScene !== recommendedScene) {
      const currentPendingChanged = pendingSceneRef.current !== recommendedScene;

      if (currentPendingChanged) {
        pendingSceneRef.current = recommendedScene;
        pendingSceneSinceRef.current = now;
      }

      const confirmMs =
        analyzer.noiseType === 'quiet'
          ? QUIET_SCENE_CONFIRM_MS
          : analyzer.noiseType === 'speech'
            ? SPEECH_SCENE_CONFIRM_MS
            : AUTO_SCENE_CONFIRM_MS;
      const pendingStableMs = now - pendingSceneSinceRef.current;
      const cooldownPassed = now - lastAutoSceneAtRef.current > AUTO_SCENE_COOLDOWN_MS;
      const quietIsReallyQuiet = analyzer.noiseType !== 'quiet' || analyzer.intensity <= 18;
      const canAutoSwitch = pendingStableMs >= confirmMs && cooldownPassed && quietIsReallyQuiet;

      if (canAutoSwitch) {
        lastAutoSceneAtRef.current = now;
        pendingSceneRef.current = null;
        pendingSceneSinceRef.current = 0;
        triggerSceneFlash();
        player.setScene(recommendedScene);
      }
    } else {
      pendingSceneRef.current = null;
      pendingSceneSinceRef.current = 0;
    }

    if (player.status !== 'playing') {
      const timeout = window.setTimeout(() => player.play(), 650);
      return () => window.clearTimeout(timeout);
    }
  }, [
    analyzer.status,
    analyzer.noiseType,
    analyzer.intensity,
    recommendedScene,
    manualOverride,
    player.currentScene,
    player.status,
    player.setScene,
    player.play,
    triggerSceneFlash,
  ]);

  const handleManualSelect = () => {
    const element = document.querySelector('[data-section="scene-selector"]');
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleStartDetection = () => {
    setManualOverride(false);
    analyzer.start();
  };

  const handleSceneSelect = (scene: SceneType) => {
    setManualOverride(true);
    triggerSceneFlash();
    player.setScene(scene);
  };

  const handleRestoreAuto = () => {
    setManualOverride(false);
    if (recommendedScene && player.currentScene !== recommendedScene) {
      triggerSceneFlash();
      player.setScene(recommendedScene);
    }
  };

  return (
    <div className={`phone-stage ${sceneClass}`}>
      {!startupDone && (
        <div className="startup-overlay" aria-hidden="true">
          <div className="startup-overlay-brand">
            <div className="startup-overlay-mark">
              <div className="startup-overlay-bars">
                <span />
                <span />
                <span />
              </div>
            </div>
            <span className="startup-overlay-wordmark">Quietly</span>
          </div>
        </div>
      )}

      <div className={`scene-transition-flash${sceneFlashing ? ' active' : ''}`}
           aria-hidden="true" />

      <div className="app-shell">
        <Header />
        <main className="app-main">
          <section className="scroll-reveal">
            <DetectionPanel
              status={analyzer.status}
              onStart={handleStartDetection}
              onManualSelect={handleManualSelect}
              error={analyzer.error}
              currentScene={player.currentScene}
            />
          </section>
          <section className="scroll-reveal">
            <NoiseStatusCard
              noiseType={analyzer.noiseType}
              intensity={analyzer.intensity}
              recommendedScene={recommendedScene}
              detected={analyzer.status === 'done'}
            />
          </section>
          <section className="scroll-reveal">
            <SceneSelector
              currentScene={player.currentScene}
              recommendedScene={recommendedScene}
              onSelect={handleSceneSelect}
              manualOverride={manualOverride}
              onRestoreAuto={recommendedScene ? handleRestoreAuto : undefined}
            />
          </section>
          <section className="scroll-reveal">
            <PlayerControls
              status={player.status}
              maskingStrength={player.maskingStrength}
              volume={player.volume}
              onTogglePlay={player.togglePlay}
              onMaskingStrengthChange={player.setMaskingStrength}
              onVolumeChange={player.setVolume}
              currentSceneName={player.currentSceneInfo?.name}
            />
          </section>
          <section className="scroll-reveal">
            <FocusTimer
              formattedTime={timer.formattedTime}
              duration={timer.duration}
              isRunning={timer.isRunning}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={timer.reset}
              onDurationChange={timer.setFocusDuration}
            />
          </section>
          <section className="scroll-reveal">
            <PrincipleCard />
          </section>
        </main>
      </div>
    </div>
  );
}
