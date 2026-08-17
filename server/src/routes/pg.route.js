const express = require('express');
const pgController  = require('../controllers/pg.controller');
const { authMiddleware, authorizeRoleMiddleware } = require('../middlewares/auth.middleware');
const {
    validateCreatePG,
    validateUpdatePG,
} = require("../validations/pg.validation");
const router = express.Router();

router.get('/', pgController.getAllPgsController);
router.get('/mine', authMiddleware,authorizeRoleMiddleware('owner'), pgController.getMyPgsController);
router.get('/:pgId/manage', authMiddleware, authorizeRoleMiddleware('owner'), pgController.getPgForOwnerController);
router.get('/:id', authMiddleware, pgController.getPGByIdController);

router.post('/', authMiddleware, authorizeRoleMiddleware('owner'), validateCreatePG, pgController.createPgController);
router.put('/:pgId', authMiddleware, authorizeRoleMiddleware('owner'), validateUpdatePG, pgController.updatePgController);
router.delete('/:pgId', authMiddleware, authorizeRoleMiddleware('owner'), pgController.deletePgController);

module.exports = router;
