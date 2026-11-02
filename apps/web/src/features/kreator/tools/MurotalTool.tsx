import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Send,
  Eye,
  Check,
  Languages,
} from 'lucide-react';
import { useKreatorStudioStore } from '../../../stores/useKreatorStudioStore';

interface AyatItem {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

interface SurahItem {
  id: number;
  name: string;
  arabicName: string;
  totalAyat: number;
  audioUrl: string;
  ayats: AyatItem[];
}

const SURAH_LIST: SurahItem[] = [
  {
    id: 1,
    name: 'Al-Fatihah (Pembukaan)',
    arabicName: 'الفاتحة',
    totalAyat: 7,
    audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
    ayats: [
      {
        number: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: "Bismillaahir-Rahmaanir-Rahiim",
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      },
      {
        number: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: "Al-hamdu lillaahi Rabbil-'aalamiin",
        translation: 'Segala puji bagi Allah, Tuhan seluruh alam,',
      },
      {
        number: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Ar-Rahmaanir-Rahiim',
        translation: 'Yang Maha Pengasih, Maha Penyayang,',
      },
      {
        number: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Maaliki Yawmid-Diin',
        translation: 'Pemilik hari pembalasan.',
      },
      {
        number: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: "Iyyaaka na'budu wa iyyaaka nasta'iin",
        translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.',
      },
      {
        number: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinas-Siraatal-Mustaqiim',
        translation: 'Tunjukilah kami jalan yang lurus,',
      },
      {
        number: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: "Siraatallaziina an'amta 'alaihim ghairil-maghduubi 'alaihim wa lad-daalliin",
        translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
      },
    ],
  },
  {
    id: 112,
    name: 'Al-Ikhlas (Keikhlasan)',
    arabicName: 'الإخلاص',
    totalAyat: 4,
    audioUrl: 'https://server8.mp3quran.net/afs/112.mp3',
    ayats: [
      {
        number: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul huwallahu ahad',
        translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
      },
      {
        number: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: 'Allahus-samad',
        translation: 'Allah tempat meminta segala sesuatu.',
      },
      {
        number: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid wa lam yuulad',
        translation: '(Allah) tidak beranak dan tidak pula diperanakkan,',
      },
      {
        number: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Wa lam yakul lahuu kufuwan ahad',
        translation: 'Dan tidak ada sesuatu yang setara dengan Dia.',
      },
    ],
  },
  {
    id: 113,
    name: 'Al-Falaq (Waktu Subuh)',
    arabicName: 'الفلق',
    totalAyat: 5,
    audioUrl: 'https://server8.mp3quran.net/afs/113.mp3',
    ayats: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: 'Qul a\'uudzu birabbil-falaq',
        translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),',
      },
      {
        number: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min syarri maa khalaq',
        translation: 'dari kejahatan (makhluk yang) Dia ciptakan,',
      },
      {
        number: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: 'Wa min syarri ghaasiqin idzaa waqab',
        translation: 'dan dari kejahatan malam apabila telah gelap gulita,',
      },
      {
        number: 4,
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        transliteration: "Wa min syarrin-naffaatsaati fil-'uqad",
        translation: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),',
      },
      {
        number: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Wa min syarri haasidin idzaa hasad',
        translation: 'dan dari kejahatan orang yang dengki apabila dia dengki."',
      },
    ],
  },
  {
    id: 114,
    name: 'An-Nas (Manusia)',
    arabicName: 'الناس',
    totalAyat: 6,
    audioUrl: 'https://server8.mp3quran.net/afs/114.mp3',
    ayats: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: "Qul a'uudzu birabbin-naas",
        translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,',
      },
      {
        number: 2,
        arabic: 'مَلِكِ النَّاسِ',
        transliteration: 'Malikin-naas',
        translation: 'Raja manusia,',
      },
      {
        number: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        transliteration: 'Ilaahin-naas',
        translation: 'sembahan manusia,',
      },
      {
        number: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transliteration: 'Min syarril-waswaasil-khannaas',
        translation: 'dari kejahatan (bisikan) setan yang bersembunyi,',
      },
      {
        number: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transliteration: 'Alladzii yuwaswisu fii suduurin-naas',
        translation: 'yang membisikkan (kejahatan) ke dalam dada manusia,',
      },
      {
        number: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Minal-jinnati wan-naas',
        translation: 'dari (golongan) jin dan manusia."',
      },
    ],
  },
];

export const MurotalTool: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<SurahItem>(SURAH_LIST[0]);
  const [activeAyatIndex, setActiveAyatIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setActiveTool = useKreatorStudioStore((s) => s.setActiveTool);
  const setSharedAudio = useKreatorStudioStore((s) => s.setSharedAudio);

  // Play/pause handler
  const handleTogglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(selectedSurah.audioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setActiveAyatIndex(0);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = selectedSurah.audioUrl;
      audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleNextAyat = () => {
    if (activeAyatIndex < selectedSurah.ayats.length - 1) {
      setActiveAyatIndex(activeAyatIndex + 1);
    }
  };

  const handlePrevAyat = () => {
    if (activeAyatIndex > 0) {
      setActiveAyatIndex(activeAyatIndex - 1);
    }
  };

  const handleSendToVideoEditor = () => {
    const currentAyat = selectedSurah.ayats[activeAyatIndex];
    setSharedAudio(selectedSurah.audioUrl, `Murotal ${selectedSurah.name}`);
    setActiveTool('video-editor');
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto text-slate-100">
      {/* Left Sidebar: Surah Selector & Options */}
      <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
          <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Pilih Surah Al-Qur'an</span>
          </label>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {SURAH_LIST.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
                  setSelectedSurah(s);
                  setActiveAyatIndex(0);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedSurah.id === s.id
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-950/50 text-slate-300 hover:bg-slate-800/60 border border-white/5'
                }`}
              >
                <div>
                  <div className="font-bold">{s.name}</div>
                  <div className="text-[10px] text-slate-400">{s.totalAyat} Ayat · Qari Alafasy</div>
                </div>
                <span className="font-serif text-sm text-emerald-400 font-bold">{s.arabicName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Display Toggles */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Opsi Tampilan Teks
          </span>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showTransliteration}
              onChange={(e) => setShowTransliteration(e.target.checked)}
              className="accent-emerald-400 rounded"
            />
            <span>Tampilkan Latin / Transliterasi</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="accent-emerald-400 rounded"
            />
            <span>Tampilkan Terjemahan Indonesia</span>
          </label>
        </div>

        {/* Send to Video Editor */}
        <button
          onClick={handleSendToVideoEditor}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 hover:from-emerald-600/50 hover:to-cyan-600/50 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Kirim Ayat ke Video Editor</span>
        </button>
      </div>

      {/* Right Column: Arabic Script Presentation & Audio Player */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Top Player Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`p-2.5 rounded-xl text-slate-950 font-black transition-all shadow-lg active:scale-95 ${
                isPlaying
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
                  : 'bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <div>
              <div className="font-bold text-xs text-slate-200">{selectedSurah.name}</div>
              <div className="text-[10px] text-emerald-400 font-mono">
                Ayat {activeAyatIndex + 1} dari {selectedSurah.totalAyat}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevAyat}
              disabled={activeAyatIndex === 0}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 disabled:opacity-30 border border-white/5"
              title="Ayat Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextAyat}
              disabled={activeAyatIndex === selectedSurah.ayats.length - 1}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 disabled:opacity-30 border border-white/5"
              title="Ayat Berikutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ayat Scrolling List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {selectedSurah.ayats.map((ayat, idx) => (
            <div
              key={ayat.number}
              onClick={() => setActiveAyatIndex(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeAyatIndex === idx
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
                  {ayat.number}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  QS. {selectedSurah.name.split(' ')[0]} : {ayat.number}
                </span>
              </div>

              {/* Arabic Calligraphy Text */}
              <div
                dir="rtl"
                className="font-serif text-xl sm:text-2xl text-right text-emerald-100 leading-loose py-2 select-text"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
              >
                {ayat.arabic}
              </div>

              {/* Transliteration */}
              {showTransliteration && (
                <div className="text-xs text-cyan-300/90 font-sans italic mt-2 leading-relaxed">
                  {ayat.transliteration}
                </div>
              )}

              {/* Indonesian Translation */}
              {showTranslation && (
                <div className="text-xs text-slate-300 mt-1 leading-relaxed border-t border-white/5 pt-2">
                  {ayat.translation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
