import { useState } from 'react';
import type { Player } from '../types';

interface PlayerManagerProps {
  players: Player[];
  onUpdatePlayer: (playerId: string, updates: Partial<Player>) => void;
  onDeletePlayer: (playerId: string) => void;
  onClose: () => void;
}

export default function PlayerManager({ players, onUpdatePlayer, onDeletePlayer, onClose }: PlayerManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editPhoto, setEditPhoto] = useState('');

  const startEdit = (player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditNumber(player.number.toString());
    setEditPhoto(player.photo || '');
  };

  const saveEdit = (playerId: string) => {
    onUpdatePlayer(playerId, {
      name: editName.trim(),
      number: parseInt(editNumber),
      photo: editPhoto.trim() || undefined,
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditNumber('');
    setEditPhoto('');
  };

  const sortedPlayers = [...players].sort((a, b) => a.number - b.number);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">👥 Oyuncu Yönetimi</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✖
            </button>
          </div>
          <p className="text-blue-100 mt-1">{players.length} oyuncu</p>
        </div>

        {/* Player List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {sortedPlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz oyuncu eklenmemiş
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  {editingId === player.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            İsim
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Numara
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={editNumber}
                            onChange={(e) => setEditNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Fotoğraf URL
                        </label>
                        <input
                          type="url"
                          value={editPhoto}
                          onChange={(e) => setEditPhoto(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(player.id)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          ✓ Kaydet
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
                        >
                          ✖ İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {player.number}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{player.name}</h3>
                        <div className="text-sm text-gray-500">#{player.number}</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(player)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          ✏️ Düzenle
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`${player.name} oyuncusunu silmek istediğinizden emin misiniz?`)) {
                              onDeletePlayer(player.id);
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
