import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gradient-to-r from-clarity-teal-100/50 to-neural-purple-100/50", className)}
      {...props}
    />
  )
}

/**
 * Card skeleton with teal/emerald gradient
 */
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Skeleton className="h-48 w-full rounded-xl bg-gradient-to-br from-clarity-teal-100/50 to-memory-emerald-100/50" />
      <Skeleton className="h-4 w-3/4 bg-neural-purple-200/50" />
      <Skeleton className="h-4 w-1/2 bg-clarity-teal-200/50" />
    </div>
  )
}

/**
 * List skeleton with purple accent lines
 */
function SkeletonList({ items = 5, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { items?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full bg-neural-purple-200/50" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full bg-clarity-teal-200/50" />
            <Skeleton className="h-3 w-2/3 bg-neural-blue-200/50" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Calendar skeleton with blue/teal grid
 */
function SkeletonCalendar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32 bg-neural-purple-200/50" />
        <Skeleton className="h-8 w-24 bg-brand-orange-200/50" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded bg-neural-blue-100/50" />
        ))}
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonList, SkeletonCalendar }
