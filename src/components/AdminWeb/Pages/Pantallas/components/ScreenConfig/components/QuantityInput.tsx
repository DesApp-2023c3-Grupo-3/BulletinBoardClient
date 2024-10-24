import { ChangeEvent, useState } from 'react';

export default function QuantityInput({
  intervalTime,
  title,
  onChange,
}: {
  intervalTime: number;
  title: string;
  onChange: (newConfig: number) => void;
}) {
  const [count, setCount] = useState(intervalTime);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(Number(event.currentTarget.value), 1);
    setCount(newValue);
    onChange(newValue);
  };

  const handleClick = (result: number) => {
    setCount(result);
    onChange(result);
  };

  return (
    <div className="flex flex-col text-sm md:text-[1.3rem] items-center">
      <span className="text-black dark:text-white mb-1">{title}</span>
      <label className="flex gap-4 items-center text-[#2C9CBF] dark:text-blue-500 font-semibold">
        {count < 2 ? (
          <span className="text-gray-500">-</span>
        ) : (
          <button onClick={() => handleClick(count - 1)}>-</button>
        )}
        <input
          type="text"
          placeholder="15"
          value={intervalTime}
          onChange={handleChange}
          className="text-center text-[#484848] dark:text-white w-10 border-2 rounded border-[#BFBFBF]"
        />
        <button onClick={() => handleClick(count + 1)}>+</button>
      </label>
    </div>
  );
}
