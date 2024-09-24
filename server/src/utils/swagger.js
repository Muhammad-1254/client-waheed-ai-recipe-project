import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import path from 'path'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recipe API',
      description: "Recipe API Documentation",
      contact: {
        name: "Muhammad Usman",
        email: "usmansoomro1234@gmail.com",
        // url:""
    },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "development server"
      }
    ]
  },
  apis: [ path.join(process.cwd(),"/src/routes/user.route.js"), path.join(process.cwd(),"/src/routes/recipe.route.js") ],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
export default swaggerDocs