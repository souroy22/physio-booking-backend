"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daywiseFormatData = void 0;
const daywiseFormatData = (allSlots, wantDoctor = false) => {
    var _a;
    const newFormat = {};
    const availableDoctors = {};
    for (const slot of allSlots) {
        const day = slot.day.day;
        if (!newFormat.hasOwnProperty(day)) {
            const dayWiseSlots = allSlots.filter((s) => s.day.day === day);
            newFormat[day] = { id: dayWiseSlots[0].day._id, slots: [] };
            const formatedSlots = [];
            for (const dSlot of dayWiseSlots) {
                formatedSlots.push({
                    startTime: dSlot.startTime,
                    endTime: dSlot.endTime,
                    id: dSlot._id,
                });
            }
            // if (slot.availableDoctors) {
            //   const doctors: any = [];
            //   for (const doctor of slot.availableDoctors) {
            //     doctors.push(doctor);
            //   }
            //   newFormat[day]["doctors"] = doctors;
            // }
            newFormat[day].slots = formatedSlots;
        }
        if ((_a = slot.availableDoctors) === null || _a === void 0 ? void 0 : _a.length) {
            availableDoctors[slot._id] = slot.availableDoctors;
        }
    }
    if (wantDoctor) {
        return { newFormat, availableDoctors };
    }
    return newFormat;
};
exports.daywiseFormatData = daywiseFormatData;
//# sourceMappingURL=dayWiseFormatData.js.map