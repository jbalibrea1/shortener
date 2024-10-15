import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CopyIcon } from '@radix-ui/react-icons';
import type { InputHTMLAttributes } from 'react';
import * as React from 'react';

interface InputWithCopyIconProps extends InputHTMLAttributes<HTMLInputElement> {
  iconClick: () => void;
}

const InputWithCopyIcon = React.forwardRef<
  HTMLInputElement,
  InputWithCopyIconProps
>(({ iconClick, ...inputProps }, ref) => {
  return (
    <div className="relative flex items-center">
      <input
        {...inputProps}
        ref={ref}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <TooltipProvider delayDuration={500} skipDelayDuration={500}>
        <Tooltip>
          <TooltipTrigger asChild>
            <CopyIcon
              className="absolute right-3 h-5 w-5 text-muted-foreground cursor-pointer"
              onClick={iconClick}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Copiar al portapapeles</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

InputWithCopyIcon.displayName = 'InputWithCopyIcon';

export default InputWithCopyIcon;
