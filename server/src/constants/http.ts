/**
 * HTTP Status Code: 100 - Continue
 * 
 * Indicates that the initial part of the request has been received and the client
 * should continue with the request or ignore if the request is already finished.
 * 
 */
export const CONTINUE = 100;

/**
 * HTTP Status Code: 200 - OK
 * 
 * Indicates that the request has succeeded. The meaning of a success depends on
 * the HTTP method used:
 * - GET: The resource has been fetched and is transmitted in the message body.
 * - POST: The resource describing the result of the action is transmitted in the message body.
 * 
 */
export const OK = 200;

/**
 * HTTP Status Code: 201 - Created
 * 
 * Indicates that the request has been fulfilled and has resulted in a new resource
 * being created.
 * 
 */
export const CREATED = 201;

/**
 * HTTP Status Code: 400 - Bad Request
 * 
 * The server cannot or will not process the request due to an apparent client error
 * (e.g., malformed request syntax or invalid request parameters).
 * 
 */
export const BAD_REQUEST = 400;

/**
 * HTTP Status Code: 401 - Unauthorized
 * 
 * Indicates that the request has not been applied because it lacks valid
 * authentication credentials for the target resource.
 * 
 */
export const UNAUTHORIZED = 401;

/**
 * HTTP Status Code: 404 - Not Found
 * 
 * The server cannot find the requested resource. This can happen if the URL is
 * incorrect or if the resource is no longer available.
 * 
 */
export const NOT_FOUND = 404;

/**
 * HTTP Status Code: 409 - Conflict
 * 
 * Indicates that the request could not be completed due to a conflict with the
 * current state of the target resource. This is commonly used when trying to update
 * a resource that has been modified since the last fetch.
 * 
 */
export const CONFLICT = 409;

/**
 * HTTP Status Code: 422 - Unprocessable Entity
 * 
 * The server understands the content type of the request entity (hence a 415 Unsupported
 * Media Type status code is not appropriate), and the syntax of the request entity is correct
 * (thus a 400 Bad Request status code is not appropriate), but was unable to process the contained
 * instructions.
 * 
 */
export const UNPROCESSABLE_CONTENT = 422;

/**
 * HTTP Status Code: 429 - Too Many Requests
 * 
 * The user has sent too many requests in a given amount of time ("rate limiting").
 * 
 */
export const TOO_MANY_REQUESTS = 429;

/**
 * HTTP Status Code: 500 - Internal Server Error
 * 
 * A generic error message indicating that the server encountered an unexpected condition
 * that prevented it from fulfilling the request.
 * 
 */
export const INTERNAL_SERVER_ERROR = 500;

export type HttpStatusCode = 
  | typeof CONTINUE
  | typeof OK
  | typeof CREATED
  | typeof BAD_REQUEST
  | typeof UNAUTHORIZED
  | typeof NOT_FOUND
  | typeof CONFLICT
  | typeof UNPROCESSABLE_CONTENT
  | typeof TOO_MANY_REQUESTS
  | typeof INTERNAL_SERVER_ERROR;