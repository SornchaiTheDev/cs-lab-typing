import Picker from "react-datepicker";
import { useState } from "react";
import DateInput from "./DateInput";
import Header from "./Header";

interface Props {
  onApply: (startDate: Date, endDate: Date) => void;
}

function DatePicker({ onApply }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleOnChange = (date: (Date | null)[]) => {
    const [start, end] = date;
    setStartDate(start);
    setEndDate(end);
    if (start && end) onApply(start, end);
  };

  return (
    <Picker
      startDate={startDate}
      endDate={endDate}
      onChange={handleOnChange}
      maxDate={new Date()}
      selectsRange
      renderCustomHeader={(props) => (
        <Header {...props} setStartDate={setStartDate} />
      )}
      customInput={<DateInput />}
    />
  );
}

export default DatePicker;
