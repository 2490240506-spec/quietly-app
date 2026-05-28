import styles from './FocusTimer.module.css';

interface Props {
  formattedTime: string;
  duration: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDurationChange: (minutes: number) => void;
}

const durations = [25, 50, 90];

export function FocusTimer({
  formattedTime,
  duration,
  isRunning,
  onStart,
  onPause,
  onReset,
  onDurationChange,
}: Props) {
  return (
    <section className={styles.section} aria-label={'\u4e13\u6ce8\u8ba1\u65f6'}>
      <div>
        <p>{'\u4e13\u6ce8\u8ba1\u65f6'}</p>
        <strong>{formattedTime}</strong>
      </div>
      <div className={styles.controls}>
        <button onClick={isRunning ? onPause : onStart}>
          {isRunning ? '\u6682\u505c' : '\u5f00\u59cb'}
        </button>
        <button onClick={onReset}>{'\u91cd\u7f6e'}</button>
      </div>
      <div className={styles.durations} role="radiogroup" aria-label={'\u4e13\u6ce8\u65f6\u957f'}>
        {durations.map((minutes) => (
          <button
            key={minutes}
            className={duration === minutes ? styles.active : ''}
            onClick={() => onDurationChange(minutes)}
            role="radio"
            aria-checked={duration === minutes}
          >
            {minutes} min
          </button>
        ))}
      </div>
    </section>
  );
}
