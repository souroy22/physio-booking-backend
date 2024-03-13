"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = __importDefault(require("../controllers/userControllers"));
const verifyToken_1 = require("../middlewares/verifyToken");
const checkSales_1 = __importDefault(require("../middlewares/checkSales"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const userRouters = express_1.default.Router();
userRouters.get("/get-user", verifyToken_1.verifyToken, userControllers_1.default.getUserData);
userRouters.post("/get-user-by-mailid", verifyToken_1.verifyToken, checkSales_1.default, userControllers_1.default.getUserByMailId);
userRouters.put("/update/:id", 
// verifyToken,
upload.single("avatar"), userControllers_1.default.editUserData);
exports.default = userRouters;
//# sourceMappingURL=userRouters.js.map