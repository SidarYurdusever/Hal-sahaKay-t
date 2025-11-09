import { useState } from 'react';
import type { Player, PlayerDatabase } from '../types';
import { loadPlayerDatabase, deletePlayerFromDatabase } from '../utils/storage';

interface PlayerSelectorProps {
  onSelectPlayer: (player: Player) => void;
  onClose: () => void;
  excludeIds: string[];
}

export default function PlayerSelector({ onSelectPlayer, onClose, excludeIds }: PlayerSelectorProps) {
  const [database, setDatabase] = useState<PlayerDatabase[]>(() => loadPlayerDatabase());
  const [searchTerm, setSearchTerm] = useState('');

  const availablePlayers = database.filter(p => !excludeIds.includes(p.id));
  const filteredPlayers = availablePlayers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.number.toString().includes(searchTerm)
  );

  const handleSelect = (dbPlayer: PlayerDatabase) => {
    // Database'deki ID'yi koru!
    onSelectPlayer({
      id: dbPlayer.id,
      name: dbPlayer.name,
      number: dbPlayer.number,
      photo: dbPlayer.photo,
      position: { x: 50, y: 50 },
    });
    onClose();
  };

  const handleDelete = (playerId: string, playerName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Seçme işlemini engelle
    if (window.confirm(`${playerName} adlı oyuncuyu veritabanından silmek istediğinize emin misiniz?`)) {
      deletePlayerFromDatabase(playerId);
      setDatabase(prev => prev.filter(p => p.id !== playerId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Oyuncu Seç</h2>
              <p className="text-green-100 mt-1">
                Veritabanından kayıtlı oyunculardan seçin
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

        {/* Search */}
        <div className="p-4 border-b">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 İsim veya numara ile ara..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Player List */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {availablePlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">👥</div>
              <p>Henüz veritabanında oyuncu yok</p>
              <p className="text-sm mt-2">Yeni oyuncu ekleyerek başlayın</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">🔍</div>
              <p>"{searchTerm}" için sonuç bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-all group"
                >
                  <button
                    onClick={() => handleSelect(player)}
                    className="flex items-center gap-4 flex-1 text-left group-hover:bg-green-50 -m-4 p-4 rounded-l-lg"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {player.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{player.name}</h3>
                      <p className="text-sm text-gray-500">
                        Kayıt: {new Date(player.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-green-600 font-medium">
                      Seç →
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDelete(player.id, player.name, e)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
