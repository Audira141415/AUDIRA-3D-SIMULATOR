import { WorldSaveData } from '@audira/shared';

export function exportWorldToJSON(data: WorldSaveData) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.world.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function saveWorldToLocalStorage(data: WorldSaveData) {
  localStorage.setItem('audira_world_save', JSON.stringify(data));
}

export function loadWorldFromLocalStorage(): WorldSaveData | null {
  const item = localStorage.getItem('audira_world_save');
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error('Failed to parse saved world data:', e);
    return null;
  }
}
