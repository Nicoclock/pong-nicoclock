const express = require('express');
const cors = require('cors');
const expressJSDocSwagger = require('express-jsdoc-swagger');

const app = express();

const port = process.env.PORT || 5000;

// ouverture de l'API aux requests venant de localhost et de la machine de prod
app.use(cors({
	origin: [`http://localhost:${port}`, `http://178.32.220.230/`]
}));

// parser json pour le request.body
app.use(express.json());

//doc de l'API
const options = {
	info: {
		version: '1.0.0',
		title: 'PongAPI',
		description: 'API de consultation/ajout des scores et des joueurs',
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
	swaggerUiOptions: {},
	multiple: false,
};

expressJSDocSwagger(app)(options);

// Utilisation d'un http.Server pour libérer correctement les ressources lors des tests
const httpServer = require('http').createServer(app);

if (process.env.NODE_ENV === 'test') {
	/**
	 * Permet de changer le pool de connexion à la BDD
	 * @param {DBHandler} db - Instance de test
	 */
	httpServer.setDb = function (db) {
		router.setDb(db);
	}

	/**
	 * Permet de changer l'instance de connexion à Redis
	 * @param {Cache} cache 
	 */
	httpServer.setCache = function (cache) {
		router.setCache(cache);
	}

}

// on exporte une fonction afin de pouvoir configurer les connexion à Postgres et à Redis lors des tests
module.exports = (db, redis) => {
	const router = require('./app/router')(db, redis);
	app.use(router);
	return httpServer;
}