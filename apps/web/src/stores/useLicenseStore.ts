import { create } from 'zustand';

interface LicenseState {
  isLicensed: boolean;
  licenseKey: string;
  licenseType: 'free' | 'creator' | 'commercial';
  deviceId: string;
  isModalOpen: boolean;
  expiresAt: string | null;

  setModalOpen: (open: boolean) => void;
  activateLicense: (key: string) => { success: boolean; message: string };
  deactivateLicense: () => void;
}

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'AUD-DEV-0000';
  let id = localStorage.getItem('audira_device_id');
  if (!id) {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    id = `AUD-PC-${rand}`;
    localStorage.setItem('audira_device_id', id);
  }
  return id;
}

export const useLicenseStore = create<LicenseState>((set, get) => {
  const deviceId = getOrCreateDeviceId();
  const savedKey = typeof window !== 'undefined' ? localStorage.getItem('audira_license_key') || '' : '';
  const isLicensed = !!savedKey;

  return {
    isLicensed,
    licenseKey: savedKey,
    licenseType: isLicensed ? 'commercial' : 'free',
    deviceId,
    isModalOpen: false,
    expiresAt: isLicensed ? 'Permanent / Lifetime' : null,

    setModalOpen: (open) => set({ isModalOpen: open }),

    activateLicense: (inputKey: string) => {
      const cleanKey = inputKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

      // Accept any 6-character key or standard keys like AUD999, VIP777, SUMPAH, etc.
      if (cleanKey.length < 6) {
        return { success: false, message: 'Kunci lisensi harus minimal 6 karakter alfanumerik.' };
      }

      localStorage.setItem('audira_license_key', cleanKey);
      set({
        isLicensed: true,
        licenseKey: cleanKey,
        licenseType: 'commercial',
        expiresAt: 'Permanent / Lifetime (VIP Creator)',
      });

      return { success: true, message: 'Selamat! Lisensi VIP Creator AUDIRA berhasil diaktifkan.' };
    },

    deactivateLicense: () => {
      localStorage.removeItem('audira_license_key');
      set({
        isLicensed: false,
        licenseKey: '',
        licenseType: 'free',
        expiresAt: null,
      });
    },
  };
});

