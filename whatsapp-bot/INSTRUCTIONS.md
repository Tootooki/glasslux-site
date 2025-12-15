# GlassLux WhatsApp Bridge 🌉

This setup allows customers to message you **from the website** directly to your WhatsApp, without them needing to log in.

## 🚀 How to Run the Bridge

### 1. Start the Bot
Open Terminal and run:
```bash
cd /Users/aofmoka/Documents/PAPA_GLASSLUX/whatsapp-bot
node index.js
```
(Scan the QR code if asked).

### 2. That's it!
*   **On the Website:** Customers see a "Live WhatsApp Chat" box.
*   **They Type:** "Hi, I need a quote..."
*   **You Receive:** A message on WhatsApp from **Yourself** (the bot) saying:
    > 📩 **New Website Message**
    > **Name:** John Doe
    > **Phone:** +1 555-0123
    > **Message:** Hi...
*   **To Reply:** Click the phone number in the message to start a WhatsApp chat with the customer.

## ⚠️ "Bot Offline" Warning
Since this runs on **your computer**, if you close the terminal or turn off your Mac, the website chat will say "Bot is offline" and give them a link to SMS you instead. This ensures you never miss a lead!
