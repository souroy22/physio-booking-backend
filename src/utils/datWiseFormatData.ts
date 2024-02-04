export const daywiseFormatData = (allSlots: any) => {
  const newFormat: any = {};
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
      newFormat[day].slots = formatedSlots;
    }
  }
  return newFormat;
};
