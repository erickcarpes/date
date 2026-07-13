import { useState } from 'react';
import { Step1Question } from './components/Step1Question';
import { Step2DateChoice } from './components/Step2DateChoice';
import { Step3Contact } from './components/Step3Contact';
import { Step4Success } from './components/Step4Success';
import type { DateFormData, Step } from './types';

const INITIAL_DATA: DateFormData = {
  dateType: '',
  dateOption: '',
  preferredDate: '',
  whatsapp: '',
  email: '',
};

function App() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<DateFormData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = () => setStep(2);

  const handleDateChoice = (data: Pick<DateFormData, 'dateOption' | 'preferredDate'>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    sessionStorage.setItem('dateOption', data.dateOption);
    setStep(3);
  };

  const handleContactSubmit = async (contact: Pick<DateFormData, 'whatsapp' | 'email'>) => {
    const finalData = { ...formData, ...contact };
    setFormData(finalData);
    setIsLoading(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) throw new Error('Email send failed');
      setStep(4);
    } catch (err) {
      console.error(err);
      // Still go to success — email failure shouldn't block the experience
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    sessionStorage.removeItem('dateOption');
    setStep(1);
  };

  return (
    <>
      {step === 1 && <Step1Question onAccept={handleAccept} />}
      {step === 2 && <Step2DateChoice onNext={handleDateChoice} />}
      {step === 3 && (
        <Step3Contact
          data={formData}
          onSubmit={handleContactSubmit}
          isLoading={isLoading}
        />
      )}
      {step === 4 && <Step4Success onReset={handleReset} />}
    </>
  );
}

export default App;
