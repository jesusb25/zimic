/**
 * Error thrown when the request saving option provided to an HTTP interceptor is invalid.
 *
 * @see {@link https://zimic.dev/docs/interceptor/api/create-http-interceptor `createHttpInterceptor` API reference}
 */
class InvalidHttpInterceptorRequestSavingError extends TypeError {
  constructor(value: unknown, expected: string) {
    super(`Invalid HTTP interceptor request saving: ${value}. Expected ${expected}.`);
    this.name = 'InvalidHttpInterceptorRequestSavingError';
  }
}

export default InvalidHttpInterceptorRequestSavingError;
