import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GovChain API",
      version: "1.0.0",
      description: "API documentation for GovChain backend",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;