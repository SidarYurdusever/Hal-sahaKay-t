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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profil
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                  {currentUser?.isAnonymous 
                    ? '👤' 
                    : (currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {currentUser?.displayName || (currentUser?.isAnonymous ? 'Misafir' : 'Kullanıcı')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {currentUser?.email || 'Email yok'}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  currentUser?.isAnonymous 
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200' 
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                }">
                  {currentUser?.isAnonymous ? '👤 Misafir' : '✅ Kayıtlı'}
                </span>
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tema
            </h3>
            <div className="flex gap-3">
              {/* Light Theme */}
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 p-4 rounded-lg border transition-all ${
                  theme === 'light'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-sm'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                }`}
              >
                <div className="text-3xl mb-2">☀️</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Açık</p>
              </button>

              {/* Dark Theme */}
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 p-4 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-sm'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                }`}
              >
                <div className="text-3xl mb-2">🌙</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Koyu</p>
              </button>
            </div>
          </section>

          {/* App Info */}
          <section className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Halısaha Kayıt v1.0.0</p>
            <p className="mt-1">Sidar Yurdusever</p>
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
