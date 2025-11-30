import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-slate-700 placeholder:text-slate-400 selection:bg-slate-100 selection:text-slate-900 h-11 w-full min-w-0 rounded-lg border-2 border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-medium",
        "focus:border-[#002669] focus:ring-4 focus:ring-slate-100 focus:shadow-elegant",
        "hover:border-slate-300 hover:shadow-md",
        "aria-invalid:border-red-500 aria-invalid:ring-red-100",
        className
      )}
      {...props}
    />
  )
}

export { Input }
