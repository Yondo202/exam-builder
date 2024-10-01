import { cn } from "@/lib/utils";

type Skeleton = {
  range?: number;
} & React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: Skeleton) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-primary/10 dark:bg-slate-50/15",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
