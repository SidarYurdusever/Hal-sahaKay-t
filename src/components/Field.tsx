import { useRef, useState } from 'react';
import type { Player } from '../types';

interface FieldProps {
  players: Player[];
  onPlayerMove?: (playerId: string, x: number, y: number) => void;
}

export default function Field({ players, onPlayerMove }: FieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!onPlayerMove) return;

    const playerId = e.dataTransfer.getData('playerId');
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Koordinatları yüzdeye çevir (0-100)
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onPlayerMove(playerId, Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
  };

  // Touch events için
  const handleTouchMove = (e: React.TouchEvent, playerId: string) => {
    e.preventDefault();
    if (!onPlayerMove || !fieldRef.current) return;

    const touch = e.touches[0];
    const rect = fieldRef.current.getBoundingClientRect();
    
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    onPlayerMove(playerId, Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
  };

  return (
    <div 
      ref={fieldRef}
      className="relative w-full aspect-[2/3] bg-gradient-to-b from-green-600 to-green-700 rounded-lg shadow-xl overflow-hidden border-4 border-white touch-none"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Saha çizgileri */}
      <div className="absolute inset-0">
        {/* Orta saha çizgisi */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40" />
        
        {/* Orta daire */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/40 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />
        
        {/* Üst kale alanı */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white/40 border-t-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-white/40 border-t-0" />
        
        {/* Alt kale alanı */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white/40 border-b-0" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-white/40 border-b-0" />
        
        {/* Dış çizgiler */}
        <div className="absolute inset-2 border-2 border-white/40 rounded" />
      </div>

      {/* Oyuncular */}
      {players.map((player) => (
        <PlayerMarker
          key={player.id}
          player={player}
          onTouchMove={(e) => handleTouchMove(e, player.id)}
          onTouchStart={() => setDraggingPlayerId(player.id)}
          onTouchEnd={() => setDraggingPlayerId(null)}
          isDragging={draggingPlayerId === player.id}
        />
      ))}
    </div>
  );
}

interface PlayerMarkerProps {
  player: Player;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  isDragging?: boolean;
}

function PlayerMarker({ player, onTouchMove, onTouchStart, onTouchEnd, isDragging }: PlayerMarkerProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('playerId', player.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`absolute cursor-move transition-all hover:scale-110 ${
        isDragging ? 'scale-125 z-50' : ''
      }`}
      style={{
        left: `${player.position.x}%`,
        top: `${player.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center gap-1">
        {/* Oyuncu avatarı */}
        <div className="w-12 h-12 rounded-full bg-blue-600 border-3 border-white shadow-lg flex items-center justify-center overflow-hidden">
          {player.photo ? (
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-lg">{player.number}</span>
          )}
        </div>
        
        {/* Oyuncu ismi */}
        <div className="bg-white/90 px-2 py-0.5 rounded text-xs font-semibold text-gray-800 shadow whitespace-nowrap">
          {player.name}
        </div>
      </div>
    </div>
  );
}
