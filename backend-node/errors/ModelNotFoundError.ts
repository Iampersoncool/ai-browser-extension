export default class ModelNotFoundError extends Error {
  constructor(message: string, opts?: ErrorOptions) {
    super(message, opts);

    this.name = 'ModelNotFoundError';
  }
}
