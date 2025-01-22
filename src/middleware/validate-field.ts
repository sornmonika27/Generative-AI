import { Request, Response, NextFunction } from 'express';

// Middleware function to check for required fields
export function validateRequiredFields(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    console.log("-------- ", req.body)
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    next();
  };
}