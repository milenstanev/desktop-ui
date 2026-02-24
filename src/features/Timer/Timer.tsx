import React, { useState, useEffect, useRef } from 'react';
import styles from './Timer.module.css';

interface TimerProps {
  windowId: string;
  windowName: string;
  lazyLoadReducerName?: string;
}

const Timer: React.FC<TimerProps> = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.timer} data-testid="timer-feature">
      <div className={styles.display} role="timer" aria-live="polite">
        {formatTime(seconds)}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => setRunning(true)}
          disabled={running}
          aria-label="Start timer"
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => setRunning(false)}
          disabled={!running}
          aria-label="Pause timer"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setSeconds(0);
          }}
          aria-label="Reset timer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
