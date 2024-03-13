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
const userControllers = {
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.user.user;
            return res.status(200).json({ user });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
    getUserByMailId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: "Please provide email id" });
            }
            const user = yield userModel_1.default.findOne({ email }).select({ _id: 1 });
            if (!user) {
                return res.status(200).json({ msg: "No user found" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
    editUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, phone, address } = req.body;
            let avatar = null;
            if (req.file && req.file.buffer) {
                avatar = req.file.buffer;
            }
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Please provide the id" });
            }
            const allData = { name, email, phone, address, avatar };
            const updateData = {};
            for (const [key, value] of Object.entries(allData)) {
                if (value && value !== null) {
                    updateData[key] = value;
                }
            }
            const updatedUser = userModel_1.default.findOneAndUpdate({ email }, updateData, {
                new: true,
            }).select({ name: 1, email: 1, address: 1, phone: 1, avatar: 1, _id: 0 });
            return res.status(200).json({ user: updateData });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
};
exports.default = userControllers;
//# sourceMappingURL=userControllers.js.map