const express = require('express');
const pgController  = require('../controllers/pg.controller');
const { authMiddleware, authorizeRoleMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();

// router.get('/', getAllPgs);

router.post('/', authMiddleware, authorizeRoleMiddleware('owner'), pgController.createPgController);
router.put('/:pgId', authMiddleware, authorizeRoleMiddleware('owner'), pgController.updatePgController);
router.delete('/:pgId', authMiddleware, authorizeRoleMiddleware('owner'), pgController.deletePgController);
// router.post('/', pgController.createPgController);
module.exports = router;