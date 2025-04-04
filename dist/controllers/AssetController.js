"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const Asset_1 = __importDefault(require("../models/Asset"));
class AssetController {
    // Creates a new asset and assigns it to the authenticated user
    static createAsset = async (req, res) => {
        const asset = new Asset_1.default(req.body);
        asset.user = req.user.id;
        try {
            await asset.save();
            res.send('Activo creado correctamente');
        }
        catch (error) {
            console.log(error); // Logs error in case something goes wrong
        }
    };
    // Retrieves all assets based on user role
    static getAllAsset = async (req, res) => {
        try {
            console.log("Usuario autenticado:", req.user); // Debugging: Logs user info
            let assets;
            if (req.user.role === "Administrador") {
                // Admins can see all assets
                assets = await Asset_1.default.find({});
            }
            else {
                // Operators can only see their own assets
                assets = await Asset_1.default.find({ user: req.user.id });
            }
            res.json(assets);
        }
        catch (error) {
            console.error("Error al obtener activos:", error);
            res.status(500).json({ message: "Error al obtener los activos" });
        }
    };
    // Retrieves a single asset by ID and checks permissions
    static getAssetById = async (req, res) => {
        const { id } = req.params;
        try {
            const asset = await Asset_1.default.findById(id);
            if (!asset) {
                res.status(404).json({ message: "Activo no encontrado" });
                return;
            }
            if (req.user.role === "Operario") {
                // Ensures the user has permission to view the asset
                if (asset.user.toString() !== req.user.id) {
                    res.status(403).json({ message: "No tienes permisos para acceder a este activo" });
                    return;
                }
            }
            res.json(asset);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server Error' });
        }
    };
    // Updates an existing asset, only if the user owns it
    static updateAsset = async (req, res) => {
        const { id } = req.params;
        try {
            const asset = await Asset_1.default.findById(id);
            if (!asset) {
                res.status(404).json({ message: "Activo no encontrado" });
                return;
            }
            if (asset.user.toString() !== req.user.id) {
                res.status(403).json({ message: "No tienes permisos para modificar este activo" });
                return;
            }
            // Updates asset properties
            asset.name = req.body.name;
            asset.comments = req.body.comments;
            asset.latitude = req.body.latitude;
            asset.longitude = req.body.longitude;
            asset.created_at = req.body.created_at;
            asset.icon = req.body.icon;
            await asset.save();
            res.send('Activo Actualizado');
        }
        catch (error) {
            console.log(error); // Logs errors for debugging
        }
    };
    // Deletes an asset, only if the user owns it
    static deleteAsset = async (req, res) => {
        const { id } = req.params;
        try {
            const asset = await Asset_1.default.findById(id);
            if (!asset) {
                res.status(404).json({ message: "Activo no encontrado" });
                return;
            }
            if (asset.user.toString() !== req.user.id) {
                res.status(403).json({ message: "No tienes permisos para eliminar este activo" });
                return;
            }
            await asset.deleteOne();
            res.send('Activo Eliminado');
        }
        catch (error) {
            console.log(error); // Logs error if deletion fails
        }
    };
}
exports.AssetController = AssetController;
//# sourceMappingURL=AssetController.js.map