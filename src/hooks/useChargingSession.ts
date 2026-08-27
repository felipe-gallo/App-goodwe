import { useEffect, useState } from 'react';
import { chargingConfig, chargingPlans } from '../constants/theme';
import type { ChargingPlan } from '../types';

export type SessionState = {
  battery: number;
  remainingMinutes: number;
  elapsedSeconds: number;
  energyKwh: number;
  status: 'starting' | 'charging' | 'completed' | 'stopped';
};

export const sessionAt = (
  seconds: number,
  powerKw: number,
  plan: ChargingPlan = 'fast',
): SessionState => {
  const selectedPlan = chargingPlans[plan];
  const progress = Math.min(
    1,
    Math.max(0, seconds / selectedPlan.durationSeconds),
  );
  return {
    battery: Math.round(
      chargingConfig.initialBattery +
        (selectedPlan.targetBattery - chargingConfig.initialBattery) * progress,
    ),
    remainingMinutes: Math.max(
      0,
      Math.round(selectedPlan.estimatedMinutes * (1 - progress)),
    ),
    elapsedSeconds: Math.min(seconds, selectedPlan.durationSeconds),
    energyKwh: Number((powerKw * (seconds / 3600) * 30).toFixed(2)),
    status:
      seconds === 0 ? 'starting' : progress >= 1 ? 'completed' : 'charging',
  };
};

export function useChargingSession(
  powerKw: number,
  plan: ChargingPlan,
  onComplete: (state: SessionState) => void,
) {
  const [state, setState] = useState(() => sessionAt(0, powerKw, plan));
  useEffect(() => {
    const started = Date.now();
    const interval = setInterval(() => {
      const next = sessionAt(
        Math.floor((Date.now() - started) / 1000),
        powerKw,
        plan,
      );
      setState(next);
      if (next.status === 'completed') {
        clearInterval(interval);
        onComplete(next);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [onComplete, plan, powerKw]);
  return {
    state,
    stop: () => setState(value => ({ ...value, status: 'stopped' })),
  };
}
