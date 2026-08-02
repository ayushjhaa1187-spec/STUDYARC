import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState('4g');
  const [simulatedSlow, setSimulatedSlow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const updateNetworkInfo = () => {
      if (conn) {
        const type = conn.effectiveType || '4g';
        setConnectionType(type);
        const isSlow = type === '2g' || type === 'slow-2g' || conn.saveData || conn.rtt > 300;
        setIsSlowConnection(isSlow);
      }
    };

    updateNetworkInfo();

    if (conn) {
      conn.addEventListener('change', updateNetworkInfo);
      return () => conn.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  // Trigger skeleton loader effect if slow connection OR manually simulated
  const shouldShowSkeleton = isSlowConnection || simulatedSlow || isLoading;

  const triggerSimulatedLoad = (durationMs = 1500) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, durationMs);
  };

  return {
    isSlowConnection: shouldShowSkeleton,
    actualType: connectionType,
    simulatedSlow,
    setSimulatedSlow,
    triggerSimulatedLoad
  };
}
