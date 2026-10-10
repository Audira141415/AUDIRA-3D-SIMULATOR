import React from 'react';

interface ModelProps {
  type: string;
  color?: string;
}

export const ProceduralModel: React.FC<ModelProps> = ({ type, color }) => {
  switch (type) {
    // ==========================================
    // 0. TAMAN BERMAIN (PLAYGROUND & PARK)
    // ==========================================
    case 'play-slide':
      return (
        <group>
          {/* 4 Corner Support Posts */}
          {[-0.6, 0.6].map((x, xi) =>
            [-0.6, 0.6].map((z, zi) => (
              <mesh key={`${xi}-${zi}`} position={[x, 1.25, z]} castShadow>
                <boxGeometry args={[0.08, 2.5, 0.08]} />
                <meshStandardMaterial color="#3b82f6" />
              </mesh>
            ))
          )}
          {/* Elevated Tower Platform Floor */}
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.1, 1.3]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} />
          </mesh>
          {/* Safety Railings */}
          <mesh position={[0, 1.7, -0.6]} castShadow>
            <boxGeometry args={[1.2, 0.5, 0.05]} />
            <meshStandardMaterial color="#eab308" wireframe />
          </mesh>
          <mesh position={[-0.6, 1.7, 0]} castShadow>
            <boxGeometry args={[0.05, 0.5, 1.2]} />
            <meshStandardMaterial color="#eab308" wireframe />
          </mesh>
          {/* Conical Roof Canopy */}
          <mesh position={[0, 2.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.1, 0.8, 4]} />
            <meshStandardMaterial color="#10b981" roughness={0.5} />
          </mesh>
          {/* Slanted Curved Slide Chute */}
          <mesh position={[0, 0.7, 1.3]} rotation={[0.55, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.65, 0.08, 2.0]} />
            <meshStandardMaterial color={color || '#ef4444'} roughness={0.3} />
          </mesh>
          {/* Slide Safety Raised Side Curbs */}
          <mesh position={[-0.32, 0.78, 1.3]} rotation={[0.55, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.18, 2.0]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
          <mesh position={[0.32, 0.78, 1.3]} rotation={[0.55, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.18, 2.0]} />
            <meshStandardMaterial color="#b91c1c" />
          </mesh>
          {/* Ladder Steps at Back */}
          {[0.3, 0.6, 0.9, 1.2].map((y, idx) => (
            <mesh key={idx} position={[0, y, -0.6]} castShadow>
              <boxGeometry args={[0.5, 0.04, 0.04]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          ))}
        </group>
      );

    case 'play-swing':
      return (
        <group>
          {/* Left A-Frame Legs */}
          <mesh position={[-1.2, 1.2, 0.4]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 2.5, 8]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>
          <mesh position={[-1.2, 1.2, -0.4]} rotation={[-0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 2.5, 8]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>
          {/* Right A-Frame Legs */}
          <mesh position={[1.2, 1.2, 0.4]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 2.5, 8]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>
          <mesh position={[1.2, 1.2, -0.4]} rotation={[-0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 2.5, 8]} />
            <meshStandardMaterial color="#06b6d4" />
          </mesh>
          {/* Top Horizontal Crossbeam */}
          <mesh position={[0, 2.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.6, 8]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Swing 1 Chains & Seat */}
          <mesh position={[-0.55, 1.3, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.8, 4]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[-0.25, 1.3, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.8, 4]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[-0.4, 0.4, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.22]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          {/* Swing 2 Chains & Seat */}
          <mesh position={[0.25, 1.3, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.8, 4]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0.55, 1.3, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 1.8, 4]} />
            <meshBasicMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0.4, 0.4, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.22]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      );

    case 'play-seesaw':
      return (
        <group>
          {/* Central Triangular Fulcrum Base */}
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.35, 0.6, 3]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Main Tilted Seesaw Plank */}
          <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.18]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 0.08, 0.28]} />
            <meshStandardMaterial color={color || '#eab308'} roughness={0.4} />
          </mesh>
          {/* Left Seat & Handlebar */}
          <mesh position={[-1.25, 0.28, 0]} castShadow>
            <boxGeometry args={[0.3, 0.06, 0.28]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-1.05, 0.48, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
            <meshStandardMaterial color="#09090b" metalness={0.8} />
          </mesh>
          {/* Right Seat & Handlebar */}
          <mesh position={[1.25, 0.62, 0]} castShadow>
            <boxGeometry args={[0.3, 0.06, 0.28]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[1.05, 0.82, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
            <meshStandardMaterial color="#09090b" metalness={0.8} />
          </mesh>
        </group>
      );

    case 'play-roundabout':
      return (
        <group>
          {/* Rotating Circular Base Disc */}
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.4, 1.4, 0.12, 24]} />
            <meshStandardMaterial color={color || '#10b981'} roughness={0.4} />
          </mesh>
          {/* Central Pivot Column */}
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 0.8, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Tubular Steel Handrails */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(angle) * 0.75, 0.55, Math.sin(angle) * 0.75]}
              rotation={[0, angle, 0]}
              castShadow
            >
              <torusGeometry args={[0.35, 0.03, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} />
            </mesh>
          ))}
        </group>
      );

    case 'play-sandbox':
      return (
        <group>
          {/* Square Wooden Frame */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.3, 2.4]} />
            <meshStandardMaterial color="#b45309" roughness={0.7} />
          </mesh>
          {/* Soft Golden Sand Interior */}
          <mesh position={[0, 0.2, 0]} receiveShadow>
            <boxGeometry args={[2.1, 0.2, 2.1]} />
            <meshStandardMaterial color="#fde047" roughness={0.9} />
          </mesh>
          {/* Beach Umbrella Canopy in Corner */}
          <mesh position={[0.7, 0.9, 0.7]} rotation={[0.1, 0, 0.1]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0.75, 1.65, 0.75]} rotation={[0.1, 0, 0.1]} castShadow>
            <coneGeometry args={[0.7, 0.35, 8]} />
            <meshStandardMaterial color="#ef4444" roughness={0.5} />
          </mesh>
        </group>
      );

    case 'play-climbing':
      return (
        <group>
          {/* Monkey Bars Tubular Frame */}
          {[-1.2, 1.2].map((x, xi) => (
            <React.Fragment key={xi}>
              <mesh position={[x, 1.0, -0.45]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
                <meshStandardMaterial color="#8b5cf6" metalness={0.6} />
              </mesh>
              <mesh position={[x, 1.0, 0.45]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
                <meshStandardMaterial color="#8b5cf6" metalness={0.6} />
              </mesh>
            </React.Fragment>
          ))}
          {/* Top Horizontal Hand Rungs */}
          {[-0.9, -0.45, 0, 0.45, 0.9].map((x, idx) => (
            <mesh key={idx} position={[x, 1.95, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.7} />
            </mesh>
          ))}
        </group>
      );

    case 'play-springer':
      return (
        <group>
          {/* Heavy Base Anchor */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.3, 0.1, 12]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Coiled Steel Spring */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.45, 10]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Rocking Animal Horse Body */}
          <mesh position={[0, 0.68, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, 0.7]} />
            <meshStandardMaterial color={color || '#ec4899'} roughness={0.3} />
          </mesh>
          {/* Head & Handlebars */}
          <mesh position={[0, 0.95, 0.25]} castShadow>
            <boxGeometry args={[0.22, 0.3, 0.25]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
          <mesh position={[0, 1.05, 0.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      );

    case 'play-gazebo':
      return (
        <group>
          {/* Hexagonal Deck Platform */}
          <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[2.0, 2.1, 0.3, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          {/* 6 Wooden Posts */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * Math.PI) / 3;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 1.7, 1.4, Math.sin(angle) * 1.7]}
                castShadow
              >
                <cylinderGeometry args={[0.08, 0.08, 2.3, 8]} />
                <meshStandardMaterial color="#92400e" roughness={0.6} />
              </mesh>
            );
          })}
          {/* Hexagonal Pagoda Roof */}
          <mesh position={[0, 3.1, 0]} castShadow>
            <coneGeometry args={[2.4, 1.3, 6]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.5} />
          </mesh>
        </group>
      );

    case 'play-bench':
      return (
        <group>
          {/* Cast Iron Legs */}
          {[-0.7, 0.7].map((x, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[x, 0.25, -0.2]} castShadow>
                <boxGeometry args={[0.06, 0.5, 0.06]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
              <mesh position={[x, 0.25, 0.2]} castShadow>
                <boxGeometry args={[0.06, 0.5, 0.06]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
            </React.Fragment>
          ))}
          {/* Wooden Slats (Seat) */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 0.06, 0.55]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
          {/* Wooden Backrest */}
          <mesh position={[0, 0.75, -0.24]} rotation={[0.1, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.4, 0.06]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>
        </group>
      );

    case 'play-fountain':
      return (
        <group>
          {/* Lower Stone Basin Ring */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.8, 1.9, 0.5, 24]} />
            <meshStandardMaterial color="#64748b" roughness={0.7} />
          </mesh>
          {/* Water Pool Inside Basin */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[1.65, 1.65, 0.05, 24]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
          </mesh>
          {/* Center Fountain Pedestal */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 1.0, 16]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Upper Bowl */}
          <mesh position={[0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.4, 0.3, 18]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          {/* Gushing Water Jet Core */}
          <mesh position={[0, 1.65, 0]}>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0.9} />
          </mesh>
        </group>
      );

    case 'play-ball-pool':
      return (
        <group>
          {/* Circular Enclosure Wall */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.6, 1.6, 0.7, 24, 1, true]} />
            <meshStandardMaterial color="#06b6d4" side={2} />
          </mesh>
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <cylinderGeometry args={[1.6, 1.6, 0.1, 24]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Colorful Play Balls */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, xi) =>
            [-0.8, -0.4, 0, 0.4, 0.8].map((z, zi) => {
              const clrs = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
              const c = clrs[(xi + zi) % clrs.length];
              return (
                <mesh key={`${xi}-${zi}`} position={[x * 0.9, 0.28, z * 0.9]} castShadow>
                  <sphereGeometry args={[0.14, 8, 8]} />
                  <meshStandardMaterial color={c} roughness={0.3} />
                </mesh>
              );
            })
          )}
        </group>
      );

    case 'play-balloon-arch':
      return (
        <group>
          {/* Arch of Colorful Balloons */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const angle = (i * Math.PI) / 10;
            const x = Math.cos(angle) * 1.6;
            const y = Math.sin(angle) * 2.2 + 0.4;
            const clrs = ['#ec4899', '#3b82f6', '#eab308', '#10b981', '#a855f7', '#f97316'];
            return (
              <mesh key={i} position={[x, y, 0]} castShadow>
                <sphereGeometry args={[0.26, 10, 10]} />
                <meshStandardMaterial color={clrs[i % clrs.length]} roughness={0.2} />
              </mesh>
            );
          })}
        </group>
      );

    case 'play-balloons':
      return (
        <group>
          {/* Cluster of Balloons on String Sticks */}
          {[
            [-0.3, 1.8, -0.2, '#ef4444'],
            [0.3, 2.0, -0.1, '#3b82f6'],
            [0.0, 2.3, 0.0, '#eab308'],
            [-0.2, 2.1, 0.3, '#10b981'],
            [0.25, 1.9, 0.2, '#ec4899'],
          ].map(([x, y, z, clr], idx) => (
            <React.Fragment key={idx}>
              <mesh position={[Number(x), Number(y), Number(z)]} castShadow>
                <sphereGeometry args={[0.28, 12, 12]} />
                <meshStandardMaterial color={String(clr)} roughness={0.2} />
              </mesh>
              <mesh position={[Number(x) * 0.5, Number(y) * 0.5, Number(z) * 0.5]}>
                <cylinderGeometry args={[0.008, 0.008, Number(y), 4]} />
                <meshBasicMaterial color="#94a3b8" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'play-balls':
      return (
        <group>
          {/* Giant Playground Balls */}
          <mesh position={[-0.5, 0.45, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color={color || '#ef4444'} roughness={0.3} />
          </mesh>
          <mesh position={[0.5, 0.35, 0.3]} castShadow receiveShadow>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.3} />
          </mesh>
          <mesh position={[0.1, 0.25, -0.5]} castShadow receiveShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color="#eab308" roughness={0.3} />
          </mesh>
        </group>
      );

    case 'play-trampoline':
      return (
        <group>
          {/* 6 Curved Steel Legs */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * Math.PI) / 3;
            return (
              <React.Fragment key={i}>
                <mesh
                  position={[Math.cos(angle) * 1.5, 0.35, Math.sin(angle) * 1.5]}
                  castShadow
                >
                  <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
                  <meshStandardMaterial color="#334155" metalness={0.7} />
                </mesh>
                {/* Vertical Net Enclosure Poles */}
                <mesh
                  position={[Math.cos(angle) * 1.55, 1.45, Math.sin(angle) * 1.55]}
                  castShadow
                >
                  <cylinderGeometry args={[0.035, 0.035, 1.5, 8]} />
                  <meshStandardMaterial color="#0284c7" />
                </mesh>
              </React.Fragment>
            );
          })}
          {/* Outer Protective Foam Pad Ring */}
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.65, 1.65, 0.08, 24]} />
            <meshStandardMaterial color={color || '#10b981'} roughness={0.4} />
          </mesh>
          {/* Black Jumping Mat Mesh */}
          <mesh position={[0, 0.72, 0]} receiveShadow>
            <cylinderGeometry args={[1.35, 1.35, 0.04, 24]} />
            <meshStandardMaterial color="#09090b" roughness={0.9} />
          </mesh>
          {/* Top Enclosure Net Ring */}
          <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.55, 0.03, 8, 24]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Translucent Safety Enclosure Netting */}
          <mesh position={[0, 1.45, 0]}>
            <cylinderGeometry args={[1.55, 1.55, 1.45, 24, 1, true]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.3} />
          </mesh>
        </group>
      );

    case 'play-spiral-slide':
      return (
        <group>
          {/* Central Support Pillar */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 4.0, 16]} />
            <meshStandardMaterial color="#2563eb" metalness={0.5} />
          </mesh>
          {/* Top Hex Platform Floor */}
          <mesh position={[0, 2.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.1, 1.1, 0.1, 6]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.5} />
          </mesh>
          {/* Platform Safety Railing */}
          <mesh position={[0, 3.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.04, 6, 6]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          {/* Conical Roof Cap */}
          <mesh position={[0, 4.2, 0]} castShadow>
            <coneGeometry args={[1.4, 1.1, 6]} />
            <meshStandardMaterial color="#10b981" roughness={0.4} />
          </mesh>
          {/* Spiral Slide Helical Steps / Chute Loop */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const angle = (i * Math.PI) / 2.5;
            const y = 2.4 - i * 0.35;
            return (
              <group key={i} position={[Math.cos(angle) * 0.9, y, Math.sin(angle) * 0.9]} rotation={[0, -angle, 0.25]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.7, 0.1, 0.5]} />
                  <meshStandardMaterial color={color || '#f97316'} roughness={0.3} />
                </mesh>
                {/* Safety Lip */}
                <mesh position={[0.32, 0.12, 0]} castShadow>
                  <boxGeometry args={[0.06, 0.18, 0.5]} />
                  <meshStandardMaterial color="#c2410c" />
                </mesh>
              </group>
            );
          })}
          {/* Ascending Steps Ladder */}
          {[0.4, 0.9, 1.4, 1.9, 2.4].map((y, idx) => (
            <mesh key={idx} position={[-0.8, y, -0.6]} castShadow>
              <boxGeometry args={[0.4, 0.05, 0.05]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          ))}
        </group>
      );

    case 'play-bouncy-castle':
      return (
        <group>
          {/* Thick Inflatable Inflatable Bouncy Mattress Floor */}
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 0.6, 3.2]} />
            <meshStandardMaterial color={color || '#8b5cf6'} roughness={0.3} />
          </mesh>
          {/* 4 Corner Inflatable Towers */}
          {[-1.4, 1.4].map((x, xi) =>
            [-1.4, 1.4].map((z, zi) => (
              <group key={`${xi}-${zi}`} position={[x, 0, z]}>
                <mesh position={[0, 1.3, 0]} castShadow>
                  <cylinderGeometry args={[0.35, 0.4, 1.8, 12]} />
                  <meshStandardMaterial color="#ec4899" roughness={0.3} />
                </mesh>
                {/* Conical Turret Roofs */}
                <mesh position={[0, 2.6, 0]} castShadow>
                  <coneGeometry args={[0.48, 0.8, 12]} />
                  <meshStandardMaterial color="#facc15" roughness={0.3} />
                </mesh>
              </group>
            ))
          )}
          {/* Back Wall */}
          <mesh position={[0, 1.1, -1.4]} castShadow>
            <boxGeometry args={[2.4, 1.1, 0.35]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.4} />
          </mesh>
          {/* Left Wall */}
          <mesh position={[-1.4, 1.1, 0]} castShadow>
            <boxGeometry args={[0.35, 1.1, 2.4]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.4} />
          </mesh>
          {/* Right Wall */}
          <mesh position={[1.4, 1.1, 0]} castShadow>
            <boxGeometry args={[0.35, 1.1, 2.4]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.4} />
          </mesh>
          {/* Front Entrance Pillars & Arch */}
          <mesh position={[-0.8, 0.9, 1.4]} castShadow>
            <boxGeometry args={[0.6, 0.8, 0.3]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0.8, 0.9, 1.4]} castShadow>
            <boxGeometry args={[0.6, 0.8, 0.3]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <mesh position={[0, 1.8, 1.4]} castShadow>
            <boxGeometry args={[2.2, 0.4, 0.3]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
        </group>
      );

    case 'play-tunnel':
      return (
        <group>
          {/* Heavy Support Saddles */}
          {[-1.0, 0, 1.0].map((z, idx) => (
            <mesh key={idx} position={[0, 0.1, z]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.2, 0.25]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))}
          {/* Segment 1: Cyan Tube */}
          <mesh position={[0, 0.75, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.8, 20, 1, true]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.3} side={2} />
          </mesh>
          {/* Segment 2: Yellow Center Tube */}
          <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.68, 0.68, 0.8, 20, 1, true]} />
            <meshStandardMaterial color="#eab308" roughness={0.3} side={2} />
          </mesh>
          {/* Segment 3: Red Tube */}
          <mesh position={[0, 0.75, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.8, 20, 1, true]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} side={2} />
          </mesh>
          {/* Front & Back Rubber Entrance Flanges */}
          <mesh position={[0, 0.75, 1.22]}>
            <torusGeometry args={[0.66, 0.06, 8, 20]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
          <mesh position={[0, 0.75, -1.22]}>
            <torusGeometry args={[0.66, 0.06, 8, 20]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
        </group>
      );

    case 'play-climbing-wall':
      return (
        <group>
          {/* Rear A-frame Timber Braces */}
          <mesh position={[-0.9, 1.2, -0.55]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 2.6, 0.1]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0.9, 1.2, -0.55]} rotation={[0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 2.6, 0.1]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Slanted Climbing Wall Board */}
          <mesh position={[0, 1.35, 0]} rotation={[-0.15, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 2.7, 0.1]} />
            <meshStandardMaterial color={color || '#64748b'} roughness={0.8} />
          </mesh>
          {/* Top Safety Crest Bar */}
          <mesh position={[0, 2.7, -0.2]}>
            <cylinderGeometry args={[0.04, 0.04, 2.3, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} />
          </mesh>
          {/* Scattered Colorful Climbing Grips / Holds */}
          {[
            [-0.7, 0.5, 0.1, '#ef4444'],
            [-0.3, 0.8, 0.1, '#3b82f6'],
            [0.2, 0.6, 0.1, '#10b981'],
            [0.6, 0.9, 0.1, '#f59e0b'],
            [-0.6, 1.3, 0.1, '#ec4899'],
            [-0.1, 1.5, 0.1, '#eab308'],
            [0.4, 1.4, 0.1, '#8b5cf6'],
            [0.7, 1.7, 0.1, '#06b6d4'],
            [-0.4, 2.0, 0.1, '#10b981'],
            [0.1, 2.2, 0.1, '#ef4444'],
            [0.5, 2.1, 0.1, '#3b82f6'],
          ].map(([x, y, z, clr], idx) => (
            <mesh key={idx} position={[Number(x), Number(y), Number(z) - 0.15 * (Number(y) - 1.35)]} castShadow>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color={String(clr)} roughness={0.5} />
            </mesh>
          ))}
          {/* Fall Protection Crash Mat */}
          <mesh position={[0, 0.1, 0.8]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.18, 1.4]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </mesh>
        </group>
      );

    case 'play-ferris-wheel':
      return (
        <group>
          {/* Dual Left & Right Triangular Support Towers */}
          {[-0.6, 0.6].map((x, xi) => (
            <React.Fragment key={xi}>
              <mesh position={[x, 2.2, -1.0]} rotation={[-0.35, 0, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 4.6, 8]} />
                <meshStandardMaterial color="#0284c7" metalness={0.7} />
              </mesh>
              <mesh position={[x, 2.2, 1.0]} rotation={[0.35, 0, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 4.6, 8]} />
                <meshStandardMaterial color="#0284c7" metalness={0.7} />
              </mesh>
              <mesh position={[x, 0.15, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, 0.3, 2.6]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            </React.Fragment>
          ))}
          {/* Central Axle Spindle */}
          <mesh position={[0, 4.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 1.5, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
          {/* Giant Outer Wheel Rings */}
          <mesh position={[-0.3, 4.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[2.5, 0.05, 8, 32]} />
            <meshStandardMaterial color={color || '#ec4899'} metalness={0.6} />
          </mesh>
          <mesh position={[0.3, 4.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[2.5, 0.05, 8, 32]} />
            <meshStandardMaterial color={color || '#ec4899'} metalness={0.6} />
          </mesh>
          {/* 8 Radial Spokes & Hanging Gondolas */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * Math.PI) / 4;
            const r = 2.5;
            const gondolaColors = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6', '#f43f5e'];
            return (
              <React.Fragment key={i}>
                {/* Radial Spoke */}
                <mesh
                  position={[0, 4.1 + Math.sin(angle) * (r / 2), Math.cos(angle) * (r / 2)]}
                  rotation={[angle, 0, 0]}
                >
                  <cylinderGeometry args={[0.03, 0.03, r, 6]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.8} />
                </mesh>
                {/* Hanging Gondola Cabin */}
                <group position={[0, 4.1 + Math.sin(angle) * r - 0.35, Math.cos(angle) * r]}>
                  {/* Cabin Shell */}
                  <mesh castShadow>
                    <boxGeometry args={[0.7, 0.5, 0.5]} />
                    <meshStandardMaterial color={gondolaColors[i]} roughness={0.3} />
                  </mesh>
                  {/* Roof Canopy */}
                  <mesh position={[0, 0.35, 0]} castShadow>
                    <coneGeometry args={[0.45, 0.25, 4]} />
                    <meshStandardMaterial color="#fef08a" />
                  </mesh>
                </group>
              </React.Fragment>
            );
          })}
        </group>
      );

    case 'play-pirate-ship':
      return (
        <group>
          {/* Twin Steel A-Frames */}
          {[-1.2, 1.2].map((x, xi) => (
            <React.Fragment key={xi}>
              <mesh position={[x, 2.4, -1.2]} rotation={[-0.35, 0, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 5.0, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} />
              </mesh>
              <mesh position={[x, 2.4, 1.2]} rotation={[0.35, 0, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.1, 5.0, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.7} />
              </mesh>
            </React.Fragment>
          ))}
          {/* Overhead Pivot Crossbeam */}
          <mesh position={[0, 4.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 2.8, 12]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} />
          </mesh>
          {/* 4 Pendulum Suspension Arms */}
          {[-0.6, 0.6].map((x, xi) => (
            <React.Fragment key={xi}>
              <mesh position={[x, 2.7, -0.6]} rotation={[-0.15, 0, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 3.4, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
              <mesh position={[x, 2.7, 0.6]} rotation={[0.15, 0, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 3.4, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
            </React.Fragment>
          ))}
          {/* Stylized Pirate Ship Hull */}
          <group position={[0, 1.1, 0]}>
            {/* Hull Lower Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.3, 0.7, 3.2]} />
              <meshStandardMaterial color={color || '#78350f'} roughness={0.7} />
            </mesh>
            {/* Elevated Bow & Stern Casings */}
            <mesh position={[0, 0.55, 1.5]} castShadow>
              <boxGeometry args={[1.3, 0.5, 0.7]} />
              <meshStandardMaterial color="#92400e" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.55, -1.5]} castShadow>
              <boxGeometry args={[1.3, 0.5, 0.7]} />
              <meshStandardMaterial color="#92400e" roughness={0.6} />
            </mesh>
            {/* Center Mast & Black Pirate Jolly Roger Flag */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
            <mesh position={[0.3, 1.8, 0]} castShadow>
              <planeGeometry args={[0.6, 0.4]} />
              <meshStandardMaterial color="#09090b" side={2} />
            </mesh>
          </group>
        </group>
      );

    case 'play-tire-swing':
      return (
        <group>
          {/* Tripod Timber Frame */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(angle) * 0.9, 1.45, Math.sin(angle) * 0.9]}
              rotation={[-Math.sin(angle) * 0.28, 0, Math.cos(angle) * 0.28]}
              castShadow
            >
              <cylinderGeometry args={[0.06, 0.08, 3.1, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} />
            </mesh>
          ))}
          {/* Top Swivel Crown Cap */}
          <mesh position={[0, 2.9, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.25, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* 3 Chains Down */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
            <mesh
              key={idx}
              position={[Math.cos(angle) * 0.25, 1.6, Math.sin(angle) * 0.25]}
            >
              <cylinderGeometry args={[0.015, 0.015, 2.3, 4]} />
              <meshBasicMaterial color="#94a3b8" />
            </mesh>
          ))}
          {/* Horizontal Suspended Rubber Tire */}
          <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.42, 0.16, 12, 24]} />
            <meshStandardMaterial color={color || '#18181b'} roughness={0.9} />
          </mesh>
        </group>
      );

    case 'play-playhouse':
      return (
        <group>
          {/* 4 Stilt Legs */}
          {[-0.8, 0.8].map((x, xi) =>
            [-0.8, 0.8].map((z, zi) => (
              <mesh key={`${xi}-${zi}`} position={[x, 0.45, z]} castShadow>
                <boxGeometry args={[0.1, 0.9, 0.1]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
            ))
          )}
          {/* Deck Floor Base */}
          <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.1, 1.9]} />
            <meshStandardMaterial color="#b45309" roughness={0.6} />
          </mesh>
          {/* Cozy Cottage House Body */}
          <mesh position={[0, 1.65, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.3, 1.3]} />
            <meshStandardMaterial color={color || '#eab308'} roughness={0.4} />
          </mesh>
          {/* Pitched Gable Shingle Roof */}
          <mesh position={[0, 2.5, -0.2]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.4, 0.8, 4]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          {/* Front Door Opening */}
          <mesh position={[0, 1.45, 0.46]}>
            <boxGeometry args={[0.5, 0.9, 0.02]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          {/* Window */}
          <mesh position={[0.76, 1.7, -0.2]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.45, 0.45]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          {/* Wooden Mini Ladder */}
          {[0.25, 0.5, 0.75].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.9]} castShadow>
              <boxGeometry args={[0.4, 0.04, 0.04]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
          ))}
        </group>
      );

    case 'play-balance-beam':
      return (
        <group>
          {/* 3 Tree Trunk Log Pedestals */}
          {[-1.2, 0, 1.2].map((x, idx) => (
            <mesh key={idx} position={[x, 0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.4, 12]} />
              <meshStandardMaterial color="#451a03" roughness={0.8} />
            </mesh>
          ))}
          {/* Main Elevated Wooden Balance Log */}
          <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.12, 2.8, 16]} />
            <meshStandardMaterial color={color || '#78350f'} roughness={0.7} />
          </mesh>
          {/* Stepping Stumps at Ends */}
          <mesh position={[-1.7, 0.12, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.28, 0.24, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh position={[1.7, 0.12, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.28, 0.24, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        </group>
      );

    case 'play-kiosk':
      return (
        <group>
          {/* Cart Base with Counter */}
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.9, 1.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          {/* Wooden Counter Top */}
          <mesh position={[0, 1.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.0, 0.08, 1.4]} />
            <meshStandardMaterial color="#92400e" roughness={0.5} />
          </mesh>
          {/* Glass Display Sneeze Guard */}
          <mesh position={[0, 1.3, 0.4]}>
            <boxGeometry args={[1.6, 0.35, 0.04]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
          </mesh>
          {/* 4 Canopy Support Poles */}
          {[-0.9, 0.9].map((x, xi) =>
            [-0.55, 0.55].map((z, zi) => (
              <mesh key={`${xi}-${zi}`} position={[x, 1.7, z]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 1.3, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.7} />
              </mesh>
            ))
          )}
          {/* Red & White Striped Fabric Canopy Roof */}
          <mesh position={[0, 2.45, 0]} castShadow>
            <boxGeometry args={[2.2, 0.25, 1.6]} />
            <meshStandardMaterial color={color || '#fb7185'} roughness={0.4} />
          </mesh>
          {/* Big Decorative Ice Cream Cone on Roof */}
          <group position={[0, 2.9, 0]}>
            <mesh rotation={[Math.PI, 0, 0]} castShadow>
              <coneGeometry args={[0.22, 0.5, 12]} />
              <meshStandardMaterial color="#d97706" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow>
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshStandardMaterial color="#ec4899" roughness={0.3} />
            </mesh>
          </group>
          {/* Cart Wheels */}
          {[-0.95, 0.95].map((x, idx) => (
            <mesh key={idx} position={[x, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
              <meshStandardMaterial color="#78350f" />
            </mesh>
          ))}
        </group>
      );

    case 'play-trash-bin':
      return (
        <group>
          {/* Dual Bin Enclosure Body */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.85, 0.55]} />
            <meshStandardMaterial color={color || '#15803d'} roughness={0.6} />
          </mesh>
          {/* Recyclables Blue Flap Lid */}
          <mesh position={[-0.24, 0.95, 0]} castShadow>
            <boxGeometry args={[0.42, 0.1, 0.5]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          {/* General Waste Yellow Flap Lid */}
          <mesh position={[0.24, 0.95, 0]} castShadow>
            <boxGeometry args={[0.42, 0.1, 0.5]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          {/* Rain Hood Canopy Arch */}
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[1.1, 0.06, 0.65]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} />
          </mesh>
        </group>
      );

    // ==========================================
    // 1. MOBIL PENUMPANG (PASSENGER & SPORT CARS)
    // ==========================================
    case 'car-sedan':
    case 'car':
      return (
        <group>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.4, 2.6]} />
            <meshStandardMaterial color={color || '#3b82f6'} roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.72, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.45, 1.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.68, 0.62]} rotation={[0.4, 0, 0]}>
            <planeGeometry args={[0.92, 0.45]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 0.68, -0.82]} rotation={[-0.4, Math.PI, 0]}>
            <planeGeometry args={[0.92, 0.45]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
          </mesh>
          {[-0.75, 0.75].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.62, 0.25, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.9} />
              </mesh>
              <mesh position={[0.62, 0.25, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.9} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-sport':
      return (
        <group>
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.32, 2.7]} />
            <meshStandardMaterial color={color || '#ef4444'} roughness={0.2} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.58, -0.15]} castShadow receiveShadow>
            <boxGeometry args={[1.05, 0.36, 1.3]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.75, -1.15]} castShadow>
            <boxGeometry args={[1.4, 0.05, 0.3]} />
            <meshStandardMaterial color="#09090b" roughness={0.5} />
          </mesh>
          {[-0.8, 0.8].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.7, 0.24, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.24, 0.24, 0.18, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.8} />
              </mesh>
              <mesh position={[0.7, 0.24, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.24, 0.24, 0.18, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.8} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-supercar':
      return (
        <group>
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 0.28, 2.9]} />
            <meshStandardMaterial color={color || '#a855f7'} roughness={0.15} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.55, -0.2]} castShadow>
            <boxGeometry args={[1.0, 0.35, 1.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.78, -0.3]} castShadow>
            <boxGeometry args={[0.35, 0.14, 0.45]} />
            <meshStandardMaterial color="#09090b" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.72, -1.25]} castShadow>
            <boxGeometry args={[1.5, 0.05, 0.28]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
          {[-0.85, 0.85].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.74, 0.25, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.7} />
              </mesh>
              <mesh position={[0.74, 0.25, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.7} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-suv':
      return (
        <group>
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.55, 2.7]} />
            <meshStandardMaterial color={color || '#10b981'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.05, -0.15]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.55, 1.6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.38, -0.15]} castShadow>
            <boxGeometry args={[1.05, 0.08, 1.4]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
          <mesh position={[0, 0.85, -1.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {[-0.8, 0.8].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.72, 0.36, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.36, 0.36, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.9} />
              </mesh>
              <mesh position={[0.72, 0.36, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.36, 0.36, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.9} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-pickup':
      return (
        <group>
          <mesh position={[0, 0.5, 0.45]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.55, 1.6]} />
            <meshStandardMaterial color={color || '#f59e0b'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.0, 0.35]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.5, 1.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.45, -0.75]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.45, 1.5]} />
            <meshStandardMaterial color={color || '#f59e0b'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.1, -0.22]} castShadow>
            <boxGeometry args={[1.15, 0.45, 0.08]} />
            <meshStandardMaterial color="#09090b" metalness={0.7} />
          </mesh>
          {[-0.85, 0.85].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.72, 0.36, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.36, 0.36, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.9} />
              </mesh>
              <mesh position={[0.72, 0.36, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.36, 0.36, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.9} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-convertible':
      return (
        <group>
          <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.25, 0.35, 2.5]} />
            <meshStandardMaterial color={color || '#ec4899'} roughness={0.25} metalness={0.5} />
          </mesh>
          {[-0.24, 0.24].map((x, idx) => (
            <mesh key={idx} position={[x, 0.48, -0.25]} castShadow>
              <boxGeometry args={[0.32, 0.35, 0.32]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.58, 0.42]} rotation={[0.45, 0, 0]}>
            <planeGeometry args={[1.05, 0.35]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
          {[-0.7, 0.7].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.65, 0.24, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.24, 0.24, 0.16, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0.65, 0.24, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.24, 0.24, 0.16, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-taxi':
      return (
        <group>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.4, 2.6]} />
            <meshStandardMaterial color="#eab308" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.72, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.45, 1.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 1.02, -0.1]} castShadow>
            <boxGeometry args={[0.4, 0.14, 0.2]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
          {[-0.75, 0.75].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.62, 0.25, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0.62, 0.25, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-cyber':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.45, 2.9]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.95, -0.1]} castShadow receiveShadow>
            <coneGeometry args={[1.1, 0.65, 4]} />
            <meshStandardMaterial color="#334155" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.52, 1.46]}>
            <boxGeometry args={[1.3, 0.05, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
          {[-0.9, 0.9].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.74, 0.34, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.34, 0.34, 0.22, 6]} />
                <meshStandardMaterial color="#09090b" roughness={0.5} />
              </mesh>
              <mesh position={[0.74, 0.34, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.34, 0.34, 0.22, 6]} />
                <meshStandardMaterial color="#09090b" roughness={0.5} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-hatchback':
      return (
        <group>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.15, 0.4, 2.2]} />
            <meshStandardMaterial color={color || '#06b6d4'} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.72, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.98, 0.45, 1.3]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {[-0.65, 0.65].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.6, 0.24, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.24, 0.24, 0.14, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0.6, 0.24, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.24, 0.24, 0.14, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-police':
      return (
        <group>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.25, 0.42, 2.7]} />
            <meshStandardMaterial color="#09090b" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.74, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[1.05, 0.46, 1.4]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[-0.22, 1.02, -0.1]}>
            <boxGeometry args={[0.22, 0.08, 0.15]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.22, 1.02, -0.1]}>
            <boxGeometry args={[0.22, 0.08, 0.15]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.8} />
          </mesh>
          {[-0.78, 0.78].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.65, 0.26, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.26, 0.26, 0.16, 16]} />
                <meshStandardMaterial color="#09090b" metalness={0.6} />
              </mesh>
              <mesh position={[0.65, 0.26, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.26, 0.26, 0.16, 16]} />
                <meshStandardMaterial color="#09090b" metalness={0.6} />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'car-ambulance':
      return (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.3, 3.4]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.15, -0.3]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 1.3, 2.4]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.95, 1.2]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.9, 1.0]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
          <mesh position={[-0.73, 1.15, -0.3]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.45, 0.45]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0.73, 1.15, -0.3]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.45, 0.45]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 1.84, 0.8]}>
            <boxGeometry args={[0.8, 0.1, 0.15]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
          </mesh>
          {[-0.9, 0.9].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.72, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.32, 0.32, 0.18, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0.72, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.32, 0.32, 0.18, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'truck-fire':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.35, 4.2]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.15, 1.3]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 1.25, 1.4]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.2, -0.6]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.35, 2.6]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.98, -0.4]} rotation={[-0.05, 0, 0]} castShadow>
            <boxGeometry args={[0.65, 0.18, 2.8]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.82, 1.3]}>
            <boxGeometry args={[1.1, 0.12, 0.15]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.9} />
          </mesh>
          {[-1.3, -0.4, 1.2].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'van-delivery':
      return (
        <group>
          <mesh position={[0, 0.95, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.3, 2.6]} />
            <meshStandardMaterial color={color || '#fb923c'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.8, 1.25]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.0, 0.9]} />
            <meshStandardMaterial color={color || '#fb923c'} roughness={0.4} />
          </mesh>
          {[-0.8, 0.8].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.7, 0.3, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
              <mesh position={[0.7, 0.3, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.18, 16]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'truck-mixer':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.3, 4.2]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.2, 1.3]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.25, 1.2]} />
            <meshStandardMaterial color={color || '#0284c7'} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.45, -0.6]} rotation={[0.25, 0, 0]} castShadow>
            <cylinderGeometry args={[0.9, 0.4, 2.4, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.5} />
          </mesh>
          {[-1.3, -0.3, 1.1].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'forklift':
      return (
        <group>
          <mesh position={[0, 0.65, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.7, 1.5]} />
            <meshStandardMaterial color={color || '#eab308'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.45, -0.1]} castShadow>
            <boxGeometry args={[0.95, 0.9, 1.1]} />
            <meshStandardMaterial color="#18181b" wireframe />
          </mesh>
          <mesh position={[0, 1.25, 0.72]} castShadow>
            <boxGeometry args={[0.75, 1.8, 0.1]} />
            <meshStandardMaterial color="#27272a" metalness={0.8} />
          </mesh>
          <mesh position={[-0.2, 0.12, 1.25]} castShadow>
            <boxGeometry args={[0.1, 0.04, 0.9]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} />
          </mesh>
          <mesh position={[0.2, 0.12, 1.25]} castShadow>
            <boxGeometry args={[0.1, 0.04, 0.9]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} />
          </mesh>
          {[-0.55, 0.55].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.58, 0.22, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.16, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.58, 0.22, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.16, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'roller':
      return (
        <group>
          <mesh position={[0, 0.9, -0.4]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.9, 1.8]} />
            <meshStandardMaterial color={color || '#ca8a04'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.85, -0.4]} castShadow>
            <boxGeometry args={[1.3, 0.08, 1.4]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
          <mesh position={[0, 0.6, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 1.6, 24]} />
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.9} />
          </mesh>
          <mesh position={[-0.75, 0.5, -0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.28, 16]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
          <mesh position={[0.75, 0.5, -0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.28, 16]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
        </group>
      );

    case 'truck-tanker':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.3, 4.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 1.2, 1.4]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.25, 1.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.35, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.75, 0.75, 2.8, 18]} />
            <meshStandardMaterial color={color || '#64748b'} roughness={0.2} metalness={0.8} />
          </mesh>
          {[-1.4, -0.3, 1.2].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'truck-tow':
      return (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.25, 4.0]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 1.15, 1.2]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.2, 1.2]} />
            <meshStandardMaterial color={color || '#3b82f6'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.72, -0.7]} rotation={[-0.08, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.15, 2.5]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          {[-1.2, 1.1].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.75, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.75, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'truck-garbage':
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.3, 4.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 1.2, 1.3]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.25, 1.2]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 1.35, -0.65]} castShadow receiveShadow>
            <boxGeometry args={[1.55, 1.5, 2.7]} />
            <meshStandardMaterial color={color || '#15803d'} roughness={0.6} />
          </mesh>
          {[-1.3, -0.3, 1.1].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'crane':
      return (
        <group>
          {/* Main body/crawler base */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 0.7, 1.8]} />
            <meshStandardMaterial color={color || '#475569'} roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Vertical leader mast */}
          <mesh position={[0.5, 5, 0]} castShadow>
            <boxGeometry args={[0.3, 10, 0.3]} />
            <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Hammer/ram */}
          <mesh position={[0.5, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 1.2, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Cable to ram */}
          <mesh position={[0.5, 5.5, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 5, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Crawler tracks */}
          {[-0.95, 0.95].map((z, i) => (
            <mesh key={i} position={[0, 0.25, z]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.4, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>
          ))}
        </group>
      );

    // ==========================================
    // BILLBOARD / PAPAN IKLAN
    // ==========================================
      return (
        <group>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.35, 4.4]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 1.15, 1.4]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 1.2, 1.2]} />
            <meshStandardMaterial color={color || '#ea580c'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.8, -0.4]} castShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
          <mesh position={[0, 2.2, -0.4]} rotation={[-0.6, 0, 0]} castShadow>
            <boxGeometry args={[0.35, 3.2, 0.35]} />
            <meshStandardMaterial color={color || '#ea580c'} roughness={0.4} metalness={0.5} />
          </mesh>
          {[-1.4, -0.2, 1.2].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.78, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.38, 0.38, 0.24, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'excavator':
      return (
        <group>
          <mesh position={[-0.5, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.45, 2.2]} />
            <meshStandardMaterial color="#27272a" roughness={0.7} />
          </mesh>
          <mesh position={[0.5, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.45, 2.2]} />
            <meshStandardMaterial color="#27272a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.75, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.6, 1.4]} />
            <meshStandardMaterial color={color || '#eab308'} roughness={0.4} />
          </mesh>
          <mesh position={[-0.3, 1.25, 0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.45, 0.65, 0.7]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.5} transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.8, -0.75]} castShadow receiveShadow>
            <boxGeometry args={[1.05, 0.5, 0.3]} />
            <meshStandardMaterial color="#18181b" roughness={0.8} />
          </mesh>
          <mesh position={[0.2, 1.3, 0.8]} rotation={[-0.6, 0, 0]} castShadow>
            <boxGeometry args={[0.15, 1.4, 0.15]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.4} />
          </mesh>
          <mesh position={[0.2, 2.1, 1.6]} rotation={[0.8, 0, 0]} castShadow>
            <boxGeometry args={[0.12, 1.1, 0.12]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.4} />
          </mesh>
          <mesh position={[0.2, 1.4, 2.1]} rotation={[1.4, 0, 0]} castShadow>
            <boxGeometry args={[0.45, 0.35, 0.4]} />
            <meshStandardMaterial color="#18181b" roughness={0.6} metalness={0.7} />
          </mesh>
        </group>
      );

    case 'truck':
      if (color === '#eab308') return (
        <group>
          {/* Cab */}
          <mesh position={[-1.6, 1.4, 0]} castShadow>
            <boxGeometry args={[1.6, 1.8, 2.2]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* Windshield */}
          <mesh position={[-0.83, 1.8, 0]} castShadow>
            <boxGeometry args={[0.05, 0.8, 1.6]} />
            <meshStandardMaterial color="#7dd3fc" opacity={0.7} transparent roughness={0.1} />
          </mesh>
          {/* Tipper Body */}
          <mesh position={[0.8, 1.6, 0]} castShadow>
            <boxGeometry args={[3.8, 1.4, 2.2]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.7} metalness={0.2} />
          </mesh>
          {/* Hydraulic arm */}
          <mesh position={[0.4, 1.2, 0.7]} rotation={[0, 0, -0.3]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 1.4, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Front axle */}
          <mesh position={[-1.8, 0.55, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.6, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.7} />
          </mesh>
          {/* Rear axle */}
          <mesh position={[1.4, 0.55, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.8, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.7} />
          </mesh>
          {/* Wheels x6 */}
          {[[-1.8, -1.1], [-1.8, 1.1], [1.2, -1.2], [1.2, 1.2], [1.8, -1.2], [1.8, 1.2]].map(([x, z], i) => (
            <mesh key={i} position={[x as number, 0.55, z as number]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.5, 0.32, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>
          ))}
          {/* Exhaust pipe */}
          <mesh position={[-2.1, 2.1, -0.85]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.8} />
          </mesh>
        </group>
      );
      // fallthrough for other trucks
      return (
        <group>
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[4, 2, 2]} />
            <meshStandardMaterial color={color || '#475569'} roughness={0.6} />
          </mesh>
          <mesh position={[-1.5, 0.45, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 2.2, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[1.5, 0.45, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 2.2, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
        </group>
      );

    // ==========================================
    // SCAFFOLDING
    // ==========================================
      return (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.25, 3.8]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          {[-1.2, 0.4, 1.4].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.75, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.9} />
              </mesh>
              <mesh position={[0.75, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
                <meshStandardMaterial color="#09090b" roughness={0.9} />
              </mesh>
            </React.Fragment>
          ))}
          <mesh position={[0, 1.15, 1.1]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.25, 1.3]} />
            <meshStandardMaterial color={color || '#f97316'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.25, -0.6]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 1.1, 2.2]} />
            <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.6} />
          </mesh>
        </group>
      );

    case 'bulldozer':
      return (
        <group>
          <mesh position={[-0.6, 0.3, 0]} castShadow>
            <boxGeometry args={[0.3, 0.5, 2.0]} />
            <meshStandardMaterial color="#27272a" roughness={0.8} />
          </mesh>
          <mesh position={[0.6, 0.3, 0]} castShadow>
            <boxGeometry args={[0.3, 0.5, 2.0]} />
            <meshStandardMaterial color="#27272a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.9, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.9, 1.4]} />
            <meshStandardMaterial color={color || '#eab308'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.5, 1.2]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[1.7, 0.8, 0.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
          </mesh>
        </group>
      );

    case 'bus-city':
      return (
        <group>
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.6, 5.4]} />
            <meshStandardMaterial color={color || '#2563eb'} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <boxGeometry args={[1.52, 0.65, 5.0]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
          </mesh>
          {[-1.8, 0.8, 1.8].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.78, 0.4, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.78, 0.4, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    case 'bus-school':
      return (
        <group>
          <mesh position={[0, 1.25, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.6, 5.0]} />
            <meshStandardMaterial color="#eab308" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.8, 2.6]} castShadow receiveShadow>
            <boxGeometry args={[1.35, 0.8, 0.8]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.4} />
          </mesh>
          {[-1.8, 0.8, 2.0].map((z, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.78, 0.4, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
              <mesh position={[0.78, 0.4, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.22, 16]} />
                <meshStandardMaterial color="#09090b" />
              </mesh>
            </React.Fragment>
          ))}
        </group>
      );

    // ==========================================
    // 5. BANGUNAN (BUILDINGS)
    // ==========================================
    case 'house-small':
      return (
        <group>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.6, 1.8]} />
            <meshStandardMaterial color={color || '#f59e0b'} roughness={0.6} />
          </mesh>
          <mesh position={[0, 2.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[1.5, 0.9, 4]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.5, 0.91]} castShadow>
            <planeGeometry args={[0.45, 0.9]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
        </group>
      );

    case 'house-large':
      return (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 1.8, 2.4]} />
            <meshStandardMaterial color={color || '#d97706'} roughness={0.6} />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.2, 2.0]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>
          <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[2.0, 1.1, 4]} />
            <meshStandardMaterial color="#991b1b" roughness={0.4} />
          </mesh>
        </group>
      );

    case 'warehouse':
      if (color === '#16a34a') return (
        // Kepulauan Nusantara — silhouette-style island group
        <group>
          {/* Jawa */}
          <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[8, 0.15, 2]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
          {/* Sumatra */}
          <mesh position={[-6, 0.1, -3]} rotation={[0, -0.5, 0]} receiveShadow castShadow>
            <boxGeometry args={[7, 0.15, 1.8]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          {/* Kalimantan */}
          <mesh position={[4, 0.1, -4]} receiveShadow castShadow>
            <boxGeometry args={[5, 0.15, 5]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
          {/* Sulawesi */}
          <mesh position={[9, 0.1, -3.5]} rotation={[0, 0.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[2, 0.15, 5]} />
            <meshStandardMaterial color="#14532d" roughness={0.8} />
          </mesh>
          {/* Papua */}
          <mesh position={[14, 0.1, -2]} receiveShadow castShadow>
            <boxGeometry args={[5.5, 0.15, 4]} />
            <meshStandardMaterial color="#064e3b" roughness={0.8} />
          </mesh>
          {/* Ocean base */}
          <mesh position={[2, -0.05, -2]} receiveShadow>
            <boxGeometry args={[28, 0.08, 14]} />
            <meshStandardMaterial color="#0c4a6e" roughness={0.3} opacity={0.85} transparent />
          </mesh>
          {/* Label plate */}
          <mesh position={[0, 0.22, 5]} castShadow>
            <boxGeometry args={[4, 0.12, 0.8]} />
            <meshStandardMaterial color="#166534" roughness={0.5} />
          </mesh>
        </group>
      );
      if (color === '#f59e0b') return (
        // Pulau Bali
        <group>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <sphereGeometry args={[3.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} />
          </mesh>
          {/* Gunung Agung */}
          <mesh position={[0.5, 0.3, -0.5]} castShadow>
            <coneGeometry args={[1.2, 2.5, 10]} />
            <meshStandardMaterial color="#92400e" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <cylinderGeometry args={[4.5, 4.5, 0.2, 20]} />
            <meshStandardMaterial color="#0369a1" roughness={0.3} opacity={0.7} transparent />
          </mesh>
        </group>
      );
      if (color === '#15803d') return (
        // Kalimantan Hutan
        <group>
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 0.24, 9]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
          {[[-2, -2], [2, -1], [-1, 2], [3, 2], [-3, 0]].map(([x, z], i) => (
            <group key={i} position={[x as number, 0.24, z as number]}>
              <mesh castShadow>
                <coneGeometry args={[0.8, 2.2, 7]} />
                <meshStandardMaterial color="#14532d" roughness={0.9} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, -0.05, 0]} receiveShadow>
            <boxGeometry args={[14, 0.08, 12]} />
            <meshStandardMaterial color="#0c4a6e" roughness={0.3} opacity={0.8} transparent />
          </mesh>
        </group>
      );
      if (color === '#0284c7') return (
        // Pulau Jawa Metropolitan
        <group>
          <mesh position={[0, 0.12, 0]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[12, 0.24, 2.5]} />
            <meshStandardMaterial color="#0369a1" roughness={0.7} />
          </mesh>
          {/* City buildings */}
          {[[-4, 0.5], [0, 0.8], [3, 0.6], [-2, 0.4]].map(([x, h], i) => (
            <mesh key={i} position={[x as number, 0.24 + (h as number)/2, 0]} castShadow>
              <boxGeometry args={[0.6, h as number, 0.5]} />
              <meshStandardMaterial color="#075985" metalness={0.4} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, -0.05, 0]} receiveShadow>
            <boxGeometry args={[16, 0.08, 8]} />
            <meshStandardMaterial color="#0c4a6e" roughness={0.3} opacity={0.8} transparent />
          </mesh>
        </group>
      );
      if (color === '#ea580c') return (
        // Sumatra Pegunungan
        <group>
          <mesh position={[0, 0.15, 0]} rotation={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[11, 0.3, 2.5]} />
            <meshStandardMaterial color="#92400e" roughness={0.9} />
          </mesh>
          {[[-3, 1.5], [0, 2.2], [2.5, 1.8]].map(([x, h], i) => (
            <mesh key={i} position={[x as number, 0.3 + (h as number)/2, 0]} castShadow>
              <coneGeometry args={[1, h as number, 8]} />
              <meshStandardMaterial color="#7c2d12" roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, -0.05, 0]} receiveShadow>
            <boxGeometry args={[16, 0.08, 8]} />
            <meshStandardMaterial color="#0c4a6e" roughness={0.3} opacity={0.8} transparent />
          </mesh>
        </group>
      );
      // Fallback standard warehouse building
      return (
        <group>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[5, 3, 4]} />
            <meshStandardMaterial color={color || '#334155'} roughness={0.7} />
          </mesh>
          <mesh position={[0, 3.6, 0]} castShadow>
            <boxGeometry args={[5.1, 0.4, 4.1]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.1, 0]} receiveShadow>
            <boxGeometry args={[5.5, 0.2, 4.5]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
        </group>
      );

      return (
        <group>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.5, 3.0, 6.0]} />
            <meshStandardMaterial color={color || '#64748b'} roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[2.3, 2.3, 4.48, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      );

    case 'datacenter':
      return (
        <group>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.0, 3.2, 5.0]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[-2.02, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[4.0, 1.6]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} />
          </mesh>
        </group>
      );

    case 'office':
      return (
        <group>
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 5.0, 3.2]} />
            <meshStandardMaterial color={color || '#38bdf8'} roughness={0.2} metalness={0.6} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <boxGeometry args={[3.0, 4.9, 3.0]} />
            <meshStandardMaterial color="#1e293b" wireframe />
          </mesh>
        </group>
      );

    // ==========================================
    // 6. JALAN (ROADS)
    // ==========================================
    case 'road-straight':
      return (
        <group>
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[2.8, 0.1, 4.0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 2.5]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        </group>
      );

    case 'road-intersection':
      return (
        <group>
          <mesh position={[0, 0.05, 0]} receiveShadow>
            <boxGeometry args={[4.0, 0.1, 4.0]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 0.6]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
      );

    case 'sidewalk':
      return (
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[1.4, 0.2, 4.0]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      );

    // ==========================================
    // 7. ALAM (NATURE)
    // ==========================================
    case 'tree-pine':
      return (
        <group>
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.3, 1.4, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[1.2, 1.4, 7]} />
            <meshStandardMaterial color={color || '#15803d'} roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.7, 0]} castShadow>
            <coneGeometry args={[0.9, 1.2, 7]} />
            <meshStandardMaterial color="#16a34a" roughness={0.7} />
          </mesh>
        </group>
      );

    case 'tree-oak':
      return (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.35, 1.8, 8]} />
            <meshStandardMaterial color="#5c2c16" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <dodecahedronGeometry args={[1.3, 1]} />
            <meshStandardMaterial color={color || '#16a34a'} roughness={0.6} />
          </mesh>
        </group>
      );

    case 'rock':
      return (
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color={color || '#78716c'} roughness={0.9} metalness={0.1} />
        </mesh>
      );

    case 'bush':
      return (
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.6, 7, 7]} />
          <meshStandardMaterial color={color || '#22c55e'} roughness={0.8} />
        </mesh>
      );

    // ==========================================
    // 8. DEKORASI (DECORATION)
    // ==========================================
    case 'lamp':
      if (color === '#3b82f6') return (
        <group>
          {/* Support poles */}
          <mesh position={[-1, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 5, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.7} />
          </mesh>
          <mesh position={[1, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 5, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.7} />
          </mesh>
          {/* Billboard panel */}
          <mesh position={[0, 5.2, 0]} castShadow>
            <boxGeometry args={[5, 2.5, 0.12]} />
            <meshStandardMaterial color="#1e40af" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Text area */}
          <mesh position={[0, 5.2, 0.07]} castShadow>
            <boxGeometry args={[4.5, 2, 0.04]} />
            <meshStandardMaterial color="#dbeafe" roughness={0.5} />
          </mesh>
          {/* AUDIRA text indicator (horizontal bar) */}
          <mesh position={[0, 5.4, 0.1]}>
            <boxGeometry args={[3, 0.3, 0.04]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} />
          </mesh>
        </group>
      );
      // Regular lamp post
      return (
        <group>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.1, 5, 8]} />
            <meshStandardMaterial color={color || '#fbbf24'} metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 5.1, 0]} castShadow>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={1.2} />
          </mesh>
        </group>
      );

    // ==========================================
    // POWER POLE / TIANG LISTRIK
    // ==========================================
      return (
        <group>
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 3.6, 8]} />
            <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.7} />
          </mesh>
          <mesh position={[0.4, 3.55, 0]} castShadow>
            <boxGeometry args={[0.7, 0.15, 0.25]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.55, 3.44, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      );

    case 'container':
      if (color === '#15803d') return (
        <group>
          {/* Cylindrical tank body */}
          <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[1, 1, 3.5, 20]} />
            <meshStandardMaterial color={color || '#15803d'} metalness={0.5} roughness={0.4} />
          </mesh>
          {/* End caps */}
          <mesh position={[-1.8, 1.2, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color || '#15803d'} metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[1.8, 1.2, 0]} rotation={[0, 0, -Math.PI/2]} castShadow>
            <sphereGeometry args={[1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color || '#15803d'} metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Legs */}
          {[[-1.2, -1.1], [-1.2, 1.1], [1.2, -1.1], [1.2, 1.1]].map(([x, z], i) => (
            <mesh key={i} position={[x as number, 0.3, z as number]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 1.8, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
          ))}
          {/* Pipe fitting on top */}
          <mesh position={[0, 2.25, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
        </group>
      );
      // Default blue container
      return (
        <group>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[6, 2.8, 2.4]} />
            <meshStandardMaterial color={color || '#2563eb'} roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Ribbed side panels */}
          {[-2, -1, 0, 1, 2].map((x, i) => (
            <mesh key={i} position={[x, 1.4, 1.22]} castShadow>
              <boxGeometry args={[0.08, 2.7, 0.06]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 2.9, 0]} castShadow>
            <boxGeometry args={[6.1, 0.12, 2.5]} />
            <meshStandardMaterial color="#1e40af" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      );

    // ==========================================
    // PETA NUSANTARA INDONESIA (Prosedural)
    // ==========================================
      return (
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.6, 3.8]} />
          <meshStandardMaterial color={color || '#2563eb'} roughness={0.4} metalness={0.5} />
        </mesh>
      );

    case 'barrier':
      return (
        <group>
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.7, 0.2]} />
            <meshStandardMaterial color={color || '#ea580c'} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.4, 0.11]} castShadow>
            <planeGeometry args={[1.3, 0.25]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      );

    case 'cone':
      return (
        <group>
          <mesh position={[0, 0.35, 0]} castShadow>
            <coneGeometry args={[0.25, 0.7, 12]} />
            <meshStandardMaterial color="#ea580c" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.6, 0.04, 0.6]} />
            <meshStandardMaterial color="#09090b" />
          </mesh>
        </group>
      );

    // ==========================================
    // 9. INFRASTRUKTUR
    // ==========================================
    case 'power-pole':
      if (color === '#78350f') return (
        <group>
          {/* Main pole */}
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.13, 8, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          {/* Crossarms */}
          {[5.5, 6.5, 7.2].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
              <boxGeometry args={[2.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </mesh>
          ))}
          {/* Insulators */}
          {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
            <mesh key={i} position={[x, 6.5, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 6]} />
              <meshStandardMaterial color="#ef4444" roughness={0.6} />
            </mesh>
          ))}
        </group>
      );
      // Regular cylinder/column
      return (
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.6, 4, 12]} />
          <meshStandardMaterial color={color || '#94a3b8'} roughness={0.7} />
        </mesh>
      );

    // ==========================================
    // FUEL TANK / TANGKI BAHAN BAKAR
    // ==========================================
      return (
        <group>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.18, 5.0, 8]} />
            <meshStandardMaterial color="#52525b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.6, 0]} castShadow>
            <boxGeometry args={[1.6, 0.12, 0.12]} />
            <meshStandardMaterial color="#3f3f46" />
          </mesh>
        </group>
      );

    case 'transformer':
      return (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.8, 1.5]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.2, 0.76]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>
      );

    case 'generator':
      return (
        <group>
          <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.5, 2.4]} />
            <meshStandardMaterial color={color || '#0284c7'} roughness={0.4} metalness={0.7} />
          </mesh>
        </group>
      );

    case 'water-tank':
      return (
        <group>
          {[-0.8, 0.8].map((x, xi) =>
            [-0.8, 0.8].map((z, zi) => (
              <mesh key={`${xi}-${zi}`} position={[x, 1.5, z]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, 3.0, 8]} />
                <meshStandardMaterial color="#475569" metalness={0.7} />
              </mesh>
            ))
          )}
          <mesh position={[0, 3.6, 0]} castShadow>
            <cylinderGeometry args={[1.4, 1.4, 1.8, 18]} />
            <meshStandardMaterial color={color || '#0ea5e9'} roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      );

    // ==========================================
    // TOWER CRANE 80m
    // ==========================================
    case 'tower-crane':
      return (
        <group>
          {/* Mast / Vertical Column */}
          {[...Array(12)].map((_, i) => (
            <group key={i} position={[0, i * 2.2, 0]}>
              <mesh position={[-0.18, 0, -0.18]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
                <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0.18, 0, -0.18]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
                <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[-0.18, 0, 0.18]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
                <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0.18, 0, 0.18]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
                <meshStandardMaterial color="#f97316" metalness={0.7} roughness={0.3} />
              </mesh>
              {/* Cross bracing */}
              <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI/4]} castShadow>
                <boxGeometry args={[0.5, 0.03, 0.03]} />
                <meshStandardMaterial color="#ea580c" metalness={0.6} />
              </mesh>
            </group>
          ))}
          {/* Operator Cabin */}
          <mesh position={[0, 26.5, 0]} castShadow>
            <boxGeometry args={[0.7, 0.9, 0.7]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Main Jib (Boom) - horizontal arm */}
          <mesh position={[4.5, 27.8, 0]} castShadow>
            <boxGeometry args={[9, 0.18, 0.18]} />
            <meshStandardMaterial color={color || '#f97316'} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Counter-jib (back arm) */}
          <mesh position={[-2.5, 27.6, 0]} castShadow>
            <boxGeometry args={[5, 0.16, 0.16]} />
            <meshStandardMaterial color={color || '#f97316'} metalness={0.6} />
          </mesh>
          {/* Counter weight */}
          <mesh position={[-4.5, 27.2, 0]} castShadow>
            <boxGeometry args={[1.2, 0.7, 0.7]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Hook rope */}
          <mesh position={[7, 24, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 8, 6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Hook */}
          <mesh position={[7, 20, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, 0.15]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Base platform */}
          <mesh position={[0, 0.3, 0]} receiveShadow>
            <boxGeometry args={[2.5, 0.6, 2.5]} />
            <meshStandardMaterial color="#374151" roughness={0.8} />
          </mesh>
          {/* Warning light */}
          <mesh position={[0, 29, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
        </group>
      );

    // ==========================================
    // DUMP TRUCK TANAH BESAR
    // ==========================================
    case 'scaffolding':
      return (
        <group>
          {/* Vertical poles */}
          {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z], i) =>
            [0, 1, 2, 3].map((level) => (
              <mesh key={`${i}-${level}`} position={[x as number, level * 1.5 + 0.75, z as number]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
            ))
          )}
          {/* Horizontal ledgers */}
          {[0.75, 2.25, 3.75, 5.25].map((y) => (
            <group key={y}>
              <mesh position={[0, y, -1]} rotation={[0, 0, Math.PI/2]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 2.1, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.6} />
              </mesh>
              <mesh position={[0, y, 1]} rotation={[0, 0, Math.PI/2]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 2.1, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.6} />
              </mesh>
              <mesh position={[-1, y, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 2.1, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.6} />
              </mesh>
              <mesh position={[1, y, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 2.1, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.6} />
              </mesh>
            </group>
          ))}
          {/* Planks */}
          {[1.5, 3.0, 4.5].map((y) => (
            <mesh key={y} position={[0, y + 0.05, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.1, 0.06, 2.1]} />
              <meshStandardMaterial color="#92400e" roughness={0.9} />
            </mesh>
          ))}
        </group>
      );

    // ==========================================
    // PILE DRIVER
    // ==========================================
    default:
      return (
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color || '#06b6d4'} roughness={0.4} />
        </mesh>
      );
  }
};
