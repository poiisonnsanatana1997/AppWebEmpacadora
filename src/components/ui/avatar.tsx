import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

function Avatar({ className, src, alt, fallback, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false)

  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square size-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div
          data-slot="avatar-fallback"
          className={cn(
            "bg-muted flex size-full items-center justify-center rounded-full",
            className
          )}
        >
          {fallback}
        </div>
      )}
    </div>
  )
}

export { Avatar }
