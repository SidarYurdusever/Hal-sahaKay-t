import { useState } from 'react';
import type { Player } from '../types';

interface PlayerFormProps {
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  playerCount: number;
  maxPlayers: number;
}

export default function PlayerForm({ onAddPlayer, playerCount, maxPlayers }: PlayerFormProps) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [photo, setPhoto] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !number) return;
    
    onAddPlayer({
      name: name.trim(),
      number: parseInt(number),
      photo: photo.trim() || undefined,
      position: { x: 50, y: 50 }, // Varsayılan pozisyon (orta)
    });
    
    // Formu temizle
    setName('');
    setNumber('');
    setPhoto('');
  };

  const isMaxReached = playerCount >= maxPlayers;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Oyuncu Ekle ({playerCount}/{maxPlayers})
      </h2>
      
      {isMaxReached ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          ⚠️ Maksimum oyuncu sayısına ulaştınız
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
              İsim *
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Oyuncu ismi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Numara *
            </label>
            <input
              id="playerNumber"
              type="number"
              min="1"
              max="99"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="1-99"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="playerPhoto" className="block text-sm font-medium text-gray-700 mb-1">
              Fotoğraf URL (Opsiyonel)
            </label>
            <input
              id="playerPhoto"
              type="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Fotoğraf yoksa numara gösterilecek
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            ➕ Oyuncu Ekle
          </button>
        </form>
      )}
    </div>
  );
}
