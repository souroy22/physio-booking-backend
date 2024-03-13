"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    doctor: {
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    slot: {
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: "Slot",
    },
    patient: {
        type: mongoose_1.default.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    remarks: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Appointments = mongoose_1.default.model("Appointments", appointmentSchema);
exports.default = Appointments;
//# sourceMappingURL=appointmentModel.js.map