"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const whitelist = ["http://localhost:5173", "https://physioo.netlify.app"];
// Configure CORS options
exports.corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in the whitelist or if it's a local request
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            console.log("origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
};
//# sourceMappingURL=corsConfig.js.map