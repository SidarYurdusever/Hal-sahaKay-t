import { useState } from 'react';

interface MatchInfoFormProps {
  onSubmit: (homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) => void;
  onClose: () => void;
}

export default function MatchInfoForm({ onSubmit, onClose }: MatchInfoFormProps) {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      homeTeam.trim() || 'Takımım',
      awayTeam.trim() || 'Rakip Takım',
      parseInt(homeScore) || 0,
      parseInt(awayScore) || 0
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🎯 Maç Bilgileri</h2>
              <p className="text-orange-100 mt-1">Takım isimleri ve skoru girin</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✖
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Takım İsimleri */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ev Sahibi Takım
              </label>
              <input
                type="text"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Takımım"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deplasman Takımı
              </label>
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Rakip Takım"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Skorlar */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Maç Skoru
            </label>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                placeholder="0"
                className="w-20 px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-3xl font-bold text-gray-400">:</span>
              <input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                placeholder="0"
                className="w-20 px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Boş bırakılan alanlar varsayılan değerlerle doldurulacak
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Devam Et →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
