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
const dayModel_1 = __importDefault(require("../models/dayModel"));
const slotModel_1 = __importDefault(require("../models/slotModel"));
const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thusday",
    "Friday",
    "Saturday",
];
const startTime = 5; // 24 hours format
const endTime = 23; // 24 hours format
const duration = 45; // in minutes
const gap = 15; // gap in between every slot
const dayControllers = {
    createSlotsForCurrentWeek: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allTimings = [];
            for (const day of days) {
                let newDay = new dayModel_1.default({ day, isHoliday: false });
                newDay = yield newDay.save();
                const allSlots = [];
                let hour = startTime;
                let minute = 0;
                while (!(hour === endTime && minute === 0)) {
                    const startTimeFormatted = `${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}`;
                    // Calculate end time
                    let endTimeHour = hour;
                    let endTimeMinute = minute + duration;
                    if (endTimeMinute >= 60) {
                        endTimeHour += Math.floor(endTimeMinute / 60);
                        endTimeMinute %= 60;
                    }
                    const endTimeFormatted = `${endTimeHour < 10 ? "0" : ""}${endTimeHour}:${endTimeMinute < 10 ? "0" : ""}${endTimeMinute}`;
                    const data = {
                        startTime: startTimeFormatted,
                        endTime: endTimeFormatted,
                        day: newDay._id,
                    };
                    // Move to next time slot
                    minute += gap;
                    if (minute >= 60) {
                        minute %= 60;
                        hour++;
                    }
                    let slot = new slotModel_1.default(data);
                    slot = yield slot.save();
                    // hour = endTimeHour;
                    // minute = endTimeMinute;
                    allSlots.push({ startTime: slot.startTime, endTime: slot.endTime });
                }
                allTimings.push({ day: newDay.day, slots: allSlots });
            }
            return res.status(200).json({ timings: allTimings });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = dayControllers;
//# sourceMappingURL=dayControllers.js.map