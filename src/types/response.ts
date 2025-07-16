export interface ErrorResponse {
  success: false;
  data: null;
  error: Error;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  error: null;
}
