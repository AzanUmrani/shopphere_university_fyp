import type { Middleware } from '@reduxjs/toolkit';
import webSocketService from '../../services/websocket';
import { setConnected, setConnectionError } from '../slices/socketSlice';

export const socketMiddleware: Middleware = (store) => {
  // We attach the listeners ONCE when the store is created
  webSocketService.on('connected', () => {
    console.log("🟢 [Middleware] Dispatched: Connected");
    store.dispatch(setConnected(true));
  });

  webSocketService.on('disconnected', () => {
    console.log("🔴 [Middleware] Dispatched: Disconnected");
    store.dispatch(setConnected(false));
  });

  webSocketService.on('connectionError', (err: string) => {
    console.log("❌ [Middleware] Dispatched: Error", err);
    store.dispatch(setConnectionError(err));
  });

  return (next) => (action: any) => {
    return next(action);
  };
};