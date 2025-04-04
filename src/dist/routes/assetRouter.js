"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AssetController_1 = require("../controllers/AssetController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate); // Apply auth middleware to all routes
// Route to create a new asset
router.post('/', (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es obligatorio'), // Name is required
(0, express_validator_1.body)('latitude').notEmpty().withMessage('la latitud es obligatoria'), // Latitude is required
(0, express_validator_1.body)('longitude').notEmpty().withMessage('la longitud es obligatoria'), // Longitude is required
(0, express_validator_1.body)('created_at').notEmpty().withMessage('la fecha es obligatoria'), // Date is required
(0, express_validator_1.body)('icon').notEmpty().withMessage('El icono es obligatorio'), // Icon is required
validation_1.handleInputErrors, AssetController_1.AssetController.createAsset);
// Route to get all assets
router.get('/', AssetController_1.AssetController.getAllAsset);
// Route to get a single asset by ID
router.get('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('Id no valido'), // Ensure ID is a valid MongoDB ID
validation_1.handleInputErrors, AssetController_1.AssetController.getAssetById);
// Route to update an asset
router.put('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('Id no valido'), (0, express_validator_1.body)('name').notEmpty().withMessage('El nombre es obligatorio'), (0, express_validator_1.body)('latitude').notEmpty().withMessage('la latitud es obligatoria'), (0, express_validator_1.body)('longitude').notEmpty().withMessage('la longitud es obligatoria'), (0, express_validator_1.body)('created_at').notEmpty().withMessage('la fecha es obligatoria'), (0, express_validator_1.body)('icon').notEmpty().withMessage('El icono es obligatorio'), validation_1.handleInputErrors, AssetController_1.AssetController.updateAsset);
// Route to delete an asset
router.delete('/:id', (0, express_validator_1.param)('id').isMongoId().withMessage('Id no valido'), validation_1.handleInputErrors, AssetController_1.AssetController.deleteAsset);
exports.default = router;
//# sourceMappingURL=assetRouter.js.map