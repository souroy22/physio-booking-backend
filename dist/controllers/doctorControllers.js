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
const slotModel_1 = __importDefault(require("../models/slotModel"));
const doctorControllers = {
    scheduleSlots: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, data } = req.body;
            if (!(id && data)) {
                return res.status(400).json({ error: "Provide all valid details" });
            }
            const doctor = yield userModel_1.default.findOne({ _id: id, role: "Doctor" });
            if (!doctor) {
                return res.status(400).json({ error: "Invalid doctor" });
            }
            for (const slotId of data) {
                yield slotModel_1.default.findByIdAndUpdate(slotId, { $push: { availableDoctors: id } }, { new: true });
            }
            return res.status(200).json({ msg: "Successfully scheduled slots!" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getAllDoctors: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const doctors = yield userModel_1.default.find({ role: "Doctor" }).select({
                name: 1,
            });
            return res.status(200).json(doctors);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Simething went wrong" });
            }
        }
    }),
};
exports.default = doctorControllers;
//# sourceMappingURL=doctorControllers.js.map