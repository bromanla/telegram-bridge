import { VK } from 'vk-io';

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx) => {
    // Incoming messages only
    if (!ctx.isInbox) return;

    if (ctx.hasText) {
      console.log(ctx.text);
      // return;
    }

    if (ctx.hasAttachments()) {
      console.log('hasAttachments');
    }

    // await ctx.send('yes');
  });
};
