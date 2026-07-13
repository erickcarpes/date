import { useEffect, useRef } from 'react';

interface Step4SuccessProps {
  onReset: () => void;
}

const DATE_EMOJIS: Record<string, string> = {
  cinema: '🎬', jantar: '🍽️', cafe: '☕', 'por-do-sol': '🌅',
  parque: '🌳', pizza: '🍕',
};

function spawnConfetti(container: HTMLDivElement) {
  const colors = ['#FF97CC', '#FFB3C9', '#FAD0D7', '#ADD0EF', '#FCF4F8'];
  const shapes = ['●', '■', '▲', '★', '♥'];

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      font-size: ${8 + Math.random() * 14}px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${2 + Math.random() * 3}s;
      animation-delay: ${Math.random() * 1.5}s;
      opacity: 0;
    `;
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

export function Step4Success({ onReset }: Step4SuccessProps) {
  const confettiRef = useRef<HTMLDivElement>(null);
  const dateOption = sessionStorage.getItem('dateOption') || '';
  const dateLabel = dateOption.replace('-', ' ');
  const emoji = DATE_EMOJIS[dateOption] || '💕';

  useEffect(() => {
    if (confettiRef.current) spawnConfetti(confettiRef.current);
  }, []);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Blobs */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-pink-mid/20 blur-3xl pointer-events-none" />

      <div
        className="relative z-10 bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl border border-pink-light p-10 max-w-sm w-full text-center"
        style={{ animation: 'bounce-in 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div
          className="text-7xl mb-5 block"
          style={{ animation: 'heartbeat 1s ease-in-out infinite' }}
        >
          💖
        </div>

        <h2 className="text-3xl font-black text-pink-hot mb-2">
          É isso aí!!! 🎉
        </h2>

        <p className="text-pink-mid font-semibold text-sm mb-5 leading-relaxed">
          Combinado então! Nos vemos no nosso{' '}
          <span className="text-pink-hot font-black capitalize">
            {emoji} {dateLabel}
          </span>{' '}
          em breve. Verifique seu email para mais detalhes 💌
        </p>

        {/* Hearts row */}
        <div className="flex justify-center gap-3 mb-7">
          {['💕', '🌸', '💗', '🌸', '💕'].map((h, i) => (
            <span
              key={i}
              className="text-xl"
              style={{
                animation: `float ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                display: 'inline-block',
              }}
            >
              {h}
            </span>
          ))}
        </div>

        <button
          id="btn-reset"
          onClick={onReset}
          className="w-full border-2 border-pink-mid text-pink-hot font-bold py-3 px-6 rounded-2xl text-sm hover:bg-pink-light/30 active:scale-95 transition-all duration-200"
        >
          Recomeçar do início 🔄
        </button>
      </div>
    </div>
  );
}
