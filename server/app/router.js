const {Router} = require('express');
const controller = require('./controller');

const router = Router();

router.get('/scores', controller.scores);

router.get('/scores/:name', controller.scoresFor);

router.post('/scores', controller.addScore);

module.exports = router;