import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#002669] text-white shadow-sm hover:shadow-md hover:bg-[#001a4d]",
        secondary:
          "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200",
        destructive:
          "border-transparent bg-red-500 text-white shadow-sm hover:shadow-md hover:bg-red-600",
        outline:
          "border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300",
        success:
          "border-transparent bg-emerald-500 text-white shadow-sm hover:shadow-md hover:bg-emerald-600",
        warning:
          "border-transparent bg-amber-500 text-white shadow-sm hover:shadow-md hover:bg-amber-600",
        info:
          "border-transparent bg-blue-500 text-white shadow-sm hover:shadow-md hover:bg-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
