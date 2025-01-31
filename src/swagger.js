import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMF Gadgets API",
      version: "1.0.0",
      description: "API for managing IMF gadgets",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://upraisedhiringchallenge-production.up.railway.app",
        description: "Hosted server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
