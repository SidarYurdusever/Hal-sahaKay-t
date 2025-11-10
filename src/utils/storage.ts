import { ref, set, get, remove, update, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import type { Player, Match, ScheduledMatch, PlayerDatabase, SavedFormation } from '../types';

// Cache for immediate reads
let playersCache: Player[] = [];
let playerDatabaseCache: PlayerDatabase[] = [];
let matchesCache: Match[] = [];
let scheduledMatchesCache: ScheduledMatch[] = [];
let savedFormationsCache: SavedFormation[] = [];
let currentFormationCache: string | null = null;

// Initialize Firebase listeners
export const initializeFirebaseListeners = () => {
  // Players listener
  const playersRef = ref(database, 'players');
  onValue(playersRef, (snapshot) => {
    playersCache = snapshot.val() || [];
    localStorage.setItem('halisaha_players_cache', JSON.stringify(playersCache));
  });

  // Player Database listener
  const playerDbRef = ref(database, 'playerDatabase');
  onValue(playerDbRef, (snapshot) => {
    const data = snapshot.val();
    playerDatabaseCache = data ? Object.values(data) : [];
    localStorage.setItem('halisaha_player_database_cache', JSON.stringify(playerDatabaseCache));
  });

  // Matches listener
  const matchesRef = ref(database, 'matches');
  onValue(matchesRef, (snapshot) => {
    const data = snapshot.val();
    matchesCache = data ? Object.values(data) : [];
    localStorage.setItem('halisaha_matches_cache', JSON.stringify(matchesCache));
  });

  // Scheduled Matches listener
  const scheduledRef = ref(database, 'scheduledMatches');
  onValue(scheduledRef, (snapshot) => {
    const data = snapshot.val();
    scheduledMatchesCache = data ? Object.values(data) : [];
    localStorage.setItem('halisaha_scheduled_matches_cache', JSON.stringify(scheduledMatchesCache));
  });

  // Saved Formations listener
  const formationsRef = ref(database, 'savedFormations');
  onValue(formationsRef, (snapshot) => {
    const data = snapshot.val();
    savedFormationsCache = data ? Object.values(data) : [];
    localStorage.setItem('halisaha_saved_formations_cache', JSON.stringify(savedFormationsCache));
  });

  // Current Formation listener
  const currentFormationRef = ref(database, 'currentFormation');
  onValue(currentFormationRef, (snapshot) => {
    currentFormationCache = snapshot.val();
    if (currentFormationCache) {
      localStorage.setItem('halisaha_current_formation_cache', currentFormationCache);
    }
  });
};

// Oyuncu Yönetimi
export const savePlayers = async (players: Player[]): Promise<void> => {
  try {
    // Undefined değerleri temizle
    const cleanPlayers = players.map(p => {
      const cleanPlayer: any = {
        id: p.id,
        name: p.name,
        number: p.number,
        position: p.position,
      };
      if (p.photo) {
        cleanPlayer.photo = p.photo;
      }
      return cleanPlayer;
    });
    await set(ref(database, 'players'), cleanPlayers);
  } catch (error) {
    console.error('Oyuncular kaydedilemedi:', error);
  }
};

export const loadPlayers = (): Player[] => {
  return playersCache;
};

// Oyuncu Veritabanı Yönetimi
export const savePlayerToDatabase = async (player: Omit<PlayerDatabase, 'createdAt'>): Promise<PlayerDatabase> => {
  try {
    const dbRef = ref(database, 'playerDatabase');
    const snapshot = await get(dbRef);
    const database_players = snapshot.val() || {};
    
    const existingPlayer = Object.values(database_players).find((p: any) => p.id === player.id);
    
    if (existingPlayer) {
      await update(ref(database, `playerDatabase/${player.id}`), player);
      return existingPlayer as PlayerDatabase;
    } else {
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

export const loadPlayerDatabase = (): PlayerDatabase[] => {
  return playerDatabaseCache;
};

export const deletePlayerFromDatabase = async (playerId: string): Promise<void> => {
  try {
    // Noktalı ID'ler için güvenli silme
    // Firebase path'de nokta kullanılamaz, bu yüzden tüm database'i çekip filtreleyelim
    const dbRef = ref(database, 'playerDatabase');
    const snapshot = await get(dbRef);
    const allPlayers = snapshot.val() || {};
    
    // Player ID'yi bul ve sil
    const playerKey = Object.keys(allPlayers).find(key => {
      const player = allPlayers[key];
      return player.id === playerId;
    });
    
    if (playerKey) {
      await remove(ref(database, `playerDatabase/${playerKey}`));
    }
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

export const loadMatches = (): Match[] => {
  return matchesCache;
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

export const loadScheduledMatches = (): ScheduledMatch[] => {
  return scheduledMatchesCache;
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
    // Undefined değerleri temizle
    const cleanPlayers = formation.players.map(p => {
      const cleanPlayer: any = {
        id: p.id,
        name: p.name,
        number: p.number,
        position: p.position,
      };
      if (p.photo) {
        cleanPlayer.photo = p.photo;
      }
      return cleanPlayer;
    });

    const newFormation: SavedFormation = {
      ...formation,
      players: cleanPlayers as any,
      id: `formation-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      createdAt: new Date().toISOString(),
    };
    await set(ref(database, `savedFormations/${newFormation.id}`), newFormation);
    return newFormation;
  } catch (error) {
    console.error('Formasyon kaydedilemedi:', error);
    throw error;
  }
};

export const loadSavedFormations = (): SavedFormation[] => {
  return savedFormationsCache;
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

export const loadCurrentFormation = (): string | null => {
  return currentFormationCache;
};

// Tüm verileri temizle
export const clearAllData = async (): Promise<void> => {
  try {
    await set(ref(database, '/'), null);
    localStorage.clear();
  } catch (error) {
    console.error('Veriler temizlenemedi:', error);
  }
};
