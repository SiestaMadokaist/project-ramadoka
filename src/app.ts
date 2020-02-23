import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { WrappedExpress } from './helper/server';
import Ping from './endpoints/Ping';
import { env } from './helper/env';
import { logger } from './helper/logger';
import { GachaInitialize } from './endpoints/Gacha/1.initialize';
import { GachaSubmit } from './endpoints/Gacha/2.submit';

const _app = express();
_app.use(bodyParser.json());
_app.use(cors());

async function initialize(): Promise<void> {}
export const app = new WrappedExpress({ application: _app, initialize });
app.createPostHandler<Ping.Interface>('ping', Ping.Handler, Ping.Schema);
app.createPostHandler<GachaInitialize.Interface>('gacha/initialize', GachaInitialize.Handler, GachaInitialize.Schema);
app.createPostHandler<GachaSubmit.Interface>('gacha/submit', GachaSubmit.Handler, GachaSubmit.Schema);
