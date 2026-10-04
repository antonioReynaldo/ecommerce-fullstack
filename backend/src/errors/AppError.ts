export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details: unknown = null,
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message: string, details: unknown = null) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message: string, details: unknown = null) {
    return new AppError(message, 401, details);
  }

  static forbidden(message: string, details: unknown = null) {
    return new AppError(message, 403, details);
  }

  static notFound(message: string, details: unknown = null) {
    return new AppError(message, 404, details);
  }

  static conflict(message: string, details: unknown = null) {
    return new AppError(message, 409, details);
  }

  static internal(message: string, details: unknown = null) {
    return new AppError(message, 500, details);
  }
}
