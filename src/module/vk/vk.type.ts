import type { Context, MessageContext as OriginalMessageContext } from 'vk-io';
import type { NextMiddleware } from 'middleware-io';
import type { TelegramBaseEvent } from '#src/service/event.service.js';

export type DefaultState = TelegramBaseEvent;
export type NextFunction = NextMiddleware;
export type MessageContext = OriginalMessageContext<DefaultState>;

export type { Context };
