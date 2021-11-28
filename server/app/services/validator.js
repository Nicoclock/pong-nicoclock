/**
 * Méthodes pour valider les data d'une requête en fonction d'un schéma Joi
 */

module.exports = {
    validateBody: (schema) => (request, response, next) => {
        const {error} = schema.validate(request.body);
        if (error) 
            return response.status(400).json(error.message);
        next();
    },

    validateQuery: (schema) => (request, response, next) => {
        const {error} = schema.validate(request.query);
        if (error) 
            return response.status(400).json(error.message);
        next();
    },

    validateParams: (schema) => (request, response, next) => {
        const {error} = schema.validate(request.params);
        if (error) 
            return response.status(400).json(error.message);
        next();
    }
}