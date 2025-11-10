import type { Player } from '../types';
import Field from './Field';

interface MatchDayViewProps {
  players: Player[];
  formationName?: string;
  onBack: () => void;
  onShare: () => void;
}

export default function MatchDayView({ players, formationName, onBack, onShare }: MatchDayViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-2"
            >
              ← Düzenlemeye Dön
            </button>
            <button
              onClick={onShare}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔗 Paylaş
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚽ Maç Günü Kadrosu
            </h1>
            {formationName && (
              <p className="text-lg text-gray-600">Diziliş: {formationName}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {players.length} Oyuncu
            </p>
          </div>
        </div>

        {/* Saha */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Field players={players} />
        </div>

        {/* Oyuncu Listesi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kadro Listesi</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {players
              .sort((a, b) => a.number - b.number)
              .map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {player.number}
                  </div>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {player.name}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Yazdır butonu */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            🖨️ Yazdır
          </button>
        </div>
      </div>
    </div>
  );
}
