import { useState, useEffect, useRef } from 'react';

/**
 * High-performance drift-corrected clock hook.
 * Uses requestAnimationFrame for silky smooth 60fps analog sweep if requested,
 * and a 1000ms heartbeat for digital updates without unnecessary heavy re-renders.
 */
export function useRealTime(enableSmoothSweep = true) {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [smoothTime, setSmoothTime] = useState(() => {
    const d = new Date();
    return {
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: d.getSeconds(),
      milliseconds: d.getMilliseconds(),
      sweepSeconds: d.getSeconds() + d.getMilliseconds() / 1000,
    };
  });

  const animFrameRef = useRef(null);

  // 1-second interval for standard digital time & alarm evaluations
  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date());
    };
    
    // Sync with top of the second for precision
    const now = Date.now();
    const delay = 1000 - (now % 1000);
    let intervalId;

    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 1000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // RequestAnimationFrame for analog clock smooth sweep
  useEffect(() => {
    if (!enableSmoothSweep) {
      return;
    }

    let isMounted = true;

    const loop = () => {
      if (!isMounted) return;
      const d = new Date();
      const ms = d.getMilliseconds();
      const sec = d.getSeconds();
      const min = d.getMinutes();
      const hr = d.getHours();

      setSmoothTime({
        hours: hr,
        minutes: min,
        seconds: sec,
        milliseconds: ms,
        sweepSeconds: sec + ms / 1000,
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enableSmoothSweep]);

  return {
    currentTime,
    smoothTime,
  };
}
