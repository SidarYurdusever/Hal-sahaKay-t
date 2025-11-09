import { useState } from 'react';
import type { Match } from '../types';
import { saveMatch, loadMatches, deleteMatch } from '../utils/storage';
import MatchDetails from './MatchDetails';
import MatchRatingModal from './MatchRatingModal';

export default function ScoreTracker() {
  const [matches, setMatches] = useState<Match[]>(loadMatches());
  const [showForm, setShowForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [ratingMatch, setRatingMatch] = useState<Match | null>(null);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      date: new Date().toISOString(),
      homeTeam: homeTeam.trim(),
      awayTeam: awayTeam.trim(),
      homeScore: homeScore ? parseInt(homeScore) : undefined,
      awayScore: awayScore ? parseInt(awayScore) : undefined,
      lineup: [], // Şimdilik boş, ileride kadro bağlantısı eklenebilir
    };

    saveMatch(newMatch);
    setMatches(loadMatches()); // Sadece storage'dan yükle

    // Formu temizle
    setHomeTeam('');
    setAwayTeam('');
    setHomeScore('');
    setAwayScore('');
    setShowForm(false);
  };

  const handleDeleteMatch = (matchId: string) => {
    if (confirm('Bu maçı silmek istediğinizden emin misiniz?')) {
      deleteMatch(matchId);
      setMatches(loadMatches());
    }
  };

  const handleRatingSubmit = (ratings: Record<string, number>) => {
    if (!ratingMatch) return;

    const updatedLineup = ratingMatch.lineup.map(player => ({
      ...player,
      rating: ratings[player.playerId] || player.rating,
    }));

    const updatedMatch: Match = {
      ...ratingMatch,
      lineup: updatedLineup,
    };

    saveMatch(updatedMatch);
    setMatches(loadMatches());
    setRatingMatch(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">📊 Maç Skorları</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {showForm ? '✖ İptal' : '➕ Maç Ekle'}
          </button>
        </div>

        {/* Maç Ekleme Formu */}
        {showForm && (
          <form onSubmit={handleAddMatch} className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ev Sahibi Takım *
                </label>
                <input
                  type="text"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  placeholder="Takım adı"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deplasman Takımı *
                </label>
                <input
                  type="text"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  placeholder="Takım adı"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ev Sahibi Skor
                </label>
                <input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deplasman Skor
                </label>
                <input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Kaydet
            </button>
          </form>
        )}

        {/* Maç Listesi */}
        {matches.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">📝 Henüz maç kaydı yok</p>
            <p className="text-sm">Yeni maç eklemek için yukarıdaki butona tıklayın</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(match.date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-right">
                        <span className="font-semibold text-gray-800">{match.homeTeam}</span>
                      </div>
                      <div className="px-6 py-2 bg-gray-100 rounded-lg mx-4">
                        <span className="text-xl font-bold text-gray-900">
                          {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">{match.awayTeam}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {match.lineup && match.lineup.length > 0 && (
                      <>
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                          title="Detaylar"
                        >
                          📄 Detaylar
                        </button>
                        <button
                          onClick={() => setRatingMatch(match)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                          title="Rating Ver/Düzenle"
                        >
                          ⭐ Rating
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Sil"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchDetails
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {/* Rating Modal */}
      {ratingMatch && ratingMatch.lineup && (
        <MatchRatingModal
          players={ratingMatch.lineup}
          onSubmit={handleRatingSubmit}
          onClose={() => setRatingMatch(null)}
        />
      )}
    </div>
  );
}
