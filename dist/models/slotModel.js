"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slotSchema = new mongoose_1.default.Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    day: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Day",
        required: true,
    },
    availableDoctors: {
        type: [{ type: mongoose_1.default.Schema.ObjectId, ref: "User" }],
        default: [],
    },
}, { timestamps: true });
const Slot = mongoose_1.default.model("Slot", slotSchema);
exports.default = Slot;
//# sourceMappingURL=slotModel.js.map