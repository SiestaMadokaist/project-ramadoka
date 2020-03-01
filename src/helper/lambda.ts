// import { JoiOf, parseBody } from './utility';
import { Maybe } from '@cryptoket/ts-maybe';
import { Joy } from './joy';
import { logger } from './logger';
import { PostEndpoint } from './phantom-types';
import { parseBody } from './utility';

// interface LambdaResponse {
//   data: string;
//   headers: object;
//   statusCode: number;
// }

export const headers = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export interface LambdaContext {
  awsRequestId: string;
  functionName: string;
  functionVersion: string | number; // ????
  invokedFunctionARN: string;
  logGroupName: string;
  logStreamName: string;
  memoryLimitInMB: string | number; // ???
}

export interface LambdaEvent<PE extends PostEndpoint> {
  body: PE['body'];
  headers?: {
    Authorization?: string;
  };
}

export interface LambdaResponse<PE extends PostEndpoint> {
  data: PE['response'];
  statusCode: number;
}

interface FinalizedResponse {
  data: string;
  headers: (typeof headers);
  statusCode: number;
}

export type LambdaHandler<PE extends PostEndpoint> = (event: LambdaEvent<PE>, context?: LambdaContext) => Promise<LambdaResponse<PE>>;
export type FinalizedLambdaAPIHandler<PE extends PostEndpoint> = (event: LambdaEvent<PE>, context?: LambdaContext) => Promise<FinalizedResponse>;

export function createLambdaAPI<PE extends PostEndpoint>(handler: LambdaHandler<PE>, schema: Joy.SchemaOf<PE['body']>): FinalizedLambdaAPIHandler<PE> {
  return async (event, context) => {
    const body = await parseBody(event.body, schema);
    return handler({ ...event, body }, context).then((result) => {
      const data = JSON.stringify({ data: result.data, error: false });
      return {
        data,
        headers,
        statusCode: result.statusCode,
      };
    }).catch((error) => {
      const mError = Maybe.fromValue(error);
      const message = mError.map((e) => e.message).value() || 'Something went wrong';
      const name = mError.map((e) => e.name).value() || 'InternalServerError';
      const statusCode = mError.map((e) => e.statusCode).value() || 500;
      const errorData = JSON.stringify({ message, name, error: true });
      return {
        data: errorData,
        headers,
        statusCode,
      };
    });
  };
}
