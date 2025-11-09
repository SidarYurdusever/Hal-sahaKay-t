import { ref, set, get, remove, update, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import type { Player, Match, ScheduledMatch, PlayerDatabase, SavedFormation } from '../types';

// Oyuncu Yönetimi
export const savePlayers = async (players: Player[]): Promise<void> => {
  try {
    await set(ref(database, 'players'), players);
  } catch (error) {
    console.error('Oyuncular kaydedilemedi:', error);
  }
};

export const loadPlayers = (callback: (players: Player[]) => void): (() => void) => {
  const playersRef = ref(database, 'players');
  const unsubscribe = onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || []);
  });
  return unsubscribe;
};

// Oyuncu Veritabanı Yönetimi
export const savePlayerToDatabase = async (player: Omit<PlayerDatabase, 'createdAt'>): Promise<PlayerDatabase> => {
  try {
    const dbRef = ref(database, 'playerDatabase');
    const snapshot = await get(dbRef);
    const database_players = snapshot.val() || {};
    
    const existingPlayer = Object.values(database_players).find((p: any) => p.id === player.id);
    
    if (existingPlayer) {
      // Güncelle
      await update(ref(database, `playerDatabase/${player.id}`), player);
      return existingPlayer as PlayerDatabase;
    } else {
      // Yeni ekle
      const newPlayer: PlayerDatabase = {
        ...player,
        createdAt: new Date().toISOString(),
      };
      await set(ref(database, `playerDatabase/${player.id}`), newPlayer);
      return newPlayer;
    }
  } catch (error) {
    console.error('Oyuncu veritabanına kaydedilemedi:', error);
    return { ...player, createdAt: new Date().toISOString() };
  }
};

export const loadPlayerDatabase = (callback: (players: PlayerDatabase[]) => void): (() => void) => {
  const dbRef = ref(database, 'playerDatabase');
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    const players = data ? Object.values(data) : [];
    callback(players as PlayerDatabase[]);
  });
  return unsubscribe;
};

export const deletePlayerFromDatabase = async (playerId: string): Promise<void> => {
  try {
    await remove(ref(database, `playerDatabase/${playerId}`));
  } catch (error) {
    console.error('Oyuncu veritabanından silinemedi:', error);
  }
};

export const updatePlayerInDatabase = async (playerId: string, updates: Partial<PlayerDatabase>): Promise<void> => {
  try {
    await update(ref(database, `playerDatabase/${playerId}`), updates);
  } catch (error) {
    console.error('Oyuncu güncellenemedi:', error);
  }
};

// Maç Yönetimi
export const saveMatch = async (match: Match): Promise<void> => {
  try {
    await set(ref(database, `matches/${match.id}`), match);
  } catch (error) {
    console.error('Maç kaydedilemedi:', error);
  }
};

export const loadMatches = (callback: (matches: Match[]) => void): (() => void) => {
  const matchesRef = ref(database, 'matches');
  const unsubscribe = onValue(matchesRef, (snapshot) => {
    const data = snapshot.val();
    const matches = data ? Object.values(data) : [];
    callback(matches as Match[]);
  });
  return unsubscribe;
};

export const deleteMatch = async (matchId: string): Promise<void> => {
  try {
    await remove(ref(database, `matches/${matchId}`));
  } catch (error) {
    console.error('Maç silinemedi:', error);
  }
};

// Planlanmış Maç Yönetimi
export const saveScheduledMatch = async (match: ScheduledMatch): Promise<void> => {
  try {
    await set(ref(database, `scheduledMatches/${match.id}`), match);
  } catch (error) {
    console.error('Planlanmış maç kaydedilemedi:', error);
  }
};

export const loadScheduledMatches = (callback: (matches: ScheduledMatch[]) => void): (() => void) => {
  const matchesRef = ref(database, 'scheduledMatches');
  const unsubscribe = onValue(matchesRef, (snapshot) => {
    const data = snapshot.val();
    const matches = data ? Object.values(data) : [];
    callback(matches as ScheduledMatch[]);
  });
  return unsubscribe;
};

export const deleteScheduledMatch = async (matchId: string): Promise<void> => {
  try {
    await remove(ref(database, `scheduledMatches/${matchId}`));
  } catch (error) {
    console.error('Planlanmış maç silinemedi:', error);
  }
};

// Kayıtlı Formasyon Yönetimi
export const saveSavedFormation = async (formation: Omit<SavedFormation, 'id' | 'createdAt'>): Promise<SavedFormation> => {
  try {
    const newFormation: SavedFormation = {
      ...formation,
      id: `formation-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };
    await set(ref(database, `savedFormations/${newFormation.id}`), newFormation);
    return newFormation;
  } catch (error) {
    console.error('Formasyon kaydedilemedi:', error);
    throw error;
  }
};

export const loadSavedFormations = (callback: (formations: SavedFormation[]) => void): (() => void) => {
  const formationsRef = ref(database, 'savedFormations');
  const unsubscribe = onValue(formationsRef, (snapshot) => {
    const data = snapshot.val();
    const formations = data ? Object.values(data) : [];
    callback(formations as SavedFormation[]);
  });
  return unsubscribe;
};

export const deleteSavedFormation = async (formationId: string): Promise<void> => {
  try {
    await remove(ref(database, `savedFormations/${formationId}`));
  } catch (error) {
    console.error('Formasyon silinemedi:', error);
  }
};

// Aktif Formasyon
export const saveCurrentFormation = async (formationId: string): Promise<void> => {
  try {
    await set(ref(database, 'currentFormation'), formationId);
  } catch (error) {
    console.error('Formasyon kaydedilemedi:', error);
  }
};

export const loadCurrentFormation = async (): Promise<string | null> => {
  try {
    const snapshot = await get(ref(database, 'currentFormation'));
    return snapshot.val();
  } catch (error) {
    console.error('Formasyon yüklenemedi:', error);
    return null;
  }
};

// Tüm verileri temizle
export const clearAllData = async (): Promise<void> => {
  try {
    await set(ref(database, '/'), null);
  } catch (error) {
    console.error('Veriler temizlenemedi:', error);
  }
};
