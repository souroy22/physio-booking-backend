"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dayControllers_1 = __importDefault(require("../controllers/dayControllers"));
const dayRouters = express_1.default.Router();
dayRouters.get("/create-timing", 
// verifyToken,
// checkAdmin,
dayControllers_1.default.createSlotsForCurrentWeek);
exports.default = dayRouters;
//# sourceMappingURL=dayRouters.js.map