import type { Player, Match, ScheduledMatch, PlayerDatabase, SavedFormation } from '../types';

const STORAGE_KEYS = {
  PLAYERS: 'halisaha_players',
  PLAYER_DATABASE: 'halisaha_player_database',
  MATCHES: 'halisaha_matches',
  SCHEDULED_MATCHES: 'halisaha_scheduled_matches',
  CURRENT_FORMATION: 'halisaha_current_formation',
  SAVED_FORMATIONS: 'halisaha_saved_formations',
} as const;

// Oyuncu yönetimi
export const savePlayers = (players: Player[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (error) {
    console.error('Oyuncular kaydedilemedi:', error);
  }
};

export const loadPlayers = (): Player[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Oyuncular yüklenemedi:', error);
    return [];
  }
};

// Maç yönetimi
export const saveMatch = (match: Match): void => {
  try {
    const matches = loadMatches();
    const existingIndex = matches.findIndex(m => m.id === match.id);
    
    if (existingIndex >= 0) {
      matches[existingIndex] = match;
    } else {
      matches.push(match);
    }
    
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  } catch (error) {
    console.error('Maç kaydedilemedi:', error);
  }
};

export const loadMatches = (): Match[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Maçlar yüklenemedi:', error);
    return [];
  }
};

export const deleteMatch = (matchId: string): void => {
  try {
    const matches = loadMatches().filter(m => m.id !== matchId);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  } catch (error) {
    console.error('Maç silinemedi:', error);
  }
};

// Aktif formasyon
export const saveCurrentFormation = (formationId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_FORMATION, formationId);
  } catch (error) {
    console.error('Formasyon kaydedilemedi:', error);
  }
};

export const loadCurrentFormation = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_FORMATION);
  } catch (error) {
    console.error('Formasyon yüklenemedi:', error);
    return null;
  }
};

// Oyuncu veritabanı yönetimi
export const savePlayerToDatabase = (player: Omit<PlayerDatabase, 'createdAt'>): PlayerDatabase => {
  try {
    const database = loadPlayerDatabase();
    const existingPlayer = database.find(p => p.id === player.id);
    
    if (existingPlayer) {
      // Güncelle
      const updated = database.map(p => p.id === player.id ? { ...p, ...player } : p);
      localStorage.setItem(STORAGE_KEYS.PLAYER_DATABASE, JSON.stringify(updated));
      return existingPlayer;
    } else {
      // Yeni ekle
      const newPlayer: PlayerDatabase = {
        ...player,
        createdAt: new Date().toISOString(),
      };
      database.push(newPlayer);
      localStorage.setItem(STORAGE_KEYS.PLAYER_DATABASE, JSON.stringify(database));
      return newPlayer;
    }
  } catch (error) {
    console.error('Oyuncu veritabanına kaydedilemedi:', error);
    return { ...player, createdAt: new Date().toISOString() };
  }
};

export const loadPlayerDatabase = (): PlayerDatabase[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYER_DATABASE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Oyuncu veritabanı yüklenemedi:', error);
    return [];
  }
};

export const deletePlayerFromDatabase = (playerId: string): void => {
  try {
    const database = loadPlayerDatabase().filter(p => p.id !== playerId);
    localStorage.setItem(STORAGE_KEYS.PLAYER_DATABASE, JSON.stringify(database));
  } catch (error) {
    console.error('Oyuncu veritabanından silinemedi:', error);
  }
};

export const updatePlayerInDatabase = (playerId: string, updates: Partial<PlayerDatabase>): void => {
  try {
    const database = loadPlayerDatabase().map(p => 
      p.id === playerId ? { ...p, ...updates } : p
    );
    localStorage.setItem(STORAGE_KEYS.PLAYER_DATABASE, JSON.stringify(database));
  } catch (error) {
    console.error('Oyuncu güncellenemedi:', error);
  }
};

// Planlanmış maç yönetimi
export const saveScheduledMatch = (match: ScheduledMatch): void => {
  try {
    const matches = loadScheduledMatches();
    const existingIndex = matches.findIndex(m => m.id === match.id);
    
    if (existingIndex >= 0) {
      matches[existingIndex] = match;
    } else {
      matches.push(match);
    }
    
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_MATCHES, JSON.stringify(matches));
  } catch (error) {
    console.error('Planlanmış maç kaydedilemedi:', error);
  }
};

export const loadScheduledMatches = (): ScheduledMatch[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_MATCHES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Planlanmış maçlar yüklenemedi:', error);
    return [];
  }
};

export const deleteScheduledMatch = (matchId: string): void => {
  try {
    const matches = loadScheduledMatches().filter(m => m.id !== matchId);
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_MATCHES, JSON.stringify(matches));
  } catch (error) {
    console.error('Planlanmış maç silinemedi:', error);
  }
};

// Kayıtlı formasyon yönetimi
export const saveSavedFormation = (formation: Omit<SavedFormation, 'id' | 'createdAt'>): SavedFormation => {
  try {
    const formations = loadSavedFormations();
    const newFormation: SavedFormation = {
      ...formation,
      id: `formation-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };
    formations.push(newFormation);
    localStorage.setItem(STORAGE_KEYS.SAVED_FORMATIONS, JSON.stringify(formations));
    return newFormation;
  } catch (error) {
    console.error('Formasyon kaydedilemedi:', error);
    throw error;
  }
};

export const loadSavedFormations = (): SavedFormation[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_FORMATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Formasyonlar yüklenemedi:', error);
    return [];
  }
};

export const deleteSavedFormation = (formationId: string): void => {
  try {
    const formations = loadSavedFormations().filter(f => f.id !== formationId);
    localStorage.setItem(STORAGE_KEYS.SAVED_FORMATIONS, JSON.stringify(formations));
  } catch (error) {
    console.error('Formasyon silinemedi:', error);
  }
};

// Tüm verileri temizle
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Veriler temizlenemedi:', error);
  }
};
