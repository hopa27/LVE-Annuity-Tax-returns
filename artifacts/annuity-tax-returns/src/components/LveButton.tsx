import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-['Livvic'] font-normal transition-colors focus-visible:outline-none disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: 'bg-[#006cf4] text-white hover:bg-[#003578] disabled:bg-[#979797] disabled:text-white disabled:opacity-100 shadow-md',
        secondary: 'bg-white text-[#04589b] border border-[#04589b] font-bold hover:bg-[#003578] hover:text-white hover:border-[#003578]',
        outline: 'border border-[#BBBBBB] bg-white text-[#3d3d3d] hover:bg-gray-50',
        ghost: 'bg-transparent hover:bg-white/10',
        link: 'text-[#006cf4] underline-offset-4 hover:underline',
        destructive: 'bg-[#d72714] text-white hover:bg-red-700',
      },
      size: {
        default: 'h-[44px] px-8 py-2 rounded-[30px] text-base',
        sm: 'h-9 px-4 rounded-[30px] text-sm',
        lg: 'h-12 px-10 rounded-[30px] text-lg',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const LveButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={`${buttonVariants({ variant, size })} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

LveButton.displayName = 'LveButton';

export { LveButton, buttonVariants };
