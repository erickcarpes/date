import { useCallback, useEffect, useRef, useState } from 'react';
import { SadModal } from './SadModal';
import { Toast } from './Toast';

interface Step1QuestionProps {
  onAccept: () => void;
}

const MARGIN = 24;
const FLEE_RADIUS = 200;

function getFarPosition(mouseX: number, mouseY: number, btnW: number, btnH: number) {
  const maxX = window.innerWidth - btnW - MARGIN;
  const maxY = window.innerHeight - btnH - MARGIN;

  // Generate 12 candidates, pick the one furthest from the mouse
  let best = { x: MARGIN, y: MARGIN };
  let bestDist = 0;

  for (let i = 0; i < 12; i++) {
    const x = MARGIN + Math.random() * (maxX - MARGIN);
    const y = MARGIN + Math.random() * (maxY - MARGIN);
    const centerX = x + btnW / 2;
    const centerY = y + btnH / 2;
    const dist = Math.hypot(centerX - mouseX, centerY - mouseY);
    if (dist > bestDist) {
      bestDist = dist;
      best = { x, y };
    }
  }

  return best;
}

export function Step1Question({ onAccept }: Step1QuestionProps) {
  const [hasFleed, setHasFleed] = useState(false);
  const [btnPos, setBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showSadModal, setShowSadModal] = useState(false);

  const btnRef = useRef<HTMLButtonElement>(null);
  // Keep the live position in a ref so the mousemove closure always reads fresh data
  const posRef = useRef<{ x: number; y: number } | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Track mouse globally and teleport the button when it gets too close
  useEffect(() => {
    if (!hasFleed) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY };

      const btn = btnRef.current;
      const pos = posRef.current;
      if (!btn || !pos) return;

      const btnW = btn.offsetWidth;
      const btnH = btn.offsetHeight;
      const centerX = pos.x + btnW / 2;
      const centerY = pos.y + btnH / 2;
      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist < FLEE_RADIUS) {
        const newPos = getFarPosition(e.clientX, e.clientY, btnW, btnH);
        posRef.current = newPos;
        setBtnPos({ ...newPos });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasFleed]);

  // Teleport away if mouse somehow reaches the button
  const handleNoMouseEnter = useCallback(() => {
    if (!hasFleed) return;
    const btn = btnRef.current;
    const btnW = btn?.offsetWidth ?? 100;
    const btnH = btn?.offsetHeight ?? 40;
    const { x: mx, y: my } = lastMouseRef.current;
    const newPos = getFarPosition(mx, my, btnW, btnH);
    posRef.current = newPos;
    setBtnPos({ ...newPos });
  }, [hasFleed]);

  const handleNoClick = useCallback(() => {
    const btn = btnRef.current;
    const btnW = btn?.offsetWidth ?? 100;
    const btnH = btn?.offsetHeight ?? 40;
    const { x: mx, y: my } = lastMouseRef.current;

    setShowToast(true);

    if (!hasFleed) {
      const pos = getFarPosition(mx || window.innerWidth / 2, my || window.innerHeight / 2, btnW, btnH);
      posRef.current = pos;
      setBtnPos(pos);
      setHasFleed(true);
    } else {
      // Re-flee immediately on click too
      const pos = getFarPosition(mx, my, btnW, btnH);
      posRef.current = pos;
      setBtnPos({ ...pos });
    }
  }, [hasFleed]);

  const handleNoFocus = useCallback(() => {
    if (hasFleed) setShowSadModal(true);
  }, [hasFleed]);

  const hideToast = useCallback(() => setShowToast(false), []);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 rounded-full bg-blue-val/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 rounded-full bg-pink-light/40 blur-3xl pointer-events-none" />

      {/* Card */}
      <div
        className="relative z-10 bg-white rounded-3xl shadow-lg border border-pink-light/60 p-10 max-w-sm w-full text-center"
        style={{ animation: 'slide-up 0.5s ease-out forwards' }}
      >
        <div
          className="text-5xl mb-5 block select-none"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          💌
        </div>

        <p className="text-pink-mid/70 font-semibold text-xs uppercase tracking-[0.2em] mb-3">
          uma pergunta importante
        </p>

        <h1 className="text-[2rem] font-black leading-tight mb-8" style={{ color: '#2d2d2d' }}>
          Você aceita{' '}
          <span className="text-pink-hot">sair comigo?</span>
        </h1>

        {/* YES */}
        <button
          id="btn-yes"
          onClick={onAccept}
          className="w-full mb-3 bg-blue-val text-white font-black py-4 px-8 rounded-2xl text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all duration-200 tracking-wide"
          style={{ color: '#2d2d2d' }}
        >
          Sim, é óbvio, impossível recusar ✨
        </button>

        {/* NO — fixed after first click, flees from mouse */}
        <button
          id="btn-no"
          ref={btnRef}
          onClick={handleNoClick}
          onMouseEnter={handleNoMouseEnter}
          onFocus={handleNoFocus}
          className={`font-semibold py-3 px-6 rounded-2xl text-xs border border-pink-light/80 text-pink-mid/70 bg-transparent select-none ${
            hasFleed ? 'fixed z-40' : 'w-full'
          }`}
          style={
            hasFleed && btnPos
              ? { left: `${btnPos.x}px`, top: `${btnPos.y}px`, transition: 'none' }
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
