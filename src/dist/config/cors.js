"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
// CORS configuration for the server
exports.corsConfig = {
    origin: function (origin, callback) {
        // Only requests from this URL will be allowed
        const whitelist = [process.env.FRONTEND_URL];
        // If the server is running with "--api" argument, allow requests with no origin (like Postman)
        if (process.argv[2] === '--api') {
            whitelist.push(undefined);
        }
        // Check if the request origin is in the whitelist
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            // Block request if origin is not allowed
            callback(new Error("Error de CORS"));
        }
    },
};
//# sourceMappingURL=cors.js.map