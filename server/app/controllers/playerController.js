const dataMapper = require('../dataMapper');

module.exports = {
    /**
     * Permet de changer le pool de connexion à la BDD
     * @param {DBHandler} db - Instance du pool de connexion pour les tests 
     */
    setDb: function(db) {
        dataMapper.setDb(db);
    },
    /**
     * Renvoie la liste de tous les players présents en BDD
     * @param {Request} _ 
     * @param {Response} response 
     * @returns undefined en environnement de prod, l'argument passeé à la méthode json en environnement de test
     */
    players: async function(_, response) {
        try {
            return response.json(await dataMapper.players());
        } catch(error) {
            return response.status(500).json(error.message);
        }
    }
}