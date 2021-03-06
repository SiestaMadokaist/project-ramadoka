import { Maybe } from '@cryptoket/ts-maybe';
import express from 'express';
import { IncomingHttpHeaders } from 'http';
// import { JoiOf, parseBody } from './utility';
import { env } from './env';
import { BaseException } from './errors';
import { Joy } from './joy';
import { createLambdaAPI, FinalizedLambdaAPIHandler, LambdaContext, LambdaEvent, LambdaHandler } from './lambda';
import { logger } from './logger';
import { PostEndpoint } from './phantom-types';
import { parseBody } from './utility';

interface EndpointHeaders extends IncomingHttpHeaders {
  Authorization?: string;
}
interface EndpointRequestPost<Body> {
  body: Body;
  headers?: EndpointHeaders;
}

interface ErrorObject {
  error: true;
  message: string;
  name: string;
}

interface SuccessObject<Data> {
  data: Data;
  error: false;
}

interface EndpointResponse<Data> extends express.Response {
  send(data: ErrorObject | SuccessObject<Data>): this;
}

// export type LambdaHandler<PE extends PostEndpoint> = (event: LambdaEvent<PE>, context: LambdaContext) => Promise<LambdaResponse<PE>>;
export type PostHandler<T extends PostEndpoint> = (req: EndpointRequestPost<T['body']>) => Promise<T['response']>;

type RequestHandler<T> = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<T>;

export interface IWrappedExpress {
  application: express.Express;
  initialize: () => Promise<void>;
}

export class WrappedExpress {
  constructor(private props: IWrappedExpress) {}

  application(): IWrappedExpress['application'] {
    return this.props.application;
  }

  createPostHandler<PE extends PostEndpoint = never>(path: PE['path'], handler: PostHandler<PE>, schema: Joy.SchemaOf<PE['body']>): FinalizedLambdaAPIHandler<PE> {
    this.createExpressHandler(path, handler, schema);
    return this.createLambdaHandler(path, handler, schema);
  }

  async listen(port: string | number): Promise<void> {
    this.application().listen(port, () => {
      logger.log({
        listeningOn: port,
        nodeVersion: process.version,
      });
    });
  }

  private createExpressHandler<PE extends PostEndpoint = never>(path: PE['path'], handler: PostHandler<PE>, schema: Joy.SchemaOf<PE['body']>): void {
    if (env.LAMBDA_ENV === 'true') { return; }
    const dirtyPath = path.replace(/^\/+/, '');
    const cleanPath = `/${dirtyPath}`;
    const swaggerPath = `/swagger/${dirtyPath}`;
    this.application().post(cleanPath, this.expressWrap<PE>(201, handler, schema));
  }

  private createLambdaHandler<PE extends PostEndpoint = never>(path: PE['path'], handler: PostHandler<PE>, schema: Joy.SchemaOf<PE['body']>): FinalizedLambdaAPIHandler<PE> {
    const lambdaHandler: LambdaHandler<PE> = async (event: LambdaEvent<PE>, context?: LambdaContext) => {
      const result = await handler(event);
      return { data: result, statusCode: 201 };
    };
    return createLambdaAPI(lambdaHandler, schema);
  }

  private expressWrap<PE extends PostEndpoint>(code: number, handler: RequestHandler<PE['response']>, schema: Joy.SchemaOf<PE['body']>): RequestHandler<void> {
    const wrapped = async (req: express.Request, res: EndpointResponse<PE['response']>, next: express.NextFunction) => {
      parseBody<PE['body']>(req.body, schema).then((body) => {
        req.body = body;
        const result = handler(req, res, next);
        return result;
      }).then((result) => {
        res.status(code).send({
          data: result,
          error: false,
        });
      }).catch((error: BaseException) => {
        logger.e(error);
        const mError = Maybe.fromValue(error);
        const message = mError.map((e) => e.message).value() || 'Something went wrong';
        const name = mError.map((e) => e.name).value() || 'InternalServerError';
        const statusCode = mError.map((e) => e.statusCode).value() || 500;
        res.status(statusCode).send({
          error: true,
          message,
          name,
        });
      });
    };
    return wrapped;
  }
}
