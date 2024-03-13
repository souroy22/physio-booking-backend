"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const getUser_1 = __importDefault(require("../utils/getUser"));
const verifyPassword_1 = __importDefault(require("../utils/verifyPassword"));
const genarateToken_1 = __importDefault(require("../utils/genarateToken"));
const destroyToken_1 = __importDefault(require("../utils/destroyToken"));
const authControllers = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password, role = "User", avatar = null } = req.body;
            if (role === "Admin") {
                return res.status(403).json({ error: "Forbidden request" });
            }
            if (!(name && email && password)) {
                return res.status(400).json({ error: "Please fill all the details" });
            }
            const isExist = yield (0, getUser_1.default)(email);
            if (isExist !== null) {
                return res
                    .status(400)
                    .json({ error: "This mail id is already exist." });
            }
            let newUser = new userModel_1.default({ name, email, password, role, avatar });
            newUser = yield newUser.save();
            const user = {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                avatar: newUser.avatar || null,
                id: newUser._id,
            };
            const token = yield (0, genarateToken_1.default)(user);
            return res.status(200).json({
                user,
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    signin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!(email && password)) {
                return res.status(400).json({ error: "Please fill all the details" });
            }
            const isExist = yield (0, getUser_1.default)(email);
            if (isExist === null) {
                return res.status(400).json({ error: "This mailid doen't exists" });
            }
            if (!(0, verifyPassword_1.default)(password, isExist.password)) {
                return res
                    .status(401)
                    .json({ error: "EmailId or password doesn't match" });
            }
            const user = {
                name: isExist.name,
                email: isExist.email,
                role: isExist.role,
                avatar: isExist.avatar || null,
                id: isExist._id,
            };
            const token = yield (0, genarateToken_1.default)(user);
            return res.status(200).json({
                user,
                token,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    signout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, destroyToken_1.default)(req);
            return res.status(200).json({ msg: "Successfully logged out!" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
};
exports.default = authControllers;
//# sourceMappingURL=authControllers.js.map