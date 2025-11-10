import type { Match } from '../types';

interface MatchDetailsProps {
  match: Match;
  onClose: () => void;
}

export default function MatchDetails({ match, onClose }: MatchDetailsProps) {
  const hasRatings = match.lineup.some(p => p.rating);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Maç Detayları</h2>
              <p className="text-purple-100 mt-1">
                {new Date(match.date).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✖
            </button>
          </div>
        </div>

        {/* Skor */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center flex-1">
              <div className="text-lg font-semibold text-gray-900">{match.homeTeam}</div>
            </div>
            <div className="bg-white px-8 py-4 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-gray-900">
                {match.homeScore ?? '-'} : {match.awayScore ?? '-'}
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="text-lg font-semibold text-gray-900">{match.awayTeam}</div>
            </div>
          </div>
        </div>

        {/* Oyuncu Listesi */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Kadro {hasRatings && '& Performans'}
          </h3>

          {!match.lineup || match.lineup.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Bu maç için kadro kaydı yok
            </div>
          ) : (
            <div className="space-y-3">
              {match.lineup
                .sort((a, b) => a.playerNumber - b.playerNumber)
                .map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Numara */}
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {player.playerNumber}
                    </div>

                    {/* İsim */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{player.playerName}</h4>
                      {player.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm text-gray-600">
                            {player.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rating Badge */}
                    {player.rating && (
                      <div className={`px-4 py-2 rounded-lg font-bold text-white ${
                        player.rating >= 4.5 ? 'bg-green-600' :
                        player.rating >= 4.0 ? 'bg-blue-600' :
                        player.rating >= 3.0 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}>
                        {player.rating >= 4.5 ? '🌟 Harika' :
                         player.rating >= 4.0 ? '👍 İyi' :
                         player.rating >= 3.0 ? '👌 Orta' :
                         '📉 Zayıf'}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* İstatistikler */}
          {hasRatings && (
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-700">
                  {(match.lineup.reduce((sum, p) => sum + (p.rating || 0), 0) / 
                    match.lineup.filter(p => p.rating).length).toFixed(2)}
                </div>
                <div className="text-xs text-yellow-600 mt-1">Ortalama Rating</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">
                  {Math.max(...match.lineup.map(p => p.rating || 0)).toFixed(1)}
                </div>
                <div className="text-xs text-green-600 mt-1">En Yüksek</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {match.lineup.filter(p => p.rating).length}
                </div>
                <div className="text-xs text-blue-600 mt-1">Değerlendirilen</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
