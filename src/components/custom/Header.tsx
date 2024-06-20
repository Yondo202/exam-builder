import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const Header = ({ title, border = false, action, className }: { title?: string; border?: boolean; action?: ReactNode; className?: string }) => {
   return (
      <div className={cn('pt-2 mb-6 grid grid-cols-[1fr_auto] items-center', border ? `border-b` : ``, className)}>
         <h3 className={`text-xl pb-0 font-medium truncate ${border ? `border-b border-primary` : ``} `}>{title}</h3>
         {action}
      </div>
   );
};

export default Header;
