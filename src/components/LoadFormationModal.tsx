import { useState, useEffect } from 'react';
import type { SavedFormation } from '../types';
import { loadSavedFormations, deleteSavedFormation } from '../utils/storage';

interface LoadFormationModalProps {
  onLoad: (formation: SavedFormation) => void;
  onClose: () => void;
}

export default function LoadFormationModal({ onLoad, onClose }: LoadFormationModalProps) {
  const [formations, setFormations] = useState<SavedFormation[]>([]);

  useEffect(() => {
    setFormations(loadSavedFormations());
  }, []);

  const handleDelete = (formationId: string, formationName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`"${formationName}" formasyonunu silmek istediğinize emin misiniz?`)) {
      deleteSavedFormation(formationId);
      setFormations(prev => prev.filter(f => f.id !== formationId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">📂 Kayıtlı Formasyonlar</h2>
              <p className="text-purple-100 mt-1">
                Kayıtlı bir formasyonu yükleyin
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✖
            </button>
          </div>
        </div>

        {/* Formation List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {formations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-lg font-medium">Henüz kayıtlı formasyon yok</p>
              <p className="text-sm mt-2">
                Formasyon oluşturduktan sonra "💾 Formasyonu Kaydet" butonunu kullanın
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {formations.map((formation) => (
                <div
                  key={formation.id}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition-all group"
                >
                  <button
                    onClick={() => onLoad(formation)}
                    className="flex items-center gap-4 flex-1 text-left group-hover:bg-purple-50 -m-4 p-4 rounded-l-lg"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {formation.players.length}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {formation.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formation.players.length} oyuncu • {' '}
                        {new Date(formation.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formation.players.slice(0, 5).map((player, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            #{player.number} {player.name}
                          </span>
                        ))}
                        {formation.players.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{formation.players.length - 5} daha
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-purple-600 font-medium">
                      Yükle →
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDelete(formation.id, formation.name, e)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
