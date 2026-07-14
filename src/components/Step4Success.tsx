import { useEffect, useRef } from 'react';

interface Step4SuccessProps {
  onReset: () => void;
}

const DATE_LABELS: Record<string, string> = {
  cinema: '🎬 Cinema', jantar: '🍽️ Jantar', cafe: '☕ Café',
  'por-do-sol': '🌅 Pôr do Sol', parque: '🌳 Parque', pizza: '🍕 Pizza',
};

function spawnConfetti(container: HTMLDivElement) {
  const colors = ['#FF97CC', '#ADD0EF', '#FFB3C9', '#FAD0D7', '#fff'];
  const shapes = ['●', '■', '▲', '★'];

  for (let i = 0; i < 60; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      font-size: ${8 + Math.random() * 12}px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${2 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 1.2}s;
      opacity: 0;
    `;
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

export function Step4Success({ onReset }: Step4SuccessProps) {
  const confettiRef = useRef<HTMLDivElement>(null);
  const dateOption = sessionStorage.getItem('dateOption') || '';
  const label = DATE_LABELS[dateOption] || '💕 Encontro';

  useEffect(() => {
    if (confettiRef.current) spawnConfetti(confettiRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />

      <div className="absolute inset-0 bg-blue-val/5 pointer-events-none" />

      <div
        className="relative z-10 bg-white rounded-3xl shadow-lg border border-pink-light/60 p-10 max-w-sm w-full text-center"
        style={{ animation: 'bounce-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div className="text-6xl mb-5 select-none" style={{ animation: 'heartbeat 1s ease-in-out infinite' }}>
          🎉
        </div>

        <h2 className="text-2xl font-black mb-2" style={{ color: '#2d2d2d' }}>
          É isso aí!
        </h2>

        <p className="text-sm mb-1 font-semibold" style={{ color: '#888' }}>
          Combinado então!
        </p>
        <p className="font-black text-base mb-6" style={{ color: '#2d2d2d' }}>
          {label}
        </p>

        <p className="text-pink-mid/70 text-xs font-semibold mb-8 leading-relaxed">
          Verifique seu email para os detalhes. Em breve entro em contato pelo WhatsApp 💬
        </p>

        <button
          id="btn-reset"
          onClick={onReset}
          className="w-full border-2 border-pink-light text-pink-mid/70 font-bold py-3 px-6 rounded-2xl text-sm hover:bg-pink-light/20 active:scale-95 transition-all duration-200"
        >
          Recomeçar do início 🔄
        </button>
      </div>
    </div>
  );
}
