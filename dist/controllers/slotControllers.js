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
const slotModel_1 = __importDefault(require("../models/slotModel"));
const dayWiseFormatData_1 = require("../utils/dayWiseFormatData");
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const timings = {
    Morning: { startTime: "05:00", endTime: "12:00" },
    After_Noon: { startTime: "12:00", endTime: "16:00" },
    Evening: { startTime: "16:00", endTime: "23:00" },
};
const slotControllers = {
    getAvailableSlots: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { day, timing, doctorId } = req.query;
            const match1 = {};
            let totalStartMinutes;
            let totalEndMinutes;
            if (timing) {
                const t = timings[timing];
                // totalStartMinutes = formatTime(t.startTime);
                // totalEndMinutes = formatTime(t.endTime);
                match1["startTime"] = { $gte: t.startTime };
                match1["endTime"] = { $lte: t.endTime };
            }
            if (doctorId) {
                match1["availableDoctors"] = doctorId;
            }
            else {
                match1["availableDoctors"] = { $ne: [] };
            }
            const match2 = {};
            if (day) {
                match2["day"] = day;
            }
            console.log("match1", match1);
            let allSlots = yield slotModel_1.default.find(match1, {
                startTime: 1,
                endTime: 1,
                day: 1,
                availableDoctors: 1,
            }).populate([
                { path: "day", select: "day" },
                { path: "availableDoctors", select: "name email" },
            ]);
            // let allSlots = await Slot.aggregate([
            //   {
            //     $project: {
            //       startTime: 1,
            //       endTime: 1,
            //       day: 1,
            //       availableDoctors: 1,
            //       startMinutes: {
            //         $add: [
            //           {
            //             $multiply: [
            //               { $toInt: { $substr: ["$startTime", 0, 2] } },
            //               60,
            //             ],
            //           },
            //           { $toInt: { $substr: ["$startTime", 3, 2] } },
            //         ],
            //       },
            //       endMinutes: {
            //         $add: [
            //           {
            //             $multiply: [{ $toInt: { $substr: ["$endTime", 0, 2] } }, 60],
            //           },
            //           { $toInt: { $substr: ["$endTime", 3, 2] } },
            //         ],
            //       },
            //     },
            //   },
            //   {
            //     $match: {
            //       $and: [
            //         { startMinutes: { $gte: totalStartMinutes } },
            //         { endMinutes: { $lte: totalEndMinutes } },
            //         {
            //           availableDoctors: doctorId
            //             ? new mongoose.Types.ObjectId(doctorId)
            //             : { $ne: [] },
            //         }, // Filter out documents where availableDoctors is not empty
            //         // { availableDoctors: new mongoose.Types.ObjectId(doctorId) }, // Match doctorId
            //       ],
            //     },
            //   },
            //   {
            //     $lookup: {
            //       from: "days",
            //       localField: "day",
            //       foreignField: "_id",
            //       as: "day",
            //     },
            //   },
            //   {
            //     $lookup: {
            //       from: "users",
            //       localField: "availableDoctors",
            //       foreignField: "_id",
            //       as: "availableDoctors",
            //     },
            //   },
            //   {
            //     $unwind: "$day",
            //   },
            //   {
            //     $addFields: {
            //       day: { day: "$day.day" },
            //       availableDoctors: {
            //         $map: {
            //           input: "$availableDoctors",
            //           as: "doctor",
            //           in: "$$doctor",
            //         },
            //       },
            //       startTime: "$startTime",
            //       endTime: "$endTime",
            //     },
            //   },
            // ]);
            const allAvailableSlots = [];
            if (!doctorId) {
                for (const slot of allSlots) {
                    for (const doctor of slot.availableDoctors) {
                        if (!allAvailableSlots.filter((Aslot) => Aslot._id === slot._id)
                            .length) {
                            const isAvailable = yield appointmentModel_1.default.findOne({
                                doctor: doctor._id,
                                slot: slot._id,
                            });
                            if (!isAvailable) {
                                allAvailableSlots.push(slot);
                            }
                        }
                    }
                }
            }
            else {
                for (const slot of allSlots) {
                    const isAvailable = yield appointmentModel_1.default.findOne({
                        doctor: doctorId,
                        slot: slot._id,
                    });
                    if (!isAvailable) {
                        allAvailableSlots.push(slot);
                    }
                }
            }
            const { newFormat, availableDoctors } = (0, dayWiseFormatData_1.daywiseFormatData)(allAvailableSlots, true);
            return res
                .status(200)
                .json({ slots: newFormat, doctors: availableDoctors });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
    getUnScheduledSlots: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.user.user;
            const slots = yield slotModel_1.default.find({ availableDoctors: { $nin: [id] } })
                .select({
                _id: 1,
                startTime: 1,
                endTime: 1,
                day: 1,
            })
                .populate("day", { _id: 1, day: 1 })
                .exec();
            const selectedSlots = yield slotModel_1.default.find({ availableDoctors: { $in: [id] } })
                .select({
                _id: 1,
                startTime: 1,
                endTime: 1,
                day: 1,
            })
                .populate("day", { _id: 1, day: 1 })
                .exec();
            const allSlots = slots.filter((s) => s.day && !s.day.isHoliday);
            const newFormat = (0, dayWiseFormatData_1.daywiseFormatData)(allSlots);
            const newFormatSelectedSlots = (0, dayWiseFormatData_1.daywiseFormatData)(selectedSlots);
            return res.status(200).json({
                unScheduleSlots: newFormat,
                selectedSlots: newFormatSelectedSlots,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
    bookSlot: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slotId, bookedBy, remarks, doctorId } = req.body;
            if (!(slotId && bookedBy && remarks)) {
                return res
                    .status(400)
                    .json({ error: "Please provide all required details" });
            }
            let newAppointment = new appointmentModel_1.default({
                slot: slotId,
                doctor: doctorId,
                patient: bookedBy,
                remarks,
            });
            newAppointment = yield newAppointment.save();
            return res.status(200).json({ msg: "Booked successfull!" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
    getUserSlot: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const slots = yield appointmentModel_1.default.find({ patient: id })
                .select({ slot: 1, doctor: 1, patient: 1, remarks: 1, _id: 0 })
                .populate("doctor", { name: 1, _id: 0 })
                .populate({
                path: "slot",
                select: "startTime endTime day -_id",
                populate: {
                    path: "day",
                    select: "day -_id",
                },
            });
            return res.status(200).json(slots);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong" });
            }
        }
    }),
    getSlotsBasedOnDoctor: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.user.user;
            const slots = yield slotModel_1.default.find({ availableDoctors: { $in: [id] } })
                .select({
                _id: 1,
                startTime: 1,
                endTime: 1,
                day: 1,
            })
                .populate("day", { _id: 1, day: 1 })
                .exec();
            const allSlots = slots.filter((s) => s.day && !s.day.isHoliday);
            const newFormattedData = (0, dayWiseFormatData_1.daywiseFormatData)(allSlots);
            return res.status(200).json(newFormattedData);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = slotControllers;
//# sourceMappingURL=slotControllers.js.map