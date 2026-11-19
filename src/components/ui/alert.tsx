import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-destructive/10 border-destructive/20 *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-700 *:data-[slot=alert-description]:text-blue-600/80 dark:text-blue-400 dark:*:data-[slot=alert-description]:text-blue-400/80",
        success:
          "border-green-500/20 bg-green-500/10 text-green-700 *:data-[slot=alert-description]:text-green-600/80 dark:text-green-400 dark:*:data-[slot=alert-description]:text-green-400/80",
      },
    },
  }
);

const Alert = ({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) => (
  <div
    data-slot="alert"
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);

const AlertTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="alert-title"
    className={cn(
      "[&_a]:hover:text-foreground font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3",
      className
    )}
    {...props}
  />
);

const AlertDescription = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="alert-description"
    className={cn(
      "text-muted-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
      className
    )}
    {...props}
  />
);

const AlertAction = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="alert-action"
    className={cn("absolute top-2.5 right-3", className)}
    {...props}
  />
);

export { Alert, AlertTitle, AlertDescription, AlertAction };
