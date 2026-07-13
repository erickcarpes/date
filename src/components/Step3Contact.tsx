import { useState } from 'react';
import type { DateFormData } from '../types';

interface Step3Props {
  data: Pick<DateFormData, 'dateOption' | 'preferredDate'>;
  onSubmit: (contact: Pick<DateFormData, 'whatsapp' | 'email'>) => void;
  isLoading: boolean;
}

export function Step3Contact({ data, onSubmit, isLoading }: Step3Props) {
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ whatsapp?: string; email?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10)
      errs.whatsapp = 'Coloca um número válido 📱';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Email inválido 📧';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ whatsapp, email });
  };

  const formatWhatsapp = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return val;
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-60px] left-[-60px] w-64 h-64 rounded-full bg-pink-mid/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-40px] right-[-40px] w-56 h-56 rounded-full bg-blue-val/30 blur-3xl pointer-events-none" />

      <div
        className="relative z-10 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-pink-light p-8 max-w-md w-full"
        style={{ animation: 'slide-up 0.5s ease-out forwards' }}
      >
        <div className="text-center mb-7">
          <span className="text-5xl block mb-3" style={{ animation: 'heartbeat 1.4s ease-in-out infinite' }}>
            💕
          </span>
          <p className="text-pink-mid font-semibold text-xs uppercase tracking-widest mb-1">passo 2 de 2</p>
          <h2 className="text-2xl font-black text-pink-hot">Quase lá!</h2>
          <p className="text-pink-mid/70 text-sm mt-1">
            Só preciso dos seus contatos para confirmar 🥰
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-gradient-to-r from-pink-light/50 to-cream border border-pink-mid/40 rounded-2xl p-4 mb-6 text-center">
          <p className="text-pink-mid text-xs font-semibold uppercase tracking-wide mb-1">seu encontro</p>
          <p className="text-pink-hot font-black text-lg capitalize">{data.dateOption.replace('-', ' ')}</p>
          <p className="text-pink-mid text-sm font-semibold">
            {new Date(data.preferredDate + 'T12:00:00').toLocaleDateString('pt-BR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        {/* WhatsApp */}
        <div className="mb-4">
          <label className="block text-pink-hot font-bold text-sm mb-2 ml-1">📱 WhatsApp</label>
          <input
            id="input-whatsapp"
            type="tel"
            placeholder="(11) 99999-9999"
            value={whatsapp}
            onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
            className={`w-full border-2 rounded-xl px-4 py-3 text-pink-hot font-semibold text-sm focus:outline-none bg-white/70 transition-colors placeholder:text-pink-light ${
              errors.whatsapp ? 'border-pink-hot' : 'border-pink-light focus:border-pink-hot'
            }`}
          />
          {errors.whatsapp && (
            <p className="text-pink-hot text-xs font-bold mt-1 ml-1" style={{ animation: 'shake 0.5s ease-in-out' }}>
              {errors.whatsapp}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-7">
          <label className="block text-pink-hot font-bold text-sm mb-2 ml-1">📧 Email</label>
          <input
            id="input-email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border-2 rounded-xl px-4 py-3 text-pink-hot font-semibold text-sm focus:outline-none bg-white/70 transition-colors placeholder:text-pink-light ${
              errors.email ? 'border-pink-hot' : 'border-pink-light focus:border-pink-hot'
            }`}
          />
          {errors.email && (
            <p className="text-pink-hot text-xs font-bold mt-1 ml-1" style={{ animation: 'shake 0.5s ease-in-out' }}>
              {errors.email}
            </p>
          )}
        </div>

        <button
          id="btn-confirm"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-mid to-pink-hot text-white font-black py-4 rounded-2xl text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 tracking-wide uppercase disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Enviando...
            </span>
          ) : (
            '💌 Confirmar nosso encontro!'
          )}
        </button>
      </div>
    </div>
  );
}
