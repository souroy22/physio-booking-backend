"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const daySchema = new mongoose_1.default.Schema({
    day: {
        type: String,
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"],
    },
    isHoliday: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
const Day = mongoose_1.default.model("Day", daySchema);
exports.default = Day;
//# sourceMappingURL=dayModel.js.map