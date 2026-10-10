# ASSET & SIMULATION MATRIX — AUDIRA 3D CONSTRUCTION SIMULATOR
> **Complete Registry of 52 GLB Models, Thumbnails, Dimensions, and Ground Alignment Factors**  
> *Single Source of Truth untuk Seluruh Asset 3D Biner Resmi di Ekosistem Simulator.*

---

## 1. Aturan Normalisasi Matriks Asset

Setiap model dalam matriks ini mematuhi standar geometri berikut:
- **Ground Alignment**: Bounding box dihitung secara dinamis:
  ```typescript
  const box = new THREE.Box3().setFromObject(clonedScene);
  const bottomY = box.min.y;
  clonedScene.position.y = -bottomY; // Menjamin alas tepat di y = 0
  ```
- **Thumbnail**: Setiap asset memiliki thumbnail representasi format WebP resolusi tajam di `/thumbs/`.
- **Lokasi Model**: Berkas biner disimpan di direktori `apps/web/public/models/`.

---

## 2. Matriks Koleksi Asset Lengkap (52 Model GLB)

### A. Peta & Prefab Maps (3 Model GLB)

| Asset ID | Nama Display | Path Model GLB | Path Thumbnail WebP | Kategori | Fitur Khusus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `map-pirate-island` | Pulau Petualangan Bajak Laut | `/models/pirate-adventure-map.glb` | `/thumbs/pirate-adventure-map.webp` | maps | Prefab terrain pulau tropis |
| `map-taiwan` | Kota Pegunungan Taiwan | `/models/taiwan-map.glb` | `/thumbs/taiwan-map.webp` | maps | Kontur elevasi jalan berbukit |
| `map-tram-station` | Stasiun Trem Modern | `/models/tram-station-map.glb` | `/thumbs/tram-station-map.webp` | maps | Area stasiun rel trem modular |

---

### B. Mobil, Truk & Kendaraan Kota (13 Model GLB)

| Asset ID | Nama Display | Path Model GLB | Path Thumbnail WebP | Kategori | Jenis Kendaraan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `veh-mcqueen` | Lightning McQueen | `/models/lightning-mcqueen.glb` | `/thumbs/lightning-mcqueen.webp` | vehicles | Mobil Balap Ikonik |
| `veh-tokyo-mater` | Tokyo Mater Truk Derek | `/models/tokyo-mater.glb` | `/thumbs/tokyo-mater.webp` | vehicles | Truk Derek / Tow Truck |
| `veh-supra` | Toyota Supra GT Sport | `/models/toyota-supra.glb` | `/thumbs/toyota-supra.webp` | vehicles | Sports Car |
| `veh-lambo` | Lamborghini Fenomeno Hyper | `/models/lamborghini-fenomeno.glb` | `/thumbs/lamborghini-fenomeno.webp` | vehicles | Hypercar |
| `veh-mclaren` | McLaren W1 Track Monster | `/models/mclaren-w1.glb` | `/thumbs/mclaren-w1.webp` | vehicles | Supercar Sirkuit |
| `veh-volvo-c30` | Volvo C30 Sport Hatchback | `/models/volvo-c30.glb` | `/thumbs/volvo-c30.webp` | vehicles | Mobil Kota / Hatchback |
| `veh-police-glb` | Polisi Patroli Interceptor | `/models/police-car.glb` | `/thumbs/police-car.webp` | vehicles | Kendaraan Dinas Polisi |
| `veh-passenger-pack`| Pack Mobil Penumpang Kota | `/models/passenger-car-pack.glb` | `/thumbs/passenger-car-pack.webp` | vehicles | Kumpulan Multi-Mobil |
| `veh-traffic-pack` | Pack Kendaraan Lalu Lintas | `/models/traffic-vehicles.glb` | `/thumbs/traffic-vehicles.webp` | vehicles | Multi-Kendaraan Jalan Raya |
| `veh-toy-car` | Mobil Mainan Toy Car | `/models/ToyCar.glb` | `/thumbs/ToyCar.webp` | vehicles | Mobil Stylized Mini |
| `veh-scania-heavy` | Scania R440 Heavy Duty | `/models/scania.glb` | `/thumbs/scania.webp` | vehicles | Truk Kontainer Berat |
| `veh-scania-r440` | Scania Hauler R440 | `/models/scania-r440.glb` | `/thumbs/scania-r440.webp` | vehicles | Truk Hauler Muatan |
| `veh-scania-bus` | Bus Scania Pariwisata | `/models/scania-bus-pack.glb` | `/thumbs/scania-bus-pack.webp` | vehicles | Bus Angkutan Penumpang |

---

### C. Pesawat Terbang & Dirgantara (2 Model GLB)

| Asset ID | Nama Display | Path Model GLB | Path Thumbnail WebP | Kategori | Klasifikasi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `air-airport-plane` | Pesawat Penumpang Bandara | `/models/airport-airplane.glb` | `/thumbs/airport-airplane.webp` | aircraft | Jet Komersial |
| `air-light-aircraft` | Pesawat Baling-Baling Cessna | `/models/light-aircraft.glb` | `/thumbs/light-aircraft.webp` | aircraft | Pesawat Ringan Propeller |

---

### D. Traktor Pertanian & Alat Berat (7 Model GLB)

| Asset ID | Nama Display | Path Model GLB | Path Thumbnail WebP | Kategori | Fitur Alat Berat |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `trac-farm-pack` | Pack Traktor Modern | `/models/farm-tractors.glb` | `/thumbs/farm-tractors.webp` | tractors | Traktor Agrikultur Modern |
| `trac-mtz80-lp` | MTZ-80 Belarus Sawah | `/models/tractor-mtz80-lowpoly.glb` | `/thumbs/tractor-mtz80-lowpoly.webp` | tractors | Traktor Roda Agrikultur |
| `trac-mtz80-heavy`| MTZ-80 Heavy Duty | `/models/tractor-mtz80.glb` | `/thumbs/tractor-mtz80.webp` | tractors | Traktor Baja Industri |
| `trac-dt75` | Traktor Rantai DT-75 Crawler | `/models/tractor-dt75.glb` | `/thumbs/tractor-dt75.webp` | tractors | Traktor Rantai Bulldozer |
| `trac-hcr2` | Traktor Hill Climb HCR2 | `/models/tractor-hcr2.glb` | `/thumbs/tractor-hcr2.webp` | tractors | Traktor Offroad Climbing |
| `trac-david-brown`| David Brown 25D Classic | `/models/tractor-david-brown.glb` | `/thumbs/tractor-david-brown.webp` | tractors | Traktor Antik Vintage |
| `trac-work-field` | Traktor Ladang Serbaguna | `/models/tractor-tracktor.glb` | `/thumbs/tractor-tracktor.webp` | tractors | Traktor Kerja Multifungsi |

---

### E. Dekorasi, Wahana Taman & Bangunan (27 Model GLB)

| Asset ID | Nama Display | Path Model GLB | Path Thumbnail WebP | Kategori |
| :--- | :--- | :--- | :--- | :--- |
| `dec-wahana-slide` | Menara Seluncuran Taman | `/models/slide-playground.glb` | `/thumbs/slide-playground.webp` | decoration |
| `dec-ball-pool` | Kolam Mandi Bola 3D | `/models/ball-ball-pool.glb` | `/thumbs/ball-ball-pool.webp` | decoration |
| `dec-ball-arch` | Gapura Balon Karnaval | `/models/ball-balloon-arch.glb` | `/thumbs/ball-balloon-arch.webp` | decoration |
| `dec-ball-balloons`| Balon Udara Warna-Warni | `/models/ball-colorful-balloons.glb` | `/thumbs/ball-colorful-balloons.webp` | decoration |
| `dec-ball-fountain`| Air Mancur Bola Atraksi | `/models/ball-fountain-with-balls.glb` | `/thumbs/ball-fountain-with-balls.webp` | decoration |
| `dec-ball-track` | Jalur Sirkuit Bola Melingkar | `/models/ball-track.glb` | `/thumbs/ball-track.webp` | decoration |
| `dec-ball-pit` | Kolam Pasir Bola Bermain | `/models/ballpit.glb` | `/thumbs/ballpit.webp` | decoration |
| `dec-house-glb` | Rumah Hunian Suburban | `/models/building-house.glb` | `/thumbs/building-house.webp` | decoration |
| `dec-fence-glb` | Pagar Kayu Pembatas 3D | `/models/fence.glb` | `/thumbs/fence.webp` | decoration |
| `dec-bench-glb` | Kursi Santai Taman Kota | `/models/park-bench.glb` | `/thumbs/park-bench.webp` | decoration |
| `dec-lamp-glb` | Tiang Lampu Jalan Klasik | `/models/street-lamp.glb` | `/thumbs/street-lamp.webp` | decoration |
| `dec-rock-glb` | Formasi Batu Alam Karang | `/models/rock-boulder.glb` | `/thumbs/rock-boulder.webp` | nature |
| `dec-tree-pine` | Pohon Pinus Hutan Tropis | `/models/tree-pine.glb` | `/thumbs/tree-pine.webp` | nature |
| `dec-tree-oak` | Pohon Rimbun Stylized | `/models/tree-oak.glb` | `/thumbs/tree-oak.webp` | nature |
| `dec-barrel-glb` | Tong Minyak & Kimia Drum | `/models/industrial-barrel.glb` | `/thumbs/industrial-barrel.webp` | decoration |
| `dec-crate-glb` | Peti Kemas Kayu Cargo | `/models/wooden-crate.glb` | `/thumbs/wooden-crate.webp` | decoration |
| `dec-barrier-glb` | Pembatas Proyek Konstruksi | `/models/traffic-barrier.glb` | `/thumbs/traffic-barrier.webp` | decoration |
| `dec-traffic-cone`| Kerucut Lalu Lintas Oranye | `/models/traffic-cone.glb` | `/thumbs/traffic-cone.webp` | decoration |
| `dec-road-straight`| Segmen Jalan Aspal Lurus | `/models/road-straight.glb` | `/thumbs/road-straight.webp` | decoration |
| `dec-road-corner` | Segmen Tikungan Jalan 90° | `/models/road-corner.glb` | `/thumbs/road-corner.webp` | decoration |
| `dec-road-t` | Persimpangan Jalan Pertigaan | `/models/road-t-junction.glb` | `/thumbs/road-t-junction.webp` | decoration |
| `dec-road-cross` | Persimpangan Jalan Perempatan | `/models/road-crossroad.glb` | `/thumbs/road-crossroad.webp` | decoration |
| `dec-excavator-arm`| Lengan Excavator Hidrolik | `/models/excavator-arm.glb` | `/thumbs/excavator-arm.webp` | decoration |
| `dec-generator` | Generator Listrik Proyek | `/models/diesel-generator.glb` | `/thumbs/diesel-generator.webp` | decoration |
| `dec-scaffolding` | Perancah Konstruksi Besi | `/models/construction-scaffold.glb` | `/thumbs/construction-scaffold.webp` | decoration |
| `dec-wheelbarrow` | Gerobak Sorong Pasir Semen | `/models/wheelbarrow.glb` | `/thumbs/wheelbarrow.webp` | decoration |
| `dec-sign-work` | Rambu Proyek 'Men In Work' | `/models/sign-construction.glb` | `/thumbs/sign-construction.webp` | decoration |
