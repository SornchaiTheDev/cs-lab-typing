function isValidTime(timeString: string) {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeString);
}

function isStartTimeBeforeEndTime(startTime: string, endTime: string) {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return start < end;
}

export function validateTimeRange(startTime: string, endTime: string) {
  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    return false; // Either start or end time is not in valid format
  }

  if (!isStartTimeBeforeEndTime(startTime, endTime)) {
    return false; // End time should be greater than start time
  }

  return true; // The time range is valid
}
