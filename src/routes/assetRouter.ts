import { Router } from "express";
import { body, param } from "express-validator";
import { AssetController } from "../controllers/AssetController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate); // Apply auth middleware to all routes

// Route to create a new asset
router.post('/',
    body('name').notEmpty().withMessage('El nombre es obligatorio'), // Name is required
    body('latitude').notEmpty().withMessage('la latitud es obligatoria'), // Latitude is required
    body('longitude').notEmpty().withMessage('la longitud es obligatoria'), // Longitude is required
    body('created_at').notEmpty().withMessage('la fecha es obligatoria'), // Date is required
    body('icon').notEmpty().withMessage('El icono es obligatorio'), // Icon is required
    handleInputErrors,
    AssetController.createAsset
);

// Route to get all assets
router.get('/', 
    AssetController.getAllAsset
);

// Route to get a single asset by ID
router.get('/:id',
    param('id').isMongoId().withMessage('Id no valido'), // Ensure ID is a valid MongoDB ID
    handleInputErrors,
    AssetController.getAssetById
);

// Route to update an asset
router.put('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('latitude').notEmpty().withMessage('la latitud es obligatoria'),
    body('longitude').notEmpty().withMessage('la longitud es obligatoria'),
    body('created_at').notEmpty().withMessage('la fecha es obligatoria'),
    body('icon').notEmpty().withMessage('El icono es obligatorio'),
    handleInputErrors,
    AssetController.updateAsset
);

// Route to delete an asset
router.delete('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    AssetController.deleteAsset
);

export default router;
