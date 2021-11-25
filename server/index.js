require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const router = require('./app/router');

const app = express();

const port = process.env.PORT || 5000;

//ouverture de l'API aux requests venant de localhost et de la machine de prod
app.use(cors({
    origin: [`http://localhost:${port}`, `http://178.32.220.230/`]
}));

app.use(express.json());

//doc de l'API
const options = {
    info: {
      version: '1.0.0',
      title: 'PongAPI',
      description: 'API de consultation/ajout des scores',
      license: {
        name: 'MIT',
      },
    },
    security: {
      BasicAuth: {
        type: 'http',
        scheme: 'basic',
      },
    },
    baseDir: __dirname,
    filesPattern: './**/*.js',
    swaggerUIPath: '/api-docs',
    exposeSwaggerUI: true,
    exposeApiDocs: true,
    apiDocsPath: '/v3/api-docs',
    notRequiredAsNullable: false,
    // You can customize your UI options.
    // you can extend swagger-ui-express config. You can checkout an example of this
    // in the `example/configuration/swaggerOptions.js`
    swaggerUiOptions: {},
    multiple: false,
};
  
expressJSDocSwagger(app)(options);
  
app.use(router)

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});