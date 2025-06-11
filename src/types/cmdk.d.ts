declare module 'cmdk' {
  import * as React from 'react'

  export interface CommandProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode
  }

  export interface CommandInputProps extends React.ComponentPropsWithoutRef<'input'> {
    children?: React.ReactNode
  }

  export interface CommandListProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode
  }

  export interface CommandEmptyProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode
  }

  export interface CommandGroupProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode
  }

  export interface CommandItemProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode
  }

  export interface CommandSeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
    children?: React.ReactNode
  }

  export const Command: React.FC<CommandProps> & {
    Input: React.FC<CommandInputProps>
    List: React.FC<CommandListProps>
    Empty: React.FC<CommandEmptyProps>
    Group: React.FC<CommandGroupProps>
    Item: React.FC<CommandItemProps>
    Separator: React.FC<CommandSeparatorProps>
  }
} 