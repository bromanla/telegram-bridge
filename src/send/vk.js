const { upload, api} = require('../connection/vk');
const { sendText: errorText} = require('./telegram');

const errorHandler = async (e) => {
    console.error(e);
    errorText('*Error sending*');
};

module.exports.sendText = async (user_id, message) => {
    api.messages.send({user_id, message})
        .catch(errorHandler)
}

module.exports.sendPhoto = async (user_id, message, source) => {
    try {
        const attachment = await upload.messagePhoto({user_id, source});
        message = message || '';
        await api.messages.send({user_id, message, attachment});
    } catch (e) {
        errorHandler(e);
    }
}

module.exports.sendVoice = async (user_id, source) => {
    try {
        const attachment = await upload.audioMessage({user_id, source});
        await api.messages.send({user_id, attachment});
    } catch (e) {
        errorHandler(e);
    }
}

module.exports.sendSticker = async (user_id, message, source) => {
    try {
        const attachment = await upload.messageGraffiti({user_id, source});
        message = message || '';
        await api.messages.send({user_id, attachment, message});
    } catch (e) {
        errorHandler(e);
    }
}

module.exports.sendDocument = async (user_id, message, source) => {
    try {
        const attachment = await upload.messageDocument({user_id, source});
        message = message || '';
        await api.messages.send({user_id, attachment, message});
    } catch (e) {
        errorHandler(e);
    }
}