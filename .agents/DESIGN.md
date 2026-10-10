# DESIGN — AUDIRA 3D CONSTRUCTION SIMULATOR

> Design System, Aesthetics, HUD Layout, and UI/UX Standards.  
> **Version:** v1.0.0-modern  
> **Last Updated:** 2026-10-10  
> **Aesthetic Theme:** Dark Modern Studio UI with Cyan/Blue Accents & Precision 3D Viewport  
> **Author & Maintainer:** Agus Dwi Rianto (AUDIRA MDA)  

---

## 1. Design Philosophy

AUDIRA 3D CONSTRUCTION SIMULATOR memadukan ergonomi editor 3D profesional (seperti Blender dan Unreal Engine) dengan keanggunan antarmuka web modern:

1. **Unobtrusive Viewport Focus**: Kanvas 3D adalah panggung utama (*hero surface*). Seluruh elemen UI berada di lapisan transparan (*floating frosted HUD*) agar tidak menghalangi pandangan dunia virtual.
2. **Dark Charcoal Studio Theme**: Palet warna gelap (`#0f172a`, `#1e293b`) memberikan kontras maksimal terhadap objek 3D berwarna-warni dan mengurangi kelelahan mata operator saat mendesain dalam durasi panjang.
3. **Cyan & Electric Blue Accents**: Aksen warna biru/sian (`#38bdf8`, `#0284c7`) memandu mata pengguna ke tool yang sedang aktif, gizmo transform, dan notifikasi snapping.
4. **Micro-Interactions & Snapping Feedback**: Setiap penempatan objek atau aktivasi tool memberikan umpan balik visual instan (outline halus, badge status, transisi halus 200ms).

---

## 2. Color System & Design Tokens

### Surface & Canvas
- **Main Canvas (Background 3D)**: `#090d16` (Deep Space Dark)
- **HUD Panel Surface**: `rgba(15, 23, 42, 0.85)` (`backdrop-blur-md bg-slate-900/85`)
- **Card & Drawer Surface**: `rgba(30, 41, 59, 0.9)` (`bg-slate-800/90`)
- **Elevated Border**: `rgba(255, 255, 255, 0.1)` (`border-slate-700/60`)

### Brand & Interactive Accents
- **Primary Electric Cyan**: `#38bdf8` (`text-sky-400`, `bg-sky-500`) — Tool aktif, seleksi objek, tombol utama
- **Precision Emerald**: `#10b981` (`text-emerald-400`) — Status Snapping aktif (`S`), indikator auto-save sukses
- **Warning Amber**: `#f59e0b` (`text-amber-400`) — Peringatan poligon tinggi, objek terkunci (*locked*)
- **Destructive Rose**: `#f43f5e` (`text-rose-500`) — Tombol hapus objek (`Delete`), konfirmasi reset dunia

---

## 3. Typography Hierarchy

- **Font Family**: Modern sans-serif teknis (Inter, Outfit, system-ui fallback).
- **Header Title**: `text-base font-bold tracking-tight text-white`
- **Panel Heading**: `text-xs font-semibold uppercase tracking-wider text-slate-400`
- **Coordinate Values / Input**: `font-mono text-xs text-sky-300 font-medium`
- **Asset Card Label**: `text-[11px] font-medium text-slate-200 line-clamp-1`
- **Keyboard Shortcut Badges**: `font-mono text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-1 py-0.5 rounded`

---

## 4. Layout Architecture & Component Standards

```
+-----------------------------------------------------------------------------------+
|  [Logo & Title]        [ W:Move | E:Rotate | R:Scale ]     [ Snap:ON | Save | Load ]|
|  (Header Toolbar: Floating Top Bar, h-12, rounded-b-xl, border-b border-slate-800) |
+-----------------------------------------------------------------------------------+
|                                                              |                    |
|                                                              |  Properties Panel  |
|                                                              |  (Sidebar Kanan)   |
|                                                              |  w-72, bg-slate-900|
|                         3D VIEWPORT CANVAS                   |                    |
|                 (Full bleed center interactive area)         |  - Object Info     |
|                                                              |  - Position X/Y/Z  |
|                                                              |  - Rotation X/Y/Z  |
|                                                              |  - Scale X/Y/Z     |
|                                                              |  - Lock & Delete   |
|                                                              |                    |
+--------------------------------------------------------------+--------------------+
|  [Categories: Maps | Vehicles | Tractors | Nature ]  [Search]                     |
|  [ Asset Card 1 ] [ Asset Card 2 ] [ Asset Card 3 ] [ Asset Card 4 ] ...          |
|  (Bottom Asset Drawer: h-40, overflow-x-auto, backdrop-blur-md)                   |
+-----------------------------------------------------------------------------------+
```

### A. Asset Card Component
- Ukuran kartu persegi kompak ($96 \times 96\text{ px}$).
- Pratinjau thumbnail WebP tajam dengan `object-contain`.
- Hover lift halus: `hover:scale-105 hover:border-sky-500 transition-all duration-200`.

### B. Gizmo & Overlay 3D
- Sumbu $X$: Merah (`#ef4444`)
- Sumbu $Y$: Hijau (`#22c55e`) — Ketinggian vertikal ($Y \ge 0$)
- Sumbu $Z$: Biru (`#3b82f6`)
