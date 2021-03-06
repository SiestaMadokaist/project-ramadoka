export interface ENV {
  AWS_REGION: string;
  DEFAULT_PORT: string;
  LAMBDA_ENV: 'true' | 'false';
  NODE_ENV: 'development' | 'production';
  // env variable goes here...
}

function getEnv<K extends (keyof ENV)>(...keys: K[]): { [k in K]: ENV[k] } {
  const accumulator = {} as { [k in K]: ENV[k] };
  for (const key of keys) {
    const value = process.env[key];
    if (!value) { throw new Error(`missing environment variables: ${key}`); }
    accumulator[key] = value as ENV[K];
  }
  return accumulator;
}

function initializeEnv(): ENV {
  const defaults = {
    AWS_REGION: 'ap-southeast-1',
    DEFAULT_PORT: '4000',
    LAMBDA_ENV: 'false',
  };
  return {
    ...defaults,
    ...process.env,
    ...getEnv('NODE_ENV', 'LAMBDA_ENV'),
  };
}

export const env = initializeEnv();
