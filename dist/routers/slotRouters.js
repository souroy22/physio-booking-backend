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
const express_1 = __importDefault(require("express"));
const slotControllers_1 = __importDefault(require("../controllers/slotControllers"));
const verifyToken_1 = require("../middlewares/verifyToken");
const checkDoctor_1 = __importDefault(require("../middlewares/checkDoctor"));
const slotModel_1 = __importDefault(require("../models/slotModel"));
const dayWiseFormatData_1 = require("../utils/dayWiseFormatData");
const slotRouters = express_1.default.Router();
slotRouters.get("/available-slots", verifyToken_1.verifyToken, slotControllers_1.default.getAvailableSlots);
slotRouters.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slots = yield slotModel_1.default.find({}, { startTime: 1, endTime: 1, day: 1 }).populate({ path: "day", select: "day" });
    const newFormat = (0, dayWiseFormatData_1.daywiseFormatData)(slots);
    return res.status(200).json(newFormat);
}));
slotRouters.get("/unscheduled-slots", verifyToken_1.verifyToken, checkDoctor_1.default, slotControllers_1.default.getUnScheduledSlots);
slotRouters.get("/get-my-slots", verifyToken_1.verifyToken, checkDoctor_1.default, slotControllers_1.default.getSlotsBasedOnDoctor);
slotRouters.put("/book-slot", verifyToken_1.verifyToken, slotControllers_1.default.bookSlot);
slotRouters.get("/appointments/:id", verifyToken_1.verifyToken, slotControllers_1.default.getUserSlot);
exports.default = slotRouters;
//# sourceMappingURL=slotRouters.js.map