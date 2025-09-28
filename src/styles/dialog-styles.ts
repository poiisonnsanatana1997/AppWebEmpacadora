/**
 * Estilos compartidos para diálogos
 * Asegura consistencia visual entre AlertDialog y Dialog
 */

export const dialogStyles = {
  // Estilos base compartidos
  overlay: "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  
  content: "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  
  header: "flex flex-col space-y-1.5 text-center sm:text-left",
  
  title: "text-lg font-semibold leading-none tracking-tight",
  
  description: "text-sm text-muted-foreground",
  
  footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2",
  
  // Tamaños específicos
  sizes: {
    sm: "sm:max-w-lg",
    md: "sm:max-w-2xl", 
    lg: "sm:max-w-4xl",
    xl: "sm:max-w-6xl"
  }
} as const;

// Clases específicas para diferentes tipos de diálogos
export const dialogVariants = {
  // Para diálogos de información/detalle
  info: {
    content: `${dialogStyles.content} ${dialogStyles.sizes.md}`,
    actionButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600",
    actionText: "Ver"
  },
  
  // Para diálogos de confirmación/eliminación
  destructive: {
    content: `${dialogStyles.content} ${dialogStyles.sizes.sm}`,
    actionButton: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
    actionText: "Eliminar"
  },
  
  // Para diálogos de advertencia
  warning: {
    content: `${dialogStyles.content} ${dialogStyles.sizes.sm}`,
    actionButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600",
    actionText: "Continuar"
  }
} as const;
