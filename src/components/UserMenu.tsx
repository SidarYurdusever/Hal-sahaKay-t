import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  onSettingsClick: () => void;
}

export default function UserMenu({ onSettingsClick }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Menü dışına tıklanınca kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = currentUser?.isAnonymous 
    ? 'Misafir' 
    : currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Kullanıcı';

  const avatarInitial = displayName[0].toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
          {currentUser?.isAnonymous ? '👤' : avatarInitial}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {displayName}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {currentUser?.email || 'Misafir Kullanıcı'}
          </p>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {currentUser?.isAnonymous ? '👤' : avatarInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                  {currentUser?.email || 'Misafir Kullanıcı'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onSettingsClick();
              }}
              className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">⚙️</span>
              <span className="font-medium">Ayarlar</span>
            </button>

            {currentUser?.isAnonymous && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/register');
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
              >
                <span className="text-lg">✨</span>
                <span className="font-medium">Hesap Oluştur</span>
              </button>
            )}

            <div className="my-2 border-t border-gray-200 dark:border-gray-600"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
