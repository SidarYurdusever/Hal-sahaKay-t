import { useState } from 'react';
import type { ScheduledMatch, AttendanceVote } from '../types';
import { saveScheduledMatch, loadScheduledMatches, deleteScheduledMatch } from '../utils/storage';

interface MatchCalendarProps {
  onBack: () => void;
}

export default function MatchCalendar({ onBack }: MatchCalendarProps) {
  const [matches, setMatches] = useState<ScheduledMatch[]>(loadScheduledMatches());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [location, setLocation] = useState('');

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();

    const newMatch: ScheduledMatch = {
      id: `scheduled-${Date.now()}`,
      title: title.trim(),
      date,
      time,
      location: location.trim() || undefined,
      attendanceVotes: [],
      isCompleted: false,
    };

    saveScheduledMatch(newMatch);
    setMatches(loadScheduledMatches());

    // Form temizle
    setTitle('');
    setDate('');
    setTime('19:00');
    setLocation('');
    setShowForm(false);
  };

  const handleVote = (matchId: string, playerName: string, status: AttendanceVote['status']) => {
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) return;

    const match = { ...matches[matchIndex] };
    const existingVoteIndex = match.attendanceVotes.findIndex(v => v.playerName === playerName);

    if (existingVoteIndex >= 0) {
      match.attendanceVotes[existingVoteIndex] = {
        ...match.attendanceVotes[existingVoteIndex],
        status,
        votedAt: new Date().toISOString(),
      };
    } else {
      match.attendanceVotes.push({
        playerId: `temp-${Date.now()}`,
        playerName,
        status,
        votedAt: new Date().toISOString(),
      });
    }

    saveScheduledMatch(match);
    setMatches(loadScheduledMatches());
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm('Bu maçı silmek istediğinizden emin misiniz?')) {
      deleteScheduledMatch(matchId);
      setMatches(loadScheduledMatches());
    }
  };

  const upcomingMatches = matches
    .filter(m => !m.isCompleted && new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastMatches = matches
    .filter(m => m.isCompleted || new Date(m.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 font-medium mb-2 flex items-center gap-1"
              >
                ← Ana Sayfa
              </button>
              <h1 className="text-3xl font-bold text-gray-900">📅 Maç Takvimi</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {showForm ? '✖ İptal' : '➕ Maç Planla'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Maç Planlama Formu */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Maç Planla</h2>
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maç Başlığı *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Çarşamba Halısaha"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saat *
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konum (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Örn: Spor Kompleksi Saha 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Maçı Oluştur
              </button>
            </form>
          </div>
        )}

        {/* Yaklaşan Maçlar */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yaklaşan Maçlar</h2>
          {upcomingMatches.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              Henüz planlanmış maç yok
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onVote={handleVote}
                  onDelete={handleDeleteMatch}
                />
              ))}
            </div>
          )}
        </div>

        {/* Geçmiş Maçlar */}
        {pastMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Geçmiş Maçlar</h2>
            <div className="space-y-4">
              {pastMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onVote={handleVote}
                  onDelete={handleDeleteMatch}
                  isPast
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface MatchCardProps {
  match: ScheduledMatch;
  onVote: (matchId: string, playerName: string, status: AttendanceVote['status']) => void;
  onDelete: (matchId: string) => void;
  isPast?: boolean;
}

function MatchCard({ match, onVote, onDelete, isPast }: MatchCardProps) {
  const [voterName, setVoterName] = useState('');
  const [showVoteForm, setShowVoteForm] = useState(false);

  const comingCount = match.attendanceVotes.filter(v => v.status === 'coming').length;
  const notComingCount = match.attendanceVotes.filter(v => v.status === 'not-coming').length;
  const maybeCount = match.attendanceVotes.filter(v => v.status === 'maybe').length;

  const handleVoteSubmit = (status: AttendanceVote['status']) => {
    if (!voterName.trim()) return;
    onVote(match.id, voterName.trim(), status);
    setVoterName('');
    setShowVoteForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{match.title}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>📅 {new Date(match.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>🕐 {match.time}</p>
            {match.location && <p>📍 {match.location}</p>}
          </div>
        </div>
        <button
          onClick={() => onDelete(match.id)}
          className="text-red-600 hover:text-red-700 p-2"
          title="Sil"
        >
          🗑️
        </button>
      </div>

      {/* Katılım İstatistikleri */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{comingCount}</div>
          <div className="text-xs text-green-600">✅ Gelecek</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-700">{notComingCount}</div>
          <div className="text-xs text-red-600">❌ Gelemeyecek</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-700">{maybeCount}</div>
          <div className="text-xs text-yellow-600">❓ Bilmiyorum</div>
        </div>
      </div>

      {/* Oy Listesi */}
      {match.attendanceVotes.length > 0 && (
        <div className="mb-4 max-h-40 overflow-y-auto">
          <div className="space-y-1">
            {match.attendanceVotes.map((vote, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                <span className="text-lg">
                  {vote.status === 'coming' ? '✅' : vote.status === 'not-coming' ? '❌' : '❓'}
                </span>
                <span className="font-medium">{vote.playerName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Oy Verme */}
      {!isPast && (
        <div>
          {showVoteForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                placeholder="Adınız"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleVoteSubmit('coming')}
                  className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  ✅ Gelirim
                </button>
                <button
                  onClick={() => handleVoteSubmit('not-coming')}
                  className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  ❌ Gelemem
                </button>
                <button
                  onClick={() => handleVoteSubmit('maybe')}
                  className="bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 text-sm"
                >
                  ❓ Bilmiyorum
                </button>
              </div>
              <button
                onClick={() => setShowVoteForm(false)}
                className="w-full text-gray-600 hover:text-gray-800 text-sm"
              >
                İptal
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowVoteForm(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🗳️ Katılım Durumumu Belirt
            </button>
          )}
        </div>
      )}
    </div>
  );
}
