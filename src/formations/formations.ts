import type { Formation } from '../types';

// Halısaha için yaygın formasyonlar
export const formations: Formation[] = [
  // 5 kişilik (1-2-1)
  {
    id: '5-1-2-1',
    name: '1-2-1',
    playerCount: 5,
    description: 'Klasik 5 kişilik diziliş',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 30, y: 40 },  // Sol defans
      { x: 70, y: 40 },  // Sağ defans
      { x: 50, y: 70 },  // Forvet
      { x: 50, y: 55 },  // Orta saha
    ],
  },
  
  // 6 kişilik (1-2-2)
  {
    id: '6-1-2-2',
    name: '1-2-2',
    playerCount: 6,
    description: '6 kişilik dengeli diziliş',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 30, y: 35 },  // Sol defans
      { x: 70, y: 35 },  // Sağ defans
      { x: 35, y: 60 },  // Sol forvet
      { x: 65, y: 60 },  // Sağ forvet
      { x: 50, y: 47 },  // Orta saha
    ],
  },

  // 7 kişilik (1-2-3)
  {
    id: '7-1-2-3',
    name: '1-2-3',
    playerCount: 7,
    description: '7 kişilik hücum ağırlıklı',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 30, y: 30 },  // Sol defans
      { x: 70, y: 30 },  // Sağ defans
      { x: 25, y: 60 },  // Sol kanat
      { x: 50, y: 65 },  // Orta forvet
      { x: 75, y: 60 },  // Sağ kanat
      { x: 50, y: 45 },  // Orta saha
    ],
  },

  // 7 kişilik (1-3-2)
  {
    id: '7-1-3-2',
    name: '1-3-2',
    playerCount: 7,
    description: '7 kişilik savunma ağırlıklı',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 25, y: 35 },  // Sol defans
      { x: 50, y: 32 },  // Stoper
      { x: 75, y: 35 },  // Sağ defans
      { x: 35, y: 60 },  // Sol forvet
      { x: 65, y: 60 },  // Sağ forvet
      { x: 50, y: 50 },  // Orta saha
    ],
  },

  // 8 kişilik (1-2-3-1)
  {
    id: '8-1-2-3-1',
    name: '1-2-3-1',
    playerCount: 8,
    description: '8 kişilik klasik diziliş',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 30, y: 28 },  // Sol defans
      { x: 70, y: 28 },  // Sağ defans
      { x: 25, y: 50 },  // Sol orta saha
      { x: 50, y: 48 },  // Merkez orta saha
      { x: 75, y: 50 },  // Sağ orta saha
      { x: 50, y: 70 },  // Forvet
      { x: 50, y: 38 },  // Defansif orta saha
    ],
  },

  // 9 kişilik (1-3-2-3)
  {
    id: '9-1-3-2-3',
    name: '1-3-2-3',
    playerCount: 9,
    description: '9 kişilik dengeli diziliş',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 25, y: 30 },  // Sol defans
      { x: 50, y: 28 },  // Stoper
      { x: 75, y: 30 },  // Sağ defans
      { x: 35, y: 50 },  // Sol orta saha
      { x: 65, y: 50 },  // Sağ orta saha
      { x: 25, y: 68 },  // Sol forvet
      { x: 50, y: 70 },  // Santrafor
      { x: 75, y: 68 },  // Sağ forvet
    ],
  },

  // 10 kişilik (1-3-3-2)
  {
    id: '10-1-3-3-2',
    name: '1-3-3-2',
    playerCount: 10,
    description: '10 kişilik kompakt diziliş',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 25, y: 28 },  // Sol defans
      { x: 50, y: 26 },  // Stoper
      { x: 75, y: 28 },  // Sağ defans
      { x: 25, y: 48 },  // Sol orta saha
      { x: 50, y: 46 },  // Merkez orta saha
      { x: 75, y: 48 },  // Sağ orta saha
      { x: 35, y: 65 },  // Sol forvet
      { x: 65, y: 65 },  // Sağ forvet
      { x: 50, y: 36 },  // Defansif orta saha
    ],
  },

  // 11 kişilik (1-4-3-3)
  {
    id: '11-1-4-3-3',
    name: '1-4-3-3',
    playerCount: 11,
    description: 'Klasik 11 kişi - Hücum ağırlıklı',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 20, y: 28 },  // Sol bek
      { x: 40, y: 26 },  // Sol stoper
      { x: 60, y: 26 },  // Sağ stoper
      { x: 80, y: 28 },  // Sağ bek
      { x: 30, y: 48 },  // Sol orta saha
      { x: 50, y: 46 },  // Merkez orta saha
      { x: 70, y: 48 },  // Sağ orta saha
      { x: 20, y: 68 },  // Sol kanat
      { x: 50, y: 70 },  // Santrafor
      { x: 80, y: 68 },  // Sağ kanat
    ],
  },

  // 11 kişilik (1-4-4-2)
  {
    id: '11-1-4-4-2',
    name: '1-4-4-2',
    playerCount: 11,
    description: 'Klasik 11 kişi - Dengeli diziliş',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 20, y: 28 },  // Sol bek
      { x: 40, y: 26 },  // Sol stoper
      { x: 60, y: 26 },  // Sağ stoper
      { x: 80, y: 28 },  // Sağ bek
      { x: 20, y: 48 },  // Sol orta saha
      { x: 40, y: 46 },  // Sol merkez orta saha
      { x: 60, y: 46 },  // Sağ merkez orta saha
      { x: 80, y: 48 },  // Sağ orta saha
      { x: 40, y: 68 },  // Sol forvet
      { x: 60, y: 68 },  // Sağ forvet
    ],
  },

  // 11 kişilik (1-3-5-2)
  {
    id: '11-1-3-5-2',
    name: '1-3-5-2',
    playerCount: 11,
    description: 'Klasik 11 kişi - Orta saha ağırlıklı',
    positions: [
      { x: 50, y: 10 },  // Kaleci
      { x: 30, y: 26 },  // Sol stoper
      { x: 50, y: 24 },  // Libero
      { x: 70, y: 26 },  // Sağ stoper
      { x: 15, y: 48 },  // Sol kanat orta saha
      { x: 35, y: 46 },  // Sol orta saha
      { x: 50, y: 44 },  // Merkez orta saha
      { x: 65, y: 46 },  // Sağ orta saha
      { x: 85, y: 48 },  // Sağ kanat orta saha
      { x: 40, y: 68 },  // Sol forvet
      { x: 60, y: 68 },  // Sağ forvet
    ],
  },
];

export const getFormationsByPlayerCount = (count: number): Formation[] => {
  return formations.filter(f => f.playerCount === count);
};

export const getFormationById = (id: string): Formation | undefined => {
  return formations.find(f => f.id === id);
};
