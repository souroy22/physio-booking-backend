"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouters_js_1 = __importDefault(require("./authRouters.js"));
const doctorRoutes_1 = __importDefault(require("./doctorRoutes"));
const dayRouters_1 = __importDefault(require("./dayRouters"));
const slotRouters_1 = __importDefault(require("./slotRouters"));
const userRouters_1 = __importDefault(require("./userRouters"));
const router = express_1.default.Router();
router.use("/auth", authRouters_js_1.default);
router.use("/doctor", doctorRoutes_1.default);
router.use("/day", dayRouters_1.default);
router.use("/slot", slotRouters_1.default);
router.use("/user", userRouters_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map