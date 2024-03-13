"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTime = void 0;
const formatTime = (time) => {
    const [startHours, startMinutes] = time.split(":").map(Number);
    // Convert start time into total minutes since midnight
    const totalTime = startHours * 60 + startMinutes;
    // Parse end time into hours and minutes
    return totalTime;
};
exports.formatTime = formatTime;
//# sourceMappingURL=getTime.js.map