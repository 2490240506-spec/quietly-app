import { useState, useRef, useCallback, useEffect } from 'react';

export function useFocusTimer() {
  const [duration, setDuration] = useState(25); // 默认 25 分钟
  const [remaining, setRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (remaining <= 0) {
      setRemaining(duration * 60);
    }
    setIsRunning(true);
  }, [duration, remaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(duration * 60);
  }, [duration]);

  const setFocusDuration = useCallback(
    (minutes: number) => {
      setDuration(minutes);
      setRemaining(minutes * 60);
      setIsRunning(false);
    },
    []
  );

  // 计时逻辑
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // 当 duration 改变时重置
  useEffect(() => {
    setRemaining(duration * 60);
    setIsRunning(false);
  }, [duration]);

  const formattedTime = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;

  return {
    duration,
    remaining,
    isRunning,
    formattedTime,
    start,
    pause,
    reset,
    setFocusDuration,
  } as const;
}
