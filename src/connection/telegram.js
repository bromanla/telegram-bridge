const { Telegram } = require('puregram');
const { tgToken: token, chat_id } = require('../config.json');

const tg = new Telegram({token});

tg.updates.startPolling()
    .catch(() => {
        console.log('Error TG');
        process.exit(0);
    })

tg.updates.use(async (ctx, next) => ctx.senderId == chat_id ? next() : ctx.send('Private bot'));

module.exports = {updates: tg.updates, api: tg.api};
