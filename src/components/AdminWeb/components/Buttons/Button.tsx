type ButtonProps = {
  onClick: (arg?: any) => void;
  active: any;
  type: number;
  label: any;
  className?: string;
};

function Button({ onClick, active, type, label, className }: ButtonProps) {
  const blueType = active
    ? 'bg-[#2C9CBF] text-white rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] hover:bg-[#2c9dbfc5]'
    : 'border-solid border-2 border-blue-300 bg-[#ffffff] text-[#2C9CBF] rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] hover:text-blue-300 hover:border-blue-200 hover:bg-[#2c9dbfc5]';
  const greenType = active
    ? 'border-solid border-2 border-lime-400 bg-[#ffffff] text-[#74C91E] rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] hover:text-lime-300 hover:border-lime-200 hover:bg-lime-400'
    : 'bg-[#74C91E] text-white rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] hover:bg-[#8EEB2F]';

  const deactivated =
    'bg-[#D9D9D9] text-[#B0B0B0] rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] hover:cursor-not-allowed';

  const createType =
    'bg-[#2C9CBF] rounded-[15px] py-[16px] w-[300px] text-white font-[600] text-[20px] hover:bg-[#2c9dbfc5]';

  const deleteType =
    'bg-[white] text-[#ff4949] border-2 border-red-500 rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] hover:bg-[red] hover:text-[white]';

  const createMobile =
    'bg-[#2C9CBF] rounded-full w-[50px] h-[50px] text-[#fff] text-[50px] font-[100]';

  let style;

  switch (type) {
    case 0:
      style = createType;
      break;
    case 1:
      style = blueType;
      break;
    case 2:
      style = greenType;
      break;
    case 3:
      style = deleteType;
      break;
    case 4:
      style = createMobile;
      break;
    case 5:
      style = deactivated;
  }

  return (
    <>
      <button
        onClick={onClick}
        className={
          ` ${style} flex items-center justify-center hover:text-white` +
          className
        }
      >
        {label}
      </button>
    </>
  );
}

export default Button;
