import type { Context, MessageContext as OriginalMessageContext } from 'vk-io';
import type { NextMiddleware } from 'middleware-io';
import type { EventBase } from '#src/service/event.service.js';

export type DefaultState = EventBase;
export type NextFunction = NextMiddleware;
export type MessageContext = OriginalMessageContext<DefaultState>;

export type { Context };
