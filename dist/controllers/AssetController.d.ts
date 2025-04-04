import type { Request, Response } from "express";
export declare class AssetController {
    static createAsset: (req: Request, res: Response) => Promise<void>;
    static getAllAsset: (req: Request, res: Response) => Promise<void>;
    static getAssetById: (req: Request, res: Response) => Promise<void>;
    static updateAsset: (req: Request, res: Response) => Promise<void>;
    static deleteAsset: (req: Request, res: Response) => Promise<void>;
}
