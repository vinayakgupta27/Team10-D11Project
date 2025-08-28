import { useState, useEffect } from 'react';
import { CountdownStore } from '../services/CountdownStore';

export const useCountdown = () => {
  const [timeLeft, setTimeLeft] = useState('11h 43m 00s left');

  useEffect(() => {
    const update = () => {
      const ms = CountdownStore.getRemaining();
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
      setTimeLeft(`${hours}h ${pad(minutes)}m ${pad(seconds)}s left`);
    };
    
    update();
    const unsub = CountdownStore.subscribe(update);
    return () => unsub();
  }, []);

  return timeLeft;
};
