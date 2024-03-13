"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorControllers_1 = __importDefault(require("../controllers/doctorControllers"));
const verifyToken_1 = require("../middlewares/verifyToken");
const checkSalerOrAdmin_1 = __importDefault(require("../middlewares/checkSalerOrAdmin"));
const checkDoctor_1 = __importDefault(require("../middlewares/checkDoctor"));
const doctorRouters = express_1.default.Router();
doctorRouters.put("/schedule-slots", verifyToken_1.verifyToken, checkDoctor_1.default, doctorControllers_1.default.scheduleSlots);
doctorRouters.get("/all", verifyToken_1.verifyToken, checkSalerOrAdmin_1.default, doctorControllers_1.default.getAllDoctors);
exports.default = doctorRouters;
//# sourceMappingURL=doctorRoutes.js.map