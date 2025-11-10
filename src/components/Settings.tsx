import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-3xl">⚙️</span>
            Ayarlar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>👤</span>
              Profil Bilgileri
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {currentUser?.isAnonymous 
                    ? '👤' 
                    : (currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase()}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">İsim</label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {currentUser?.displayName || (currentUser?.isAnonymous ? 'Misafir Kullanıcı' : 'Belirlenmemiş')}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {currentUser?.email || 'Belirlenmemiş'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Hesap Türü</label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {currentUser?.isAnonymous ? '👤 Misafir Hesap' : '✅ Kayıtlı Hesap'}
                </p>
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🎨</span>
              Tema Ayarları
            </h3>
            <div className="space-y-3">
              {/* Light Theme */}
              <button
                onClick={() => setTheme('light')}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  theme === 'light'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center text-2xl shadow-md">
                  ☀️
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Açık Tema</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aydınlık ve ferah görünüm</p>
                </div>
                {theme === 'light' && (
                  <div className="text-green-500 text-2xl">✓</div>
                )}
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => setTheme('dark')}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  theme === 'dark'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-2xl shadow-md">
                  🌙
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Koyu Tema</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gözlerinizi yormayan karanlık mod</p>
                </div>
                {theme === 'dark' && (
                  <div className="text-green-500 text-2xl">✓</div>
                )}
              </button>
            </div>
          </section>

          {/* App Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>ℹ️</span>
              Uygulama Bilgisi
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Versiyon</span>
                <span className="text-gray-900 dark:text-white font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Geliştirici</span>
                <span className="text-gray-900 dark:text-white font-medium">Sidar Yurdusever</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
