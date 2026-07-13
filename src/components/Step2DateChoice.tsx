import { useState } from 'react';
import type { DateFormData, DateOption } from '../types';

const DATE_OPTIONS: DateOption[] = [
  { id: 'cinema', emoji: '🎬', label: 'Cinema', description: 'Um filminho especial' },
  { id: 'jantar', emoji: '🍽️', label: 'Jantar', description: 'Algo sofisticado' },
  { id: 'cafe', emoji: '☕', label: 'Café', description: 'Conversa e cafezinho' },
  { id: 'por-do-sol', emoji: '🌅', label: 'Pôr do Sol', description: 'Romântico demais' },
  { id: 'parque', emoji: '🌳', label: 'Parque', description: 'Ar livre e liberdade' },
  { id: 'pizza', emoji: '🍕', label: 'Pizza', description: 'Clássico que nunca erra' },
];

interface Step2Props {
  onNext: (data: Pick<DateFormData, 'dateOption' | 'preferredDate'>) => void;
}

export function Step2DateChoice({ onNext }: Step2Props) {
  const [selected, setSelected] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleContinue = () => {
    if (!selected) { setError('Escolhe um encontro primeiro! 🥺'); return; }
    if (!date) { setError('E quando você quer que a gente saia? 📅'); return; }
    setError('');
    onNext({ dateOption: selected, preferredDate: date });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-pink-light/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-blue-val/30 blur-3xl pointer-events-none" />

      <div
        className="relative z-10 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-pink-light p-8 max-w-lg w-full"
        style={{ animation: 'slide-up 0.5s ease-out forwards' }}
      >
        <div className="text-center mb-7">
          <span className="text-5xl block mb-3" style={{ animation: 'float 3s ease-in-out infinite' }}>
            💌
          </span>
          <p className="text-pink-mid font-semibold text-xs uppercase tracking-widest mb-1">passo 1 de 2</p>
          <h2 className="text-2xl font-black text-pink-hot">Onde você quer ir?</h2>
          <p className="text-pink-mid/70 text-sm mt-1">Escolha o encontro dos seus sonhos ✨</p>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              id={`date-opt-${opt.id}`}
              onClick={() => setSelected(opt.id)}
              className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                selected === opt.id
                  ? 'border-pink-hot bg-gradient-to-b from-pink-light/60 to-pink-mid/30 shadow-md scale-[1.04]'
                  : 'border-pink-light/60 bg-white/60 hover:border-pink-mid hover:bg-pink-light/20 hover:scale-[1.02]'
              }`}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className={`font-black text-sm ${selected === opt.id ? 'text-pink-hot' : 'text-pink-mid'}`}>
                {opt.label}
              </span>
              <span className="text-xs text-pink-mid/60 text-center leading-tight">{opt.description}</span>
              {selected === opt.id && (
                <span className="text-xs font-bold text-pink-hot mt-1" style={{ animation: 'pop 0.3s forwards' }}>
                  ✓ escolhido
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Date picker */}
        <div className="mb-6">
          <label className="block text-pink-hot font-bold text-sm mb-2 ml-1">
            📅 Quando você prefere?
          </label>
          <input
            id="preferred-date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-pink-light rounded-xl px-4 py-3 text-pink-hot font-semibold text-sm focus:outline-none focus:border-pink-hot bg-white/70 transition-colors cursor-pointer"
          />
        </div>

        {error && (
          <p className="text-pink-hot text-xs font-bold mb-4 text-center" style={{ animation: 'shake 0.5s ease-in-out' }}>
            {error}
          </p>
        )}

        <button
          id="step2-continue"
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-pink-mid to-pink-hot text-white font-black py-4 rounded-2xl text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 tracking-wide uppercase"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
