type Fn_TYPE = (time: string) => number;

export const formatTime = (time: string) => {
  const [startHours, startMinutes] = time.split(":").map(Number);

  // Convert start time into total minutes since midnight
  const totalTime = startHours * 60 + startMinutes;

  // Parse end time into hours and minutes
  return totalTime;
};
