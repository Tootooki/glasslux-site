# GlassLux Free WhatsApp Bot 🤖

This is a **free, code-based solution** to automate your WhatsApp. It uses the `whatsapp-web.js` library, which simulates a browser running WhatsApp Web.

## 🚀 How to Set Up

### 1. Install Node.js
If you don't have it, download and install [Node.js](https://nodejs.org/) (LTS version).

### 2. Install Dependencies
Open your terminal (Terminal app) and navigate to this folder:

```bash
cd /Users/aofmoka/Documents/PAPA_GLASSLUX/whatsapp-bot
npm install
```

### 3. Run the Bot
Start the bot with:

```bash
node index.js
```

### 4. Scan QR Code
The terminal will show a large QR code. Open WhatsApp on your phone, go to **Linked Devices > Link a Device**, and scan it.

### 5. Test It!
Send a message "hello" or "price" to your WhatsApp number from a *different* phone (or ask a friend). The bot will auto-reply!

## ⚠️ Important Notes
*   **Your Computer Must Be On**: Since this is "free" and hosted on your machine, the bot only stops working if you close the terminal or turn off your Mac.
*   **Hosting**: To make it run 24/7 without your laptop, you would need to deploy this code to a VPS (Virtual Private Server) or a cloud service (like Railway, Render, or Heroku), which might cost $5-$7/month.
*   **Risk**: This library is safe for normal use, but avoid spamming thousands of people instantly to prevent your number from being flagged.
