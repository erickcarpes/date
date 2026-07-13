interface SadModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SadModal({ visible, onClose }: SadModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-hot/20 backdrop-blur-sm"
      style={{ animation: 'fade-in 0.3s ease-out forwards' }}>
      <div
        className="bg-white rounded-3xl shadow-2xl p-10 mx-4 max-w-sm w-full text-center border-4 border-pink-mid"
        style={{ animation: 'bounce-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div className="text-6xl mb-4" style={{ animation: 'heartbeat 1.2s ease-in-out infinite' }}>
          💔
        </div>
        <h2 className="text-xl font-black text-pink-hot leading-snug mb-2 uppercase tracking-wide">
          Tá, eu já entendi que você não quer&nbsp;:(((
        </h2>
        <p className="text-pink-mid font-semibold text-sm mb-6">
          Mas saiba que meu coração está partido...
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-pink-mid to-pink-hot text-white font-bold py-3 px-8 rounded-full text-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          Ok, me perdoa 😢
        </button>
      </div>
    </div>
  );
}
