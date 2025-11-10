import { useState } from 'react';
import type { PlayerInMatch } from '../types';

interface MatchRatingModalProps {
  players: PlayerInMatch[];
  onSubmit: (ratings: Record<string, number>) => void;
  onClose: () => void;
}

export default function MatchRatingModal({ players, onSubmit, onClose }: MatchRatingModalProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({});

  const handleRate = (playerId: string, rating: number) => {
    setRatings({ ...ratings, [playerId]: rating });
  };

  const handleSubmit = () => {
    onSubmit(ratings);
    onClose();
  };

  const sortedPlayers = [...players].sort((a, b) => a.playerNumber - b.playerNumber);
  const ratedCount = Object.keys(ratings).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">⭐ Maç Sonrası Değerlendirme</h2>
              <p className="text-yellow-100 mt-1">
                Oyunculara 1-5 yıldız verin ({ratedCount}/{players.length})
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

        {/* Player List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {sortedPlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz oyuncu eklenmemiş
            </div>
          ) : (
            <div className="space-y-4">
              {sortedPlayers.map((player) => (
                <div
                  key={player.playerId}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                        {player.playerNumber}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{player.playerName}</h3>
                        {ratings[player.playerId] > 0 && (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ {ratings[player.playerId]} yıldız verildi
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-2 justify-center bg-gray-50 p-4 rounded-lg">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const currentRating = ratings[player.playerId] || 0;
                      const hovered = hoveredRating[player.playerId] || 0;
                      const filled = star <= (hovered || currentRating);

                      return (
                        <button
                          key={star}
                          onClick={() => handleRate(player.playerId, star)}
                          onMouseEnter={() => setHoveredRating({ ...hoveredRating, [player.playerId]: star })}
                          onMouseLeave={() => setHoveredRating({ ...hoveredRating, [player.playerId]: 0 })}
                          className="text-5xl transition-transform hover:scale-110"
                        >
                          {filled ? '⭐' : '☆'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Daha Sonra
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              {ratedCount > 0 ? `✓ Kaydet (${ratedCount} oyuncu)` : 'Ratingler Olmadan Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
