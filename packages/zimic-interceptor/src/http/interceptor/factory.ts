import { HttpSchema } from '@zimic/http';

import { HttpInterceptorRequestSaving } from '@/http/interceptor/types/public';

import InvalidHttpInterceptorRequestSavingError from './errors/InvalidHttpInterceptorRequestSavingError';
import UnknownHttpInterceptorTypeError from './errors/UnknownHttpInterceptorTypeError';
import LocalHttpInterceptor from './LocalHttpInterceptor';
import RemoteHttpInterceptor from './RemoteHttpInterceptor';
import { HttpInterceptorOptions, LocalHttpInterceptorOptions, RemoteHttpInterceptorOptions } from './types/options';
import {
  LocalHttpInterceptor as PublicLocalHttpInterceptor,
  RemoteHttpInterceptor as PublicRemoteHttpInterceptor,
} from './types/public';

function isLocalHttpInterceptorOptions(options: HttpInterceptorOptions): options is LocalHttpInterceptorOptions {
  return options.type === undefined || options.type === 'local';
}

function isRemoteHttpInterceptorOptions(options: HttpInterceptorOptions): options is RemoteHttpInterceptorOptions {
  return options.type === 'remote';
}

/** @see {@link https://zimic.dev/docs/interceptor/api/create-http-interceptor `createHttpInterceptor()` API reference} */
export function createHttpInterceptor<Schema extends HttpSchema>(
  options: LocalHttpInterceptorOptions,
): PublicLocalHttpInterceptor<Schema>;
export function createHttpInterceptor<Schema extends HttpSchema>(
  options: RemoteHttpInterceptorOptions,
): PublicRemoteHttpInterceptor<Schema>;
export function createHttpInterceptor<Schema extends HttpSchema>(
  options: HttpInterceptorOptions,
): PublicLocalHttpInterceptor<Schema> | PublicRemoteHttpInterceptor<Schema>;
export function createHttpInterceptor<Schema extends HttpSchema>(
  options: HttpInterceptorOptions,
): PublicLocalHttpInterceptor<Schema> | PublicRemoteHttpInterceptor<Schema> {
  const type = options.type;

  const requestSaving: unknown = options.requestSaving;
  if (requestSaving !== undefined) {
    if (typeof requestSaving !== 'object' || requestSaving === null || Array.isArray(requestSaving)) {
      throw new InvalidHttpInterceptorRequestSavingError(requestSaving, 'an object');
    }

    const { enabled, safeLimit } = requestSaving as Partial<HttpInterceptorRequestSaving>;

    if (enabled !== undefined && typeof enabled !== 'boolean') {
      throw new InvalidHttpInterceptorRequestSavingError(enabled, 'a boolean');
    }

    if (safeLimit !== undefined && (typeof safeLimit !== 'number' || !Number.isInteger(safeLimit) || safeLimit < 0)) {
      throw new InvalidHttpInterceptorRequestSavingError(safeLimit, 'a non-negative integer');
    }
  }

  if (isLocalHttpInterceptorOptions(options)) {
    return new LocalHttpInterceptor<Schema>(options);
  } else if (isRemoteHttpInterceptorOptions(options)) {
    return new RemoteHttpInterceptor<Schema>(options);
  }

  throw new UnknownHttpInterceptorTypeError(type);
}
