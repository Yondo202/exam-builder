import { cn } from "@/lib/utils";

type Skeleton = {
  range?: number;
} & React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: Skeleton) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-900/10 dark:bg-slate-50/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
