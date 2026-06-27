const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

let sock;

async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    sock = makeWASocket({
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    console.log("WhatsApp conectado");
}

async function sendMessage(text, groupId) {
    if (!sock) return;
    await sock.sendMessage(groupId, { text });
}

module.exports = { startWhatsApp, sendMessage };
