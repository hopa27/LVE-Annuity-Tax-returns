import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
  disabled?: boolean;
}

export default function YearSelector({ value, onChange, disabled = false }: YearSelectorProps) {
  return (
    <div className="relative inline-flex">
      <input
        type="text"
        value={value}
        readOnly
        disabled={disabled}
        className={`
          h-[35px] w-[80px] rounded-[6px] bg-white
          font-['Mulish'] text-[13px] leading-[21px] text-[#3d3d3d]
          border border-[#BBBBBB] px-[10px] py-[6px]
          text-center pr-[32px]
          disabled:bg-[#CCCCCC] disabled:border-[#ACACAC] disabled:cursor-not-allowed
          outline-none
          hover:border-[#178830] focus:border-[3px] focus:border-[#178830]
          transition-all
        `}
      />
      <div className="absolute right-0 top-0 h-full flex items-center">
        <div className="h-5 w-[1px] bg-[#BBBBBB]" />
        <div className="flex flex-col h-full">
          <button
            onClick={() => onChange(value + 1)}
            disabled={disabled}
            className="flex-1 px-1.5 flex items-center justify-center text-[#006cf4] hover:text-[#003578] disabled:text-[#979797] transition-colors"
          >
            <MdKeyboardArrowUp size={14} />
          </button>
          <button
            onClick={() => onChange(value - 1)}
            disabled={disabled}
            className="flex-1 px-1.5 flex items-center justify-center text-[#006cf4] hover:text-[#003578] disabled:text-[#979797] transition-colors"
          >
            <MdKeyboardArrowDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
