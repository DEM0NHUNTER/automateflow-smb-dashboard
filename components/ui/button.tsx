// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Button Style Definitions
 * ------------------------
 * Uses class-variance-authority (CVA) to manage tailwind class combinations.
 *
 * BASE STYLES:
 * - Layout: Inline-flex with centering to handle icons + text gracefully.
 * - A11y: strict focus-visible styling for keyboard navigation, utilizing
 * ring-offset to ensure focus rings are visible on any background color.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary call-to-action
        default: "bg-blue-600 text-white hover:bg-blue-700",
        // Critical actions (delete, ban, remove)
        destructive: "bg-red-500 text-white hover:bg-red-600",
        // Borders only, useful for secondary actions on busy backgrounds
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Muted background, less visual weight than default
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // No background until hover - best for navigation bars or quiet actions
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Looks like a link, behaves like a button (padding/hit-area preserved)
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        // Icon-only buttons need explicit width/height equality to remain circular/square
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, the button will delegate its props and refs to its child.
   * Useful when wrapping other components (like `next/link`) to maintain semantic HTML
   * while keeping button styling.
   * @see https://www.radix-ui.com/primitives/docs/utilities/slot
   */
  asChild?: boolean
}

/**
 * Primary UI Button Component
 *
 * Implements Polymorphism via the `asChild` prop.
 * If `asChild` is true, it renders a Radix UI `Slot` that merges props onto the immediate child.
 * If false, it renders a standard HTML `<button>`.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Determine the underlying DOM element or Slot wrapper
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        // cn() merges the CVA variant classes with any custom className passed via props.
        // It uses `tailwind-merge` under the hood to resolve conflicting classes (e.g. padding).
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }