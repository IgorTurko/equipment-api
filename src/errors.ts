import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export enum ErrorCodes {
  APPLICATION_ERROR = 'APPLICATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_IMPLEMENTED_ERROR = 'NOT_IMPLEMENTED',
  DB_CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
}

export class ApplicationError extends Error implements FastifyError {
  name: string;

  constructor(
    public message: string,
    public code: ErrorCodes = ErrorCodes.APPLICATION_ERROR,
    public error?: Error
  ) {
    super(message);
    this.name = code;
  }
}

export class NotFoundError extends ApplicationError {
  /**
   * Thrown when something wasn't found
   * @param subject, what wasn't found
   * @param id, id of what wasn't found
   * @param code, identifies the error
   */
  constructor(public subject: string, public id: string, code?: ErrorCodes) {
    super(`${subject} [${id}] not found`, code ? code : ErrorCodes.NOT_FOUND_ERROR);
  }
}

export class ValidationError extends ApplicationError {
  constructor(public message: string, code?: ErrorCodes) {
    super(message, code ? code : ErrorCodes.VALIDATION_ERROR);
  }
}

export class DbConnectionError extends ApplicationError {
  constructor(public message: string, code?: ErrorCodes) {
    super(message, code ? code : ErrorCodes.DB_CONNECTION_ERROR);
  }
}

/**
 * ErrorHandler for all the Errors that aren't handled in the endpoint.
 *
 * @param fastify
 * @param error
 * @param request
 * @param reply
 */
export const handleApplicationErrors = (
  _fastify: FastifyInstance,
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
): void => {
  if (error instanceof NotFoundError) {
    reply.notFound(error.message);
  } else if (error instanceof ValidationError) {
    reply.unprocessableEntity(error.message);
  } else if (error instanceof ApplicationError) {
    reply.badRequest(error.message);
  } else if (error.validation) {
    reply.status(422).send({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: error.message,
      validationErrors: error.validation,
    });
  } else {
    _fastify.log.error(error, error.message);
    reply.send(error);
  }
};
