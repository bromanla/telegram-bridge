const { VK } = require('vk-io');
const { vkToken: token } = require('../config.json');

const vk = new VK({token});

vk.updates.startPolling()
    .catch(() => {
        console.log('Error vk');
        process.exit(0);
    })

vk.updates.use(async (ctx, next) => ctx.isOutbox && ctx.isUser ? false : next());

module.exports = {updates: vk.updates, upload: vk.upload, api: vk.api};
