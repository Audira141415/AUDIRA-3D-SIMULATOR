import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useEditorStore } from '../../stores/useEditorStore';

export const EnvironmentLighting: React.FC = () => {
  const timeOfDay = useWeatherStore((s) => s.timeOfDay);
  const autoCycle = useWeatherStore((s) => s.autoCycle);
  const setTimeOfDay = useWeatherStore((s) => s.setTimeOfDay);
  const showShadows = useEditorStore((s) => s.showShadows);

  // Auto cycle time if enabled (1 full 24h cycle every 3 minutes)
  useFrame((_, delta) => {
    if (autoCycle) {
      const nextTime = (timeOfDay + (delta / 180) * 24) % 24;
      setTimeOfDay(nextTime);
    }
  });

  const lighting = useMemo(() => {
    // Convert 24h time to sun angle (6:00 = 0 rad sunrise, 12:00 = PI/2 midday, 18:00 = PI sunset)
    const angle = ((timeOfDay - 6) / 12) * Math.PI;
    const isDay = timeOfDay >= 5.5 && timeOfDay <= 18.5;
    const isSunset = (timeOfDay >= 16.5 && timeOfDay <= 18.5) || (timeOfDay >= 5.5 && timeOfDay <= 7.0);

    const sunX = Math.cos(angle) * -50;
    const sunY = Math.sin(angle) * 55;
    const sunZ = Math.cos(angle) * -35;

    let sunColor = '#ffffff';
    let fogColor = '#93c5fd';
    let sunIntensity = 1.8;
    let ambientIntensity = 0.65;
    let hemiSky = '#e0f2fe';
    let hemiGround = '#1e293b';
    let turbidity = 8;
    let rayleigh = 3;

    if (!isDay) {
      // Night Mode
      sunColor = '#60a5fa';
      fogColor = '#060a12';
      sunIntensity = 0.15;
      ambientIntensity = 0.22;
      hemiSky = '#1e293b';
      hemiGround = '#020617';
      turbidity = 20;
      rayleigh = 0.5;
    } else if (isSunset) {
      // Golden Hour / Sunset
      sunColor = '#fb923c';
      fogColor = '#fdba74';
      sunIntensity = 1.4;
      ambientIntensity = 0.5;
      hemiSky = '#fed7aa';
      hemiGround = '#431407';
      turbidity = 12;
      rayleigh = 6;
    }

    return {
      sunPos: [sunX, Math.max(isDay ? 8 : -20, sunY), sunZ] as [number, number, number],
      sunColor,
      sunIntensity,
      ambientIntensity,
      hemiSky,
      hemiGround,
      fogColor,
      turbidity,
      rayleigh,
      isDay,
    };
  }, [timeOfDay]);

  return (
    <>
      {/* Sky & Fog Atmosphere */}
      <Sky
        sunPosition={lighting.sunPos}
        turbidity={lighting.turbidity}
        rayleigh={lighting.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <fog attach="fog" args={[lighting.fogColor, 60, 200]} />

      {/* Ambient & Hemisphere Lighting */}
      <ambientLight intensity={lighting.ambientIntensity} />
      <hemisphereLight
        intensity={lighting.ambientIntensity}
        groundColor={lighting.hemiGround}
        color={lighting.hemiSky}
      />

      {/* Directional Sun Light (or Moon Light at Night) */}
      <directionalLight
        position={lighting.sunPos}
        intensity={lighting.sunIntensity}
        color={lighting.sunColor}
        castShadow={showShadows && lighting.isDay}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={180}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0004}
      />
    </>
  );
};
