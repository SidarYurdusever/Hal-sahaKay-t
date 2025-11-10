export interface Player {
  id: string;
  name: string;
  number: number;
  photo?: string;
  position: Position;
}

export interface PlayerInMatch {
  playerId: string;
  playerName: string;
  playerNumber: number;
  position: Position;
  rating?: number; // Bu maçtaki rating (1-5)
}

export interface PlayerDatabase {
  id: string;
  name: string;
  number: number;
  photo?: string;
  createdAt: string;
}

export interface Position {
  x: number; // 0-100 arası yüzde değeri
  y: number; // 0-100 arası yüzde değeri
}

export interface Formation {
  id: string;
  name: string;
  playerCount: number;
  positions: Position[];
  description?: string;
}

export interface Match {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  lineup: PlayerInMatch[]; // Maçtaki oyuncular ve ratingler
  isCompleted?: boolean;
}

export interface ScheduledMatch {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  lineup?: PlayerInMatch[];
  formationId?: string;
  attendanceVotes: AttendanceVote[];
  isCompleted: boolean;
  finalScore?: {
    home: number;
    away: number;
  };
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  totalMatches: number;
  averageRating: number;
  allRatings: number[];
}

export interface AttendanceVote {
  playerId: string;
  playerName: string;
  status: 'coming' | 'not-coming' | 'maybe';
  votedAt: string;
}

export interface SavedFormation {
  id: string;
  name: string;
  formationId: string;
  players: Player[];
  createdAt: string;
}

export type SquadSize = 5 | 6 | 7 | 8 | 9 | 10 | 11;
