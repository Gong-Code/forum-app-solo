import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary dark:bg-primary/10 text-secondary-foreground hover:bg-secondary/60 outline outline-1 outline-white dark:outline-white/30 dark:shadow-gray-900/90 shadow-md shadow-slate-300",
          qna:
          "border-transparent bg-indigo-600 dark:bg-indigo-600/60 text-primary-foreground dark:text-primary/80 outline outline-1 outline-white dark:outline-white/40 shadow-md shadow-indigo-400 dark:shadow-gray-900/80 hover:bg-indigo-600/80",
        destructive:
          "border-transparent bg-destructive dark:bg-muted/80 dark:outline-red-600 text-destructive-foreground hover:bg-destructive/80 outline outline-1 outline-white dark:shadow-gray-900/90 shadow-md shadow-slate-300",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
