import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

const DATE_LABELS: Record<string, string> = {
  cinema: '🎬 Cinema',
  jantar: '🍽️ Jantar romântico',
  cafe: '☕ Café especial',
  'por-do-sol': '🌅 Pôr do Sol',
  parque: '🌳 Passeio no Parque',
  pizza: '🍕 Pizza',
};

function buildHerEmail(data: {
  dateOption: string;
  preferredDate: string;
  email: string;
}): string {
  const dateLabel = DATE_LABELS[data.dateOption] || data.dateOption;
  const formattedDate = new Date(data.preferredDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Um convite especial 💌</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #FCF4F8; font-family: 'Nunito', sans-serif; }
  </style>
</head>
<body style="background:#FCF4F8; padding: 40px 20px; min-height: 100vh;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 60px rgba(255,151,204,0.2); border: 2px solid #FFB3C9;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #FFB3C9 0%, #FF97CC 100%); padding: 40px 32px; text-align: center;">
      <div style="font-size: 56px; margin-bottom: 12px;">💌</div>
      <h1 style="color: white; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">
        Um convite especial pra você!
      </h1>
      <p style="color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 8px; font-weight: 600;">
        Porque você merece o melhor ✨
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <p style="color: #FF97CC; font-size: 16px; font-weight: 700; line-height: 1.6; margin-bottom: 24px;">
        Você disse que <strong>sim</strong> e fez o meu coração disparar 💗<br/>
        Então está confirmado — a gente vai se encontrar!
      </p>

      <!-- Date card -->
      <div style="background: linear-gradient(135deg, #FAD0D7 0%, #FCF4F8 100%); border-radius: 20px; padding: 24px; text-align: center; margin-bottom: 24px; border: 1.5px solid #FFB3C9;">
        <p style="color: #FFB3C9; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">nosso encontro</p>
        <p style="color: #FF97CC; font-size: 28px; font-weight: 900; margin-bottom: 6px;">${dateLabel}</p>
        <p style="color: #FFB3C9; font-size: 15px; font-weight: 700; text-transform: capitalize;">${formattedDate}</p>
      </div>

      <p style="color: #FFB3C9; font-size: 14px; font-weight: 600; line-height: 1.7; margin-bottom: 24px;">
        Fique de olho no seu WhatsApp — vou entrar em contato em breve para acertarmos os últimos detalhes! 📱
      </p>

      <!-- Hearts row -->
      <div style="text-align: center; margin-bottom: 24px; font-size: 24px; letter-spacing: 8px;">
        💕 🌸 💗 🌸 💕
      </div>

      <p style="color: #FAD0D7; font-size: 12px; text-align: center; font-weight: 600;">
        Mal posso esperar! 🥰
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #FAD0D7; padding: 20px 32px; text-align: center;">
      <p style="color: #FF97CC; font-size: 11px; font-weight: 700;">feito com muito 💖</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function buildMyEmail(data: {
  dateOption: string;
  preferredDate: string;
  whatsapp: string;
  email: string;
}): string {
  const dateLabel = DATE_LABELS[data.dateOption] || data.dateOption;
  const formattedDate = new Date(data.preferredDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return `
🎉 ELA DISSE SIM!!!

Encontro: ${dateLabel}
Data preferida: ${formattedDate}
WhatsApp: ${data.whatsapp}
Email dela: ${data.email}

Agora é com você! Bora mandar mensagem 📱
  `.trim();
}

app.post('/api/send-email', async (req, res) => {
  try {
    const { dateOption, preferredDate, whatsapp, email } = req.body as {
      dateOption: string;
      preferredDate: string;
      whatsapp: string;
      email: string;
    };

    if (!email || !dateOption || !preferredDate || !whatsapp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const myEmail = process.env.MY_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'convite@resend.dev';

    const dateLabel = DATE_LABELS[dateOption] || dateOption;
    const formattedDate = new Date(preferredDate + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    // Send to her
    await resend.emails.send({
      from: `Um convite especial 💌 <${fromEmail}>`,
      to: [email],
      subject: '💌 Você aceitou! Sobre nosso encontro...',
      html: buildHerEmail({ dateOption, preferredDate, email }),
    });

    // Send to me
    if (myEmail) {
      await resend.emails.send({
        from: `Date App <${fromEmail}>`,
        to: [myEmail],
        subject: `🎉 Ela disse SIM! ${dateLabel} — ${formattedDate}`,
        text: buildMyEmail({ dateOption, preferredDate, whatsapp, email }),
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌸 Server running on http://localhost:${PORT}`);
});
