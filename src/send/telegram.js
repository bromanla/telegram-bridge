const { api } = require('../connection/telegram');
const { chat_id } = require('../config.json');

const parse_mode = 'Markdown';

module.exports.sendText = async (text) => {
    await api.sendMessage({chat_id, text, parse_mode});
}

module.exports.sendPhoto = async (caption, photo) => {
    await api.sendPhoto({chat_id, photo, caption, parse_mode});
}

module.exports.sendVoice = async (caption, voice) => {
    await api.sendVoice({chat_id, voice, caption, parse_mode});
}

module.exports.sendSticker = async (caption, sticker) => {
    await api.sendSticker({chat_id, sticker, caption, parse_mode});
}

module.exports.sendDocument = async (caption, document) => {
    await api.sendDocument({chat_id, caption, document, parse_mode});
}