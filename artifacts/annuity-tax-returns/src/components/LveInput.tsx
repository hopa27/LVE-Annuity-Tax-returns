import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface LveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  suffixIcon?: ReactNode;
}

const LveInput = forwardRef<HTMLInputElement, LveInputProps>(
  ({ className = '', error = false, suffixIcon, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={`
            h-[44px] w-full rounded-[8px] bg-white
            font-['Mulish'] text-[16px] leading-[26px]
            transition-all
            ${error
              ? 'border-[2px] border-[#d72714] text-[#d72714] placeholder:text-[#d72714] px-[10px] py-[6px]'
              : 'border border-[#BBBBBB] text-[#3d3d3d] placeholder:text-[#BBBBBB] px-[12px] py-[8px] hover:border-[#178830] focus:border-[3px] focus:border-[#178830] focus:px-[10px] focus:py-[6px]'
            }
            disabled:bg-[#CCCCCC] disabled:border-[#ACACAC] disabled:text-[#3d3d3d] disabled:border-[2px] disabled:cursor-not-allowed disabled:opacity-100
            outline-none
            ${suffixIcon ? 'pr-[52px]' : ''}
            ${className}
          `}
          {...props}
        />
        {suffixIcon && (
          <div className="absolute right-0 top-0 h-full flex items-center pr-3 gap-2">
            <div className="h-6 w-[1px] bg-[#BBBBBB]" />
            {suffixIcon}
          </div>
        )}
      </div>
    );
  }
);

LveInput.displayName = 'LveInput';

export { LveInput };
