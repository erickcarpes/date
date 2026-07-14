import { useEffect, useRef, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (visible) {
      setRendered(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onHide, 2500);
    } else {
      const t = setTimeout(() => setRendered(false), 350);
      return () => clearTimeout(t);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onHide]);

  if (!rendered) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      <div className="bg-white border border-pink-light rounded-2xl px-5 py-3 shadow-md flex items-center gap-2.5">
        <span className="text-lg">🙈</span>
        <p className="font-bold text-sm" style={{ color: '#888' }}>{message}</p>
      </div>
    </div>
  );
}
