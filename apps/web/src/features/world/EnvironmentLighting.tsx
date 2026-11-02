import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useVisualStyleStore } from '../../stores/useVisualStyleStore';
import { RainParticles } from './RainParticles';

export const EnvironmentLighting: React.FC = () => {
  const timeOfDay = useWeatherStore((s) => s.timeOfDay);
  const autoCycle = useWeatherStore((s) => s.autoCycle);
  const setTimeOfDay = useWeatherStore((s) => s.setTimeOfDay);
  const weather = useWeatherStore((s) => s.weather);
  const showShadows = useEditorStore((s) => s.showShadows);
  const visualFilter = useVisualStyleStore((s) => s.visualFilter);

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

    if (weather === 'rain') {
      // Rain Storm Atmosphere
      sunColor = '#94a3b8';
      fogColor = '#334155';
      sunIntensity = 0.45;
      ambientIntensity = 0.38;
      hemiSky = '#475569';
      hemiGround = '#1e293b';
      turbidity = 24;
      rayleigh = 1.2;
    } else if (!isDay) {
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

    // Atmospheric Visual Studio Filters Override
    if (visualFilter === 'cyberpunk-neon') {
      sunColor = '#00f0ff';
      sunIntensity = 1.6;
      ambientIntensity = 0.85;
      hemiSky = '#06b6d4';
      hemiGround = '#ec4899';
      fogColor = '#08081a';
      turbidity = 16;
      rayleigh = 4;
    } else if (visualFilter === 'golden-sunset') {
      sunColor = '#f59e0b';
      sunIntensity = 1.8;
      ambientIntensity = 0.7;
      hemiSky = '#fed7aa';
      hemiGround = '#7c2d12';
      fogColor = '#fdba74';
      turbidity = 14;
      rayleigh = 7;
    } else if (visualFilter === 'moody-fog') {
      sunColor = '#cbd5e1';
      sunIntensity = 0.45;
      ambientIntensity = 0.4;
      hemiSky = '#64748b';
      hemiGround = '#334155';
      fogColor = '#475569';
      turbidity = 28;
      rayleigh = 0.8;
    } else if (visualFilter === 'retro-sepia') {
      sunColor = '#fef08a';
      sunIntensity = 1.4;
      ambientIntensity = 0.55;
      hemiSky = '#fef3c7';
      hemiGround = '#78350f';
      fogColor = '#b45309';
      turbidity = 12;
      rayleigh = 3.5;
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
  }, [timeOfDay, weather, visualFilter]);

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
      {/* Fog Atmosphere */}
      {weather === 'rain' ? (
        <fog attach="fog" args={['#334155', 180, 1100]} />
      ) : weather === 'overcast' ? (
        <fog attach="fog" args={[lighting.fogColor, 600, 1800]} />
      ) : (
        <fog attach="fog" args={[lighting.fogColor, 2200, 3500]} />
      )}

      {/* 3D Rain Particles & Lightning when Weather is Rain */}
      {weather === 'rain' && <RainParticles />}

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
        shadow-bias={-0.00005}
        shadow-normalBias={0.03}
      />
    </>
  );
};
