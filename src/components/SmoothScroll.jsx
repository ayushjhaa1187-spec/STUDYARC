import React from 'react';
import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08, // smoothness (lower = smoother)
        duration: 1.2, // animation duration in seconds
        smoothTouch: true, // enable for touch devices
        syncTouch: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
