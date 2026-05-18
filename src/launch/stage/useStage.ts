import { useCallback, useEffect, useState } from 'react';
import { getStage, type Stage, type StageData } from './stages';

const KEY = 'myrhythm_launch_stage';
const ENGAGED_KEY = 'myrhythm_launch_stage_engaged';
const DEFAULT_STAGE: Stage = 'steady';

function read(): Stage {
  if (typeof window === 'undefined') return DEFAULT_STAGE;
  try {
    const v = localStorage.getItem(KEY);
    if (v && ['pause', 'ready', 'steady', 'strengthen', 'stretch', 'return', 'sustain'].includes(v)) {
      return v as Stage;
    }
  } catch { /* noop */ }
  return DEFAULT_STAGE;
}

function readEngaged(): boolean {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem(ENGAGED_KEY) === '1'; } catch { return false; }
}

export interface UseStageReturn {
  stage: Stage;
  stageData: StageData;
  setStage: (next: Stage) => void;
  isPause: boolean;
  /** True once the user has opened or used the picker at least once. */
  hasEngaged: boolean;
  markEngaged: () => void;
}

export function useStage(): UseStageReturn {
  const [stage, setStageState] = useState<Stage>(() => read());
  const [hasEngaged, setHasEngaged] = useState<boolean>(() => readEngaged());

  useEffect(() => {
    const onStorage = () => {
      setStageState(read());
      setHasEngaged(readEngaged());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setStage = useCallback((next: Stage) => {
    try { localStorage.setItem(KEY, next); } catch { /* noop */ }
    setStageState(next);
  }, []);

  const markEngaged = useCallback(() => {
    try { localStorage.setItem(ENGAGED_KEY, '1'); } catch { /* noop */ }
    setHasEngaged(true);
  }, []);

  return {
    stage,
    stageData: getStage(stage),
    setStage,
    isPause: stage === 'pause',
    hasEngaged,
    markEngaged,
  };
}
