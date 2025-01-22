import { SwaggerOptions } from "swagger-ui-express";

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the Swagger version
    info: {
      title: 'API Documentation', // Title for the API documentation
      version: '1.0.0', // API version
      description: 'A simple Express API',
    },
  },
  apis: ['./routes/*.ts'], // Path to the API docs (where your route files are)
};

export default swaggerOptions;
