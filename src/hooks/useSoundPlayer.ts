import { useRef, useState, useCallback, useEffect } from 'react';
import type { SceneType, PlayerStatus } from '../types/audio';
import { scenes } from '../data/scenes';

export function useSoundPlayer() {
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [currentScene, setCurrentScene] = useState<SceneType | null>(null);
  const [volume, setVolume] = useState(70);
  const [maskingStrength, setMaskingStrength] = useState(62);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  const currentSceneInfo = scenes.find((s) => s.id === currentScene);

  // 计算最终音量：主音量 * 掩蔽强度 / 100
  const getFinalVolume = useCallback(() => {
    return (volume / 100) * (maskingStrength / 100);
  }, [volume, maskingStrength]);

  // 同步音量到 audio 元素
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = getFinalVolume();
    }
  }, [volume, maskingStrength, getFinalVolume]);

  const play = useCallback(async () => {
    if (audioRef.current && currentScene) {
      try {
        await audioRef.current.play();
        setStatus('playing');
      } catch (err) {
        console.error(err);
        setStatus('paused');
      }
    }
  }, [currentScene]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus('paused');
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (status === 'playing') {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  const setScene = useCallback(
    (sceneId: SceneType) => {
      if (sceneId === currentScene) return;

      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;

      // 淡出当前音频
      if (audioRef.current) {
        const audio = audioRef.current;
        const originalVolume = audio.volume;

        // 清除之前的淡入淡出
        if (fadeTimerRef.current) {
          cancelAnimationFrame(fadeTimerRef.current);
        }

        // 渐弱效果
        let startTime: number | null = null;
        const fadeOut = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / 300, 1); // 300ms 渐变
          audio.volume = originalVolume * (1 - progress);

          if (progress < 1) {
            fadeTimerRef.current = requestAnimationFrame(fadeOut);
          } else {
            audio.pause();
            // 切换音频源
            audio.src = scene.audioPath;
            audio.load();
            audio.volume = getFinalVolume();

            // 渐强效果
            if (status === 'playing') {
              audio.play().catch((err) => {
                console.error(err);
                setStatus('paused');
              });
              audio.volume = 0;
              let fadeStart: number | null = null;
              const fadeIn = (ts: number) => {
                if (!fadeStart) fadeStart = ts;
                const p = Math.min((ts - fadeStart) / 300, 1);
                audio.volume = getFinalVolume() * p;
                if (p < 1) {
                  fadeTimerRef.current = requestAnimationFrame(fadeIn);
                }
              };
              fadeTimerRef.current = requestAnimationFrame(fadeIn);
            }
          }
        };
        fadeTimerRef.current = requestAnimationFrame(fadeOut);
      }

      setCurrentScene(sceneId);
    },
    [currentScene, status, getFinalVolume]
  );

  // 清理
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    return () => {
      if (fadeTimerRef.current) {
        cancelAnimationFrame(fadeTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 当 currentScene 首次设置时加载音频
  useEffect(() => {
    if (currentScene && audioRef.current) {
      const scene = scenes.find((s) => s.id === currentScene);
      if (scene) {
        audioRef.current.src = scene.audioPath;
        audioRef.current.load();
      }
    }
  }, [currentScene]);

  return {
    status,
    currentScene,
    currentSceneInfo,
    volume,
    maskingStrength,
    play,
    pause,
    togglePlay,
    setScene,
    setVolume,
    setMaskingStrength,
  } as const;
}
