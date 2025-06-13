import { useEffect, useRef } from 'react';
import { tsParticles } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';

export default function ParticlesBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    loadFull(tsParticles).then(() => {
      tsParticles.load({
        id: 'tsparticles',
        options: {
          background: { color: '#0f172a' },
          fpsLimit: 60,
          particles: {
            color: { value: '#06bcc1' },
            links: {
              enable: true,
              color: '#06bcc1',
              distance: 120,
              opacity: 0.3, // link line opacity
            },
            move: { enable: true, speed: 2 },
            number: { value: 50 },
            size: { value: 2 },
            opacity: { value: 0.3 }, // 👈 particle opacity
          },
        },
      });
    });
  }, []);

  return (
    <div
      id="tsparticles"
      className="absolute inset-0 -z-10"
      ref={containerRef}
    ></div>
  );
}
