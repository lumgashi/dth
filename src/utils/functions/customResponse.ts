import { ErrorResponse, SuccessResponse } from 'types';

/**
 * Get custom response as object
 * @param {Object} response - get an object as customResponse interface
 * @returns {Object} - return an object of all keys in ErrorResponse/SuccessResponse interfce
 */
export function customResponse(
  response: SuccessResponse | ErrorResponse,
): SuccessResponse | ErrorResponse {
  return response;
}
