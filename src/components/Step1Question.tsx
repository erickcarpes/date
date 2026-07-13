import { useCallback, useEffect, useRef, useState } from 'react';
import { SadModal } from './SadModal';
import { Toast } from './Toast';

interface Step1QuestionProps {
  onAccept: () => void;
}

function getRandomPosition(btnW: number, btnH: number) {
  const margin = 20;
  const maxX = window.innerWidth - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;
  return {
    x: Math.max(margin, Math.random() * maxX),
    y: Math.max(margin, Math.random() * maxY),
  };
}

export function Step1Question({ onAccept }: Step1QuestionProps) {
  const [hasFleed, setHasFleed] = useState(false);
  const [btnPos, setBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showSadModal, setShowSadModal] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentPosRef = useRef<{ x: number; y: number } | null>(null);

  // Flee from mouse
  useEffect(() => {
    if (!hasFleed) return;

    const handleMouseMove = (e: MouseEvent) => {
      const btn = btnRef.current;
      if (!btn) return;

      const btnW = btn.offsetWidth;
      const btnH = btn.offsetHeight;
      const pos = currentPosRef.current;
      if (!pos) return;

      const btnCenterX = pos.x + btnW / 2;
      const btnCenterY = pos.y + btnH / 2;
      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const FLEE_RADIUS = 180;

      if (dist < FLEE_RADIUS) {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(() => {
          const angle = Math.atan2(dy, dx);
          const fleeStrength = ((FLEE_RADIUS - dist) / FLEE_RADIUS) * 300;
          const margin = 20;

          const newX = Math.max(
            margin,
            Math.min(window.innerWidth - btnW - margin, pos.x - Math.cos(angle) * fleeStrength)
          );
          const newY = Math.max(
            margin,
            Math.min(window.innerHeight - btnH - margin, pos.y - Math.sin(angle) * fleeStrength)
          );

          currentPosRef.current = { x: newX, y: newY };
          setBtnPos({ x: newX, y: newY });
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hasFleed]);

  const handleNoClick = useCallback(() => {
    if (!hasFleed) {
      // First click: show toast + launch button away
      setShowToast(true);
      const btnEl = btnRef.current;
      const btnW = btnEl?.offsetWidth ?? 120;
      const btnH = btnEl?.offsetHeight ?? 44;
      const pos = getRandomPosition(btnW, btnH);
      currentPosRef.current = pos;
      setBtnPos(pos);
      setHasFleed(true);
    } else {
      // Somehow clicked again via mouse — keep fleeing, show toast
      setShowToast(true);
    }
  }, [hasFleed]);

  const handleNoFocus = useCallback(() => {
    if (hasFleed) {
      setShowSadModal(true);
    }
  }, [hasFleed]);

  const hideToast = useCallback(() => setShowToast(false), []);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-pink-light/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-blue-val/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-[-40px] w-40 h-40 rounded-full bg-pink-mid/30 blur-2xl pointer-events-none" />

      {/* Floating hearts decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['💕', '💗', '🌸', '💖', '✨'].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl opacity-20 select-none"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Card */}
      <div
        className="relative z-10 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-pink-light p-10 max-w-md w-full text-center"
        style={{ animation: 'slide-up 0.6s ease-out forwards' }}
      >
        {/* Big emoji */}
        <div className="text-6xl mb-6 block" style={{ animation: 'heartbeat 1.4s ease-in-out infinite' }}>
          🌸
        </div>

        <p className="text-pink-mid font-semibold text-sm uppercase tracking-widest mb-3">
          uma pergunta importante...
        </p>

        <h1 className="text-3xl font-black text-pink-hot leading-tight mb-8">
          Você aceita<br />
          <span className="text-pink-mid">sair comigo?</span>
        </h1>

        {/* YES button */}
        <button
          id="btn-yes"
          onClick={onAccept}
          className="w-full mb-4 bg-gradient-to-r from-pink-mid to-pink-hot text-white font-black py-4 px-8 rounded-2xl text-sm shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-200 tracking-wide uppercase"
        >
          ✨ Sim, é óbvio, impossível recusar
        </button>

        {/* NO button — fixed position after first click */}
        <button
          id="btn-no"
          ref={btnRef}
          onClick={handleNoClick}
          onFocus={handleNoFocus}
          className={`fleeing-btn font-bold py-3 px-6 rounded-2xl text-xs border-2 border-pink-light text-pink-mid bg-white hover:bg-pink-light/30 transition-colors duration-150 ${
            hasFleed ? 'fixed z-40 shadow-lg' : 'w-full'
          }`}
          style={
            hasFleed && btnPos
              ? { left: `${btnPos.x}px`, top: `${btnPos.y}px` }
              : undefined
          }
        >
          Não :/
        </button>
      </div>

      <Toast message="ops, tente novamente 🙈" visible={showToast} onHide={hideToast} />
      <SadModal visible={showSadModal} onClose={() => setShowSadModal(false)} />
    </div>
  );
}
