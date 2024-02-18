import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  onChange: (value: number) => void;
}
function Counter({ value, onChange }: Props) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      return;
    }
    onChange(value);
  };

  const handleOnMinus = () => {
    if (value === 0) return;
    onChange(value - 1);
  };

  const handleOnPlus = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleOnMinus}>
        <Minus size="1rem" />
      </button>

      <input
        className="w-10 rounded-lg border bg-sand-1 p-1 text-center"
        onChange={handleOnChange}
        value={value}
      />

      <button onClick={handleOnPlus}>
        <Plus size="1rem" />
      </button>
    </div>
  );
}

export default Counter;
