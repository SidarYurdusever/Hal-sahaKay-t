import { useState, useEffect } from 'react';
import type { SquadSize, Player } from './types';
import { getFormationsByPlayerCount, getFormationById } from './formations/formations';
import { savePlayers, loadPlayers } from './utils/storage';
import Field from './components/Field';
import PlayerForm from './components/PlayerForm';
import MatchDayView from './components/MatchDayView';
import ScoreTracker from './components/ScoreTracker';

type Page = 'setup' | 'matchday' | 'scores';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('setup');
  const [squadSize, setSquadSize] = useState<SquadSize>(7);
  const [selectedFormationId, setSelectedFormationId] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers());

  // Oyuncular değiştiğinde otomatik kaydet
  useEffect(() => {
    savePlayers(players);
  }, [players]);

  const squadSizes: SquadSize[] = [5, 6, 7, 8, 9, 10, 11];
  const availableFormations = getFormationsByPlayerCount(squadSize);
  const selectedFormation = selectedFormationId ? getFormationById(selectedFormationId) : null;

  const handleAddPlayer = (newPlayer: Omit<Player, 'id'>) => {
    const player: Player = {
      ...newPlayer,
      id: `player-${Date.now()}-${Math.random()}`,
    };
    setPlayers([...players, player]);
  };

  const handlePlayerMove = (playerId: string, x: number, y: number) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, position: { x, y } } : p
    ));
  };

  const handleApplyFormation = () => {
    if (!selectedFormation) return;
    
    const updatedPlayers = players.map((player, index) => {
      const position = selectedFormation.positions[index];
      if (position) {
        return { ...player, position };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
  };

  const handleResetSquad = () => {
    setPlayers([]);
    setSelectedFormationId('');
  };

  const handleShare = () => {
    // Basit paylaşım - URL kopyalama
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('🔗 URL panoya kopyalandı! Arkadaşlarınızla paylaşabilirsiniz.');
    }).catch(() => {
      alert('URL kopyalanamadı');
    });
  };

  // Maç günü modu için
  if (currentPage === 'matchday') {
    return (
      <MatchDayView
        players={players}
        formationName={selectedFormation?.name}
        onBack={() => setCurrentPage('setup')}
        onShare={handleShare}
      />
    );
  }

  // Skor takip sayfası
  if (currentPage === 'scores') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-4xl">⚽</span>
              Hal-sahaKay-t
            </h1>
            <button
              onClick={() => setCurrentPage('setup')}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Ana Sayfa
            </button>
          </div>
        </header>
        <ScoreTracker />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-4xl">⚽</span>
                Halısaha Kayıt
              </h1>
              <p className="text-gray-600 mt-1">Halısaha Kadro Düzenleme</p>
            </div>
            
            {/* Navigasyon Butonları */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage('scores')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                📊 Skor Takibi
              </button>
              
              {players.length > 0 && (
                <button
                  onClick={() => setCurrentPage('matchday')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ⚡ Maç Gününe Git
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Squad Size Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Kadro Boyutu Seçin
          </h2>
          <div className="flex flex-wrap gap-3">
            {squadSizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  setSquadSize(size);
                  setSelectedFormationId('');
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  squadSize === size
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size} Kişi
              </button>
            ))}
          </div>
        </div>

        {/* Formation Selector */}
        {availableFormations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Diziliş Seçin
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableFormations.map((formation) => (
                <button
                  key={formation.id}
                  onClick={() => setSelectedFormationId(formation.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedFormationId === formation.id
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow'
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-800">
                    {formation.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formation.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saha ve Oyuncu Yönetimi */}
        {selectedFormationId && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol: Oyuncu Formu */}
            <div className="lg:col-span-1 space-y-4">
              <PlayerForm 
                onAddPlayer={handleAddPlayer}
                playerCount={players.length}
                maxPlayers={squadSize}
              />
              
              {/* Eylem Butonları */}
              {players.length > 0 && (
                <div className="space-y-2">
                  {selectedFormation && players.length === squadSize && (
                    <button
                      onClick={handleApplyFormation}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      📐 Dizilişi Uygula
                    </button>
                  )}
                  
                  <button
                    onClick={handleResetSquad}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    🗑️ Kadroyu Sıfırla
                  </button>
                </div>
              )}
              
              {/* Oyuncu Listesi */}
              {players.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Kadro</h3>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {players.map((player) => (
                      <div key={player.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                          {player.number}
                        </span>
                        <span className="text-sm flex-1">{player.name}</span>
                        <button
                          onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sağ: Saha */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Saha Görünümü
                  </h2>
                  {players.length < squadSize && (
                    <span className="text-sm text-orange-600 font-medium">
                      {squadSize - players.length} oyuncu daha ekleyin
                    </span>
                  )}
                </div>
                
                <Field 
                  players={players}
                  onPlayerMove={handlePlayerMove}
                />
                
                <p className="text-sm text-gray-600 mt-4 text-center">
                  🖱️ Oyuncuları sürükleyerek konumlandırabilirsiniz
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        {!selectedFormationId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              👋 Hoş Geldiniz!
            </h3>
            <p className="text-blue-800">
              Başlamak için yukarıdan kadro boyutu ve diziliş seçin.
              Daha sonra oyuncuları ekleyip sahada konumlandırabileceksiniz.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Hal-sahaKay-t &copy; 2025 - Halısaha maçları için ücretsiz kadro düzenleme aracı</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
