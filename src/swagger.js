import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMF Gadgets API",
      version: "1.0.0",
      description: `API for managing IMF gadgets  
      
      **Common Notes**:
      - select the upraisedhiringchallenge hosted server if not running in localhost  
      - Signup and then login with the same credintial to get the bearer token
      - Authorization via Bearer token is required for all endpoints.
      - Make sure to add only token in Authorize and not 'Bearer adkdd.dd.dd' otherwise you will get jwt malformed error.   
      - All statuses are case-sensitive.  
      - For Patch (update gadgets) and Post (create gadgets), only 4 statuses are available: ["Available", "Deployed", "Destroyed", "Decommissioned"].  
      - Ensure your payload conforms to the expected schema for smooth processing.`,
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
