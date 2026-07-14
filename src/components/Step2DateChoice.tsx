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
    if (!selected) { setError('Escolhe um encontro primeiro 🥺'); return; }
    if (!date) { setError('E quando você quer sair? 📅'); return; }
    setError('');
    onNext({ dateOption: selected, preferredDate: date });
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-blue-val/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-pink-light/30 blur-3xl pointer-events-none" />

      <div
        className="relative z-10 bg-white rounded-3xl shadow-lg border border-pink-light/60 p-8 max-w-lg w-full"
        style={{ animation: 'slide-up 0.5s ease-out forwards' }}
      >
        <div className="text-center mb-7">
          <span className="text-4xl block mb-3 select-none" style={{ animation: 'float 3s ease-in-out infinite' }}>
            🗓️
          </span>
          <p className="text-pink-mid/70 font-semibold text-xs uppercase tracking-[0.2em] mb-1">passo 1 de 2</p>
          <h2 className="text-2xl font-black" style={{ color: '#2d2d2d' }}>Onde você quer ir?</h2>
          <p className="text-pink-mid/60 text-sm mt-1">Escolhe o que mais te agrada ✨</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              id={`date-opt-${opt.id}`}
              onClick={() => setSelected(opt.id)}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer text-left ${
                selected === opt.id
                  ? 'border-blue-val bg-blue-val/10 shadow-sm scale-[1.03]'
                  : 'border-pink-light/50 bg-white hover:border-blue-val/50 hover:bg-blue-val/5'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className={`font-bold text-sm ${selected === opt.id ? 'text-blue-val' : 'text-gray-700'}`}
                style={{ color: selected === opt.id ? '#ADD0EF' : '#444' }}>
                {opt.label}
              </span>
              <span className="text-xs text-pink-mid/60 text-center leading-tight">{opt.description}</span>
            </button>
          ))}
        </div>

        {/* Date picker */}
        <div className="mb-6">
          <label className="block font-bold text-sm mb-2 ml-1" style={{ color: '#555' }}>
            📅 Quando você prefere?
          </label>
          <input
            id="preferred-date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-2 border-pink-light/60 rounded-xl px-4 py-3 font-semibold text-sm focus:outline-none focus:border-blue-val bg-white transition-colors cursor-pointer"
            style={{ color: '#444' }}
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
          className="w-full bg-blue-val font-black py-4 rounded-2xl text-sm shadow-md hover:brightness-105 active:scale-95 transition-all duration-200 tracking-wide"
          style={{ color: '#2d2d2d' }}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
