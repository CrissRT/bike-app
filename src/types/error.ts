export class BikeNotFoundError extends Error {
  constructor(id: number) {
    super(`Bike with ID ${id} not found`);
    this.name = "BikeNotFoundError";
  }
}

export class GoogleSheetsError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = "GoogleSheetsError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
