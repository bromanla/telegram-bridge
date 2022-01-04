import { VK } from 'vk-io';

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx, next) => {
    // Incoming messages only
    // if (!ctx.isInbox) return;

    /// Ignore messages from communities
    // if (ctx.isGroup) return;

    await next();
  });
};
