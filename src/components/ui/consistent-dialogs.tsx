import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { dialogStyles, dialogVariants } from '@/styles/dialog-styles';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './dialog';

// Wrapper para AlertDialog con estilos consistentes
interface ConsistentAlertDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'destructive' | 'warning';
}

export const ConsistentAlertDialog: React.FC<ConsistentAlertDialogProps> = ({
  children,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText = 'Cancelar',
  isLoading = false,
  variant = 'destructive'
}) => {
  const variantStyles = dialogVariants[variant];
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className={variantStyles.content}>
        <AlertDialogHeader>
          <AlertDialogTitle className={dialogStyles.title}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className={dialogStyles.description}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={dialogStyles.footer}>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn("text-white", variantStyles.actionButton)}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : (confirmText || variantStyles.actionText)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Wrapper para Dialog con estilos consistentes
interface ConsistentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'info' | 'warning';
}

export const ConsistentDialog: React.FC<ConsistentDialogProps> = ({
  open,
  onOpenChange,
  title,
  children,
  footer,
  size = 'md',
  variant = 'info'
}) => {
  const variantStyles = dialogVariants[variant];
  const sizeClass = dialogStyles.sizes[size];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(variantStyles.content, sizeClass)}>
        <DialogHeader>
          <DialogTitle className={dialogStyles.title}>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {children}
        </div>
        
        {footer && (
          <DialogFooter className={dialogStyles.footer}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
