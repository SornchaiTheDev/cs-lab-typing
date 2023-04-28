import { Icon } from "@iconify/react";
import { ChangeEvent } from "react";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";

const Header = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  setStartDate,
}: ReactDatePickerCustomHeaderProps & {
  setStartDate: (value: Date | null) => void;
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = new Array(5).fill(null).map((_, i) => date.getFullYear() - i);

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(date);
    newDate.setMonth(months.indexOf(e.target.value));
    setStartDate(newDate);

    console.log(newDate);
  };
  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(date);
    newDate.setFullYear(parseInt(e.target.value));
    setStartDate(newDate);
  };

  return (
    <div className="flex items-center justify-between p-2 ">
      <button
        onClick={decreaseMonth}
        className="p-1 text-lg border rounded bg-sand-1 border-sand-6 disabled:bg-sand-3"
        disabled={prevMonthButtonDisabled}
      >
        <Icon icon="solar:alt-arrow-left-line-duotone" />
      </button>

      <select
        value={months[date.getMonth()]}
        className="text-base font-bold bg-transparent text-sand-12"
        onChange={handleMonthChange}
      >
        {months.map((months) => (
          <option key={months} value={months}>
            {months}
          </option>
        ))}
      </select>

      <select
        value={date.getFullYear()}
        className="text-base font-bold bg-transparent text-sand-12"
        onChange={handleYearChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button
        onClick={increaseMonth}
        className="p-1 text-lg border rounded bg-sand-1 border-sand-6 disabled:bg-sand-3"
        disabled={nextMonthButtonDisabled}
      >
        <Icon icon="solar:alt-arrow-right-line-duotone" />
      </button>
    </div>
  );
};

export default Header;
