import { useState } from 'react';
import UserMenu from './UserMenu';
import Settings from './Settings';

interface HomePageProps {
  onCreateMatch: () => void;
  onViewCalendar: () => void;
  onViewScores: () => void;
  onViewStats: () => void;
}

export default function HomePage({ onCreateMatch, onViewCalendar, onViewScores, onViewStats }: HomePageProps) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
                <span className="text-6xl">⚽</span>
                Halısaha Kayıt
              </h1>
              <p className="text-xl text-gray-600">
                Halısaha maçlarınızı planlayın, kadro düzenleyin ve skorları takip edin
              </p>
            </div>
            <div className="flex-1 flex justify-end items-start">
              <UserMenu onSettingsClick={() => setShowSettings(true)} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Yeni Maç Oluştur */}
          <button
            onClick={onCreateMatch}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              🆕
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Yeni Maç Oluştur
            </h2>
            <p className="text-gray-600">
              Kadro kur, oyuncu ekle ve diziliş belirle
            </p>
          </button>

          {/* Maç Takvimi */}
          <button
            onClick={onViewCalendar}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              📅
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Maç Takvimi
            </h2>
            <p className="text-gray-600">
              Maç planla, katılım durumunu takip et
            </p>
          </button>

          {/* Skor & Geçmiş */}
          <button
            onClick={onViewScores}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Skorlar & Geçmiş
            </h2>
            <p className="text-gray-600">
              Tamamlanan maçları görüntüle
            </p>
          </button>

          {/* İstatistikler */}
          <button
            onClick={onViewStats}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              📈
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Oyuncu İstatistikleri
            </h2>
            <p className="text-gray-600">
              Genel performans sıralaması
            </p>
          </button>
        </div>

        {/* Bilgi Kartları */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>💡</span> Nasıl Çalışır?
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Yeni maç oluşturun ve kadro kurun</li>
              <li>• Oyuncuları sahada konumlandırın</li>
              <li>• Maç günü görünümünü paylaşın</li>
              <li>• Maç sonunda skorları kaydedin</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
              <span>✨</span> Özellikler
            </h3>
            <ul className="text-green-800 space-y-1 text-sm">
              <li>• 5-11 kişilik kadro seçenekleri</li>
              <li>• 10 hazır formasyon dizilişi</li>
              <li>• Sürükle-bırak oyuncu konumlandırma</li>
              <li>• Katılım oylaması ve maç planlama</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>Halısaha Kayıt © 2025 - Sidar Yurdusever - Tüm Telif Hakları Saklıdır</p>
        </div>
      </footer>

      {/* Settings Modal */}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
