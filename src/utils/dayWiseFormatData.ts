export const daywiseFormatData = (
  allSlots: any,
  wantDoctor: boolean = false
) => {
  const newFormat: any = {};
  const availableDoctors: any = {};
  for (const slot of allSlots) {
    const day: any = (slot.day as any).day;
    if (!newFormat.hasOwnProperty(day)) {
      const dayWiseSlots: any = allSlots.filter(
        (s: any) => (s.day as any).day === day
      );
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
    if (slot.availableDoctors?.length) {
      availableDoctors[slot._id] = slot.availableDoctors;
    }
  }
  if (wantDoctor) {
    return { newFormat, availableDoctors };
  }
  return newFormat;
};
