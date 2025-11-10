import { useState, useEffect } from 'react';
import type { SquadSize, Player, PlayerInMatch, Match, SavedFormation } from './types';
import { getFormationsByPlayerCount, getFormationById } from './formations/formations';
import { savePlayers, loadPlayers, savePlayerToDatabase, saveMatch, saveSavedFormation, loadMatches } from './utils/storage';
import HomePage from './components/HomePage';
import MatchCalendar from './components/MatchCalendar';
import Field from './components/Field';
import PlayerForm from './components/PlayerForm';
import MatchDayView from './components/MatchDayView';
import ScoreTracker from './components/ScoreTracker';
import PlayerManager from './components/PlayerManager';
import PlayerStatsPage from './components/PlayerStats';
import PlayerSelector from './components/PlayerSelector';
import MatchRatingModal from './components/MatchRatingModal';
import MatchInfoForm from './components/MatchInfoForm';
import SaveFormationModal from './components/SaveFormationModal';
import LoadFormationModal from './components/LoadFormationModal';

type Page = 'home' | 'create-match' | 'calendar' | 'scores' | 'matchday' | 'stats';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [squadSize, setSquadSize] = useState<SquadSize>(7);
  const [selectedFormationId, setSelectedFormationId] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers());
  const [showPlayerManager, setShowPlayerManager] = useState(false);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [showMatchRating, setShowMatchRating] = useState(false);
  const [showMatchInfoForm, setShowMatchInfoForm] = useState(false);
  const [showSaveFormation, setShowSaveFormation] = useState(false);
  const [showLoadFormation, setShowLoadFormation] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<Match | null>(null);

  // Browser history yönetimi (geri tuşu için)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { page: Page } | null;
      if (state?.page) {
        setCurrentPage(state.page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // İlk yükleme - mevcut URL'i history'ye ekle
    if (!window.history.state) {
      window.history.replaceState({ page: 'home' }, '', window.location.href);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sayfa değiştirme fonksiyonu (history'ye ekle)
  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    window.history.pushState({ page }, '', `#${page}`);
  };

  // Oyuncular değiştiğinde otomatik kaydet
  useEffect(() => {
    savePlayers(players);
  }, [players]);

  const squadSizes: SquadSize[] = [5, 6, 7, 8, 9, 10, 11];
  const availableFormations = getFormationsByPlayerCount(squadSize);
  const selectedFormation = selectedFormationId ? getFormationById(selectedFormationId) : null;

  const handleAddPlayer = async (newPlayer: Omit<Player, 'id'> | Player) => {
    let player: Player;
    
    // Eğer ID varsa (database'den seçilmişse), kullan
    if ('id' in newPlayer && newPlayer.id) {
      player = newPlayer as Player;
    } else {
      // Yeni oyuncu, ID oluştur
      player = {
        ...newPlayer,
        id: `player-${Date.now()}-${Math.random()}`,
      };
      
      // Sadece yeni oyuncuyu veritabanına ekle
      await savePlayerToDatabase({
        id: player.id,
        name: player.name,
        number: player.number,
        photo: player.photo,
      });
    }
    
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
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('🔗 URL panoya kopyalandı! Arkadaşlarınızla paylaşabilirsiniz.');
    }).catch(() => {
      alert('URL kopyalanamadı');
    });
  };

  const handleUpdatePlayer = (playerId: string, updates: Partial<Player>) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, ...updates } : p
    ));
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handlePrepareMatch = () => {
    // Önce maç bilgileri formunu aç
    setShowMatchInfoForm(true);
  };

  const handleMatchInfoSubmit = (homeTeam: string, awayTeam: string, homeScore: number, awayScore: number) => {
    // Oyuncuları PlayerInMatch formatına çevir
    const lineup: PlayerInMatch[] = players.map(p => ({
      playerId: p.id,
      playerName: p.name,
      playerNumber: p.number,
      position: p.position,
    }));

    // Maç oluştur
    const match: Match = {
      id: `match-${Date.now()}`,
      date: new Date().toISOString(),
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      lineup,
      isCompleted: false,
    };

    setPendingMatch(match);
    setShowMatchInfoForm(false);
    setShowMatchRating(true);
  };

  const handleSubmitRatings = (ratings: Record<string, number>) => {
    if (!pendingMatch) return;

    // Mevcut maçı yükle (başka biri rating vermiş olabilir)
    const existingMatches = loadMatches();
    const existingMatch = existingMatches.find(m => m.id === pendingMatch.id);

    let updatedLineup: PlayerInMatch[];

    if (existingMatch && existingMatch.lineup) {
      // Mevcut ratings'leri koru, yeni ratings'leri ekle/güncelle
      updatedLineup = pendingMatch.lineup.map(player => {
        const existingPlayer = existingMatch.lineup.find(p => p.playerId === player.playerId);
        const newRating = ratings[player.playerId];
        
        // Eğer mevcut rating varsa ve yeni rating varsa, ortalama al
        if (existingPlayer?.rating && newRating) {
          return {
            ...player,
            rating: (existingPlayer.rating + newRating) / 2,
          };
        }
        
        // Sadece yeni rating varsa onu kullan
        if (newRating) {
          return { ...player, rating: newRating };
        }
        
        // Mevcut rating'i koru
        if (existingPlayer?.rating) {
          return { ...player, rating: existingPlayer.rating };
        }
        
        return player;
      });
    } else {
      // İlk kez rating veriliyor
      updatedLineup = pendingMatch.lineup.map(player => ({
        ...player,
        rating: ratings[player.playerId] || undefined,
      }));
    }

    const completedMatch: Match = {
      ...pendingMatch,
      lineup: updatedLineup,
      isCompleted: true,
    };

    // Maçı kaydet
    saveMatch(completedMatch);

    // Temizle ve skorlar sayfasına git
    setPendingMatch(null);
    setPlayers([]);
    setSelectedFormationId('');
    navigateToPage('scores');

    alert('✅ Maç başarıyla kaydedildi!');
  };

  const handleSaveFormation = (name: string) => {
    if (!selectedFormationId || players.length === 0) return;

    try {
      saveSavedFormation({
        name,
        formationId: selectedFormationId,
        players,
      });
      alert(`✅ "${name}" formasyonu kaydedildi!`);
    } catch (error) {
      alert('❌ Formasyon kaydedilemedi!');
    }
  };

  const handleLoadFormation = (formation: SavedFormation) => {
    setSquadSize(formation.players.length as SquadSize);
    setSelectedFormationId(formation.formationId);
    setPlayers(formation.players);
    setShowLoadFormation(false);
    alert(`✅ "${formation.name}" formasyonu yüklendi!`);
  };

  // Ana Sayfa
  if (currentPage === 'home') {
    return (
      <HomePage
        onCreateMatch={() => navigateToPage('create-match')}
        onViewCalendar={() => navigateToPage('calendar')}
        onViewScores={() => navigateToPage('scores')}
        onViewStats={() => navigateToPage('stats')}
      />
    );
  }

  // İstatistikler
  if (currentPage === 'stats') {
    return <PlayerStatsPage onBack={() => navigateToPage('home')} />;
  }

  // Maç Takvimi
  if (currentPage === 'calendar') {
    return <MatchCalendar onBack={() => navigateToPage('home')} />;
  }

  // Maç günü modu
  if (currentPage === 'matchday') {
    return (
      <MatchDayView
        players={players}
        formationName={selectedFormation?.name}
        onBack={() => navigateToPage('create-match')}
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
              Halısaha Kayıt
            </h1>
            <button
              onClick={() => navigateToPage('home')}
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

  // Kadro Oluşturma Sayfası (create-match)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={() => navigateToPage('home')}
                className="text-gray-600 hover:text-gray-800 font-medium mb-2 flex items-center gap-1"
              >
                ← Ana Sayfa
              </button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-4xl">⚽</span>
                Kadro Oluştur
              </h1>
            </div>
            
            {players.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigateToPage('matchday')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ⚡ Maç Gününe Git
                </button>
                <button
                  onClick={handlePrepareMatch}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  🎯 Maça Hazırlan
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Kadro Boyutu */}
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

        {/* Diziliş Seçimi */}
        {availableFormations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Diziliş Seçin
              </h2>
              <button
                onClick={() => setShowLoadFormation(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                📂 Kayıtlı Formasyonlar
              </button>
            </div>
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
              
              {/* Veritabanından Seç Butonu */}
              {players.length < squadSize && (
                <button
                  onClick={() => setShowPlayerSelector(true)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  📂 Veritabanından Seç
                </button>
              )}
              
              {/* Eylem Butonları */}
              {players.length > 0 && (
                <div className="space-y-2">
                  {selectedFormation && players.length === squadSize && (
                    <>
                      <button
                        onClick={handleApplyFormation}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        📐 Dizilişi Uygula
                      </button>
                      
                      <button
                        onClick={() => setShowSaveFormation(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                      >
                        💾 Formasyonu Kaydet
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setShowPlayerManager(true)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    👥 Oyuncuları Yönet
                  </button>
                  
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

        {/* İlk Adım Bilgisi */}
        {!selectedFormationId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              👋 Kadro Oluşturmaya Başlayın!
            </h3>
            <p className="text-blue-800">
              Yukarıdan kadro boyutu ve diziliş seçerek başlayın.
              Daha sonra oyuncular ekleyip sahada konumlandırabileceksiniz.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>Halısaha Kayıt © 2025 Sidar tarafından üretilmiştir</p>
        </div>
      </footer>

      {/* Modal'lar */}
      {showPlayerManager && (
        <PlayerManager
          players={players}
          onUpdatePlayer={handleUpdatePlayer}
          onDeletePlayer={handleDeletePlayer}
          onClose={() => setShowPlayerManager(false)}
        />
      )}

      {showPlayerSelector && (
        <PlayerSelector
          onSelectPlayer={handleAddPlayer}
          onClose={() => setShowPlayerSelector(false)}
          excludeIds={players.map(p => p.id)}
        />
      )}

      {showMatchInfoForm && (
        <MatchInfoForm
          onSubmit={handleMatchInfoSubmit}
          onClose={() => setShowMatchInfoForm(false)}
        />
      )}

      {showMatchRating && pendingMatch && (
        <MatchRatingModal
          players={pendingMatch.lineup}
          onSubmit={handleSubmitRatings}
          onClose={() => {
            setShowMatchRating(false);
            setPendingMatch(null);
          }}
        />
      )}

      {showSaveFormation && (
        <SaveFormationModal
          onSave={handleSaveFormation}
          onClose={() => setShowSaveFormation(false)}
        />
      )}

      {showLoadFormation && (
        <LoadFormationModal
          onLoad={handleLoadFormation}
          onClose={() => setShowLoadFormation(false)}
        />
      )}
    </div>
  );
}

export default App;
