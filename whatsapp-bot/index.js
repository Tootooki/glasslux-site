const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// --- Configuration ---
const PORT = 3000;
const OWNER_NUMBER = '13859885129@c.us'; // The owner's WhatsApp ID (format: number@c.us)

// --- Express App Setup ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- WhatsApp Client Setup ---
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP MOBILE APP:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bridge is Ready!');
    console.log(`🌍 API Server listening on http://localhost:${PORT}`);
});

client.initialize();

// --- API Routes ---

// Endpoint for Website to send message to Owner
app.post('/api/send-message', async (req, res) => {
    const { name, phone, message } = req.body;

    if (!client.info) {
        return res.status(503).json({ error: 'WhatsApp client not ready yet' });
    }

    try {
        // Construct the message to send to the Business Owner
        const textToSend = `📩 *New Website Message*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}\n\n_Click the phone number above to reply in WhatsApp._`;

        // Send to Owner
        await client.sendMessage(OWNER_NUMBER, textToSend);

        // Optional: Auto-reply to the customer if they provided a valid WhatsApp number
        // const customerId = `${phone.replace(/\D/g, '')}@c.us`;
        // await client.sendMessage(customerId, "Thanks for contacting GlassLux! We received your message and will reply shortly.");

        res.json({ success: true, message: 'Message sent to owner!' });
        console.log(`Forwarded message from ${name} to owner.`);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
