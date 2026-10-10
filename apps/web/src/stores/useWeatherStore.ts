import { create } from 'zustand';

export type WeatherType = 'clear' | 'overcast' | 'sunset' | 'night';

interface WeatherState {
  timeOfDay: number; // 0.0 to 24.0 (12.0 = Midday, 18.0 = Sunset, 0.0 = Midnight)
  weather: WeatherType;
  autoCycle: boolean;

  setTimeOfDay: (time: number) => void;
  setWeather: (weather: WeatherType) => void;
  toggleAutoCycle: () => void;
  isNight: () => boolean;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  timeOfDay: 13.5, // Default bright sunny afternoon
  weather: 'clear',
  autoCycle: false,

  setTimeOfDay: (time) => set({ timeOfDay: Math.max(0, Math.min(24, time)) }),
  setWeather: (weather) => set({ weather }),
  toggleAutoCycle: () => set((state) => ({ autoCycle: !state.autoCycle })),
  isNight: () => {
    const t = get().timeOfDay;
    return t < 5.5 || t > 18.5;
  },
}));
