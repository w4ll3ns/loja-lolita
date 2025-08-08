import { useState, useCallback } from 'react';

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blockedUntil: number | null;
}

export const useRateLimit = (maxAttempts: number = 5, blockDuration: number = 300000) => {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    blockedUntil: null,
  });

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    
    // Se está bloqueado, verificar se o tempo já passou
    if (rateLimitState.blockedUntil && now < rateLimitState.blockedUntil) {
      return {
        allowed: false,
        blockedUntil: rateLimitState.blockedUntil,
        remainingAttempts: 0,
      };
    }

    // Se o tempo de bloqueio passou, resetar
    if (rateLimitState.blockedUntil && now >= rateLimitState.blockedUntil) {
      setRateLimitState({
        attempts: 0,
        lastAttempt: 0,
        blockedUntil: null,
      });
    }

    return {
      allowed: true,
      blockedUntil: null,
      remainingAttempts: maxAttempts - rateLimitState.attempts,
    };
  }, [rateLimitState, maxAttempts]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const newAttempts = rateLimitState.attempts + 1;
    
    if (newAttempts >= maxAttempts) {
      setRateLimitState({
        attempts: newAttempts,
        lastAttempt: now,
        blockedUntil: now + blockDuration,
      });
    } else {
      setRateLimitState({
        attempts: newAttempts,
        lastAttempt: now,
        blockedUntil: null,
      });
    }
  }, [rateLimitState, maxAttempts, blockDuration]);

  const resetRateLimit = useCallback(() => {
    setRateLimitState({
      attempts: 0,
      lastAttempt: 0,
      blockedUntil: null,
    });
  }, []);

  return {
    checkRateLimit,
    recordAttempt,
    resetRateLimit,
  };
};

