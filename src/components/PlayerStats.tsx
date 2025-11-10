import { useState, useMemo } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import type { PlayerStats, Match } from '../types';
import { deletePlayerFromDatabase } from '../utils/storage';

interface PlayerStatsProps {
  onBack: () => void;
}

export default function PlayerStatsPage({ onBack }: PlayerStatsProps) {
  const [matches, setMatches] = useState<Match[]>([]);

  // Firebase'den maçları dinle
  useMemo(() => {
    const matchesRef = ref(database, 'matches');
    const unsubscribe = onValue(matchesRef, (snapshot) => {
      const data = snapshot.val();
      const matchesList = data ? Object.values(data) : [];
      setMatches(matchesList as Match[]);
    });

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const playerMap = new Map<string, PlayerStats>();

    matches.forEach(match => {
      if (match.lineup) {
        match.lineup.forEach(player => {
          // playerId'ye göre grupla (aynı oyuncu)
          const existing = playerMap.get(player.playerId);
          
          if (player.rating) {
            if (existing) {
              // Var olan oyuncuya rating ekle
              existing.allRatings.push(player.rating);
              existing.totalMatches++;
              existing.averageRating = 
                existing.allRatings.reduce((a, b) => a + b, 0) / existing.allRatings.length;
            } else {
              // Yeni oyuncu
              playerMap.set(player.playerId, {
                playerId: player.playerId,
                playerName: player.playerName,
                totalMatches: 1,
                averageRating: player.rating,
                allRatings: [player.rating],
              });
            }
          } else if (!existing) {
            // Rating olmasa bile oyuncuyu say (maça katıldı)
            playerMap.set(player.playerId, {
              playerId: player.playerId,
              playerName: player.playerName,
              totalMatches: 1,
              averageRating: 0,
              allRatings: [],
            });
          } else {
            // Rating olmadan maç sayısını artır
            existing.totalMatches++;
          }
        });
      }
    });

    // Sadece rating alan oyuncuları sırala
    return Array.from(playerMap.values())
      .filter(p => p.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating);
  }, [matches]);

  const handleDeletePlayer = async (playerId: string, playerName: string) => {
    if (window.confirm(`${playerName} adlı oyuncuyu istatistiklerden kaldırmak istediğinize emin misiniz?\n\nBu oyuncunun veritabanı kaydı da silinecek.`)) {
      await deletePlayerFromDatabase(playerId);
      alert('✅ Oyuncu silindi!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium mb-2 flex items-center gap-1"
          >
            ← Ana Sayfa
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-4xl">📈</span>
            Oyuncu İstatistikleri
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Tüm maçların ortalaması</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {stats.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Henüz İstatistik Yok
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Maç tamamlandıktan ve oyunculara rating verildikten sonra istatistikler burada görünecek
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h2 className="text-2xl font-bold">Genel Sıralama</h2>
              <p className="text-blue-100 mt-1">{stats.length} oyuncu</p>
            </div>

            <div className="divide-y dark:divide-gray-700">
              {stats.map((player, index) => (
                <div key={player.playerId} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Sıra */}
                    <div className={`text-3xl font-bold w-12 text-center ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-orange-600' :
                      'text-gray-400'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>

                    {/* Oyuncu Bilgisi */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {player.playerName}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {player.totalMatches} maç oynadı
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-3xl">⭐</span>
                        <span className="text-3xl font-bold text-yellow-600">
                          {player.averageRating.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {player.allRatings.length} maçta değerlendirildi
                      </div>
                    </div>

                    {/* Sil Butonu */}
                    <button
                      onClick={() => handleDeletePlayer(player.playerId, player.playerName)}
                      className="ml-4 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Oyuncuyu Sil"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Rating Dağılımı */}
                  <div className="mt-4 flex gap-1">
                    {player.allRatings.map((rating, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-2 rounded-full"
                        style={{
                          backgroundColor: `hsl(${rating * 24}, 70%, 50%)`,
                        }}
                        title={`Maç ${idx + 1}: ${rating} ⭐`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* İstatistik Kartları */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats[0]?.playerName || '-'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">En Yüksek Ortalama</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(stats.reduce((acc, p) => acc + p.averageRating, 0) / stats.length).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Genel Ortalama</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.reduce((acc, p) => acc + p.totalMatches, 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Toplam Maç</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
