import { VK } from 'vk-io';
import { getUserName, getChatTitle } from '@services/vk.title.service';
import { IState } from '@interfaces';

export default (bot: VK) => {
  bot.updates.on('message_new', async (ctx, next) => {
    // Incoming messages only
    // if (!ctx.isInbox) return;

    /// Ignore messages from communities
    if (ctx.isGroup) return;

    const user = await getUserName(ctx.senderId);

    const state: IState = {
      user,
      title: `<b>${user.name}</b>`,
      attachments: [],
      type: 'text'
    };

    if (ctx.isChat && ctx.chatId) {
      const chat = await getChatTitle(ctx.chatId);
      state.chat = chat;
      state.title += ` [${chat.title}]`;
    }

    ctx.state = state;

    await next();
  });
};
