import { useEffect, useRef, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onHide();
      }, 2500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onHide]);

  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) setRendered(true);
    else {
      const t = setTimeout(() => setRendered(false), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!rendered) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white border-2 border-pink-mid rounded-2xl px-6 py-3 shadow-lg flex items-center gap-3"
        style={{ animation: visible ? 'toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' : undefined }}
      >
        <span className="text-xl">🙈</span>
        <p className="text-pink-hot font-bold text-sm tracking-wide">{message}</p>
      </div>
    </div>
  );
}
