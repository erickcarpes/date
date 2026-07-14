interface SadModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SadModal({ visible, onClose }: SadModalProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      style={{ animation: 'fade-in 0.25s ease-out forwards' }}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-10 mx-4 max-w-sm w-full text-center border border-pink-light/60"
        style={{ animation: 'bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div className="text-5xl mb-4 select-none" style={{ animation: 'heartbeat 1.2s ease-in-out infinite' }}>
          💔
        </div>
        <h2 className="text-lg font-black leading-snug mb-2 uppercase tracking-wide" style={{ color: '#2d2d2d' }}>
          Tá, eu já entendi que você não quer&nbsp;:(((
        </h2>
        <p className="text-pink-mid/60 font-medium text-sm mb-6">
          Mas saiba que meu coração está partido...
        </p>
        <button
          onClick={onClose}
          className="bg-blue-val font-bold py-3 px-8 rounded-full text-sm hover:brightness-105 active:scale-95 transition-all shadow-sm"
          style={{ color: '#2d2d2d' }}
        >
          Ok, me perdoa 😢
        </button>
      </div>
    </div>
  );
}
