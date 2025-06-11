import * as React from "react"
import styled from "styled-components"
import { cn } from "@/lib/utils"

const SwitchContainer = styled.label`
  position: relative;
  display: inline-flex;
  height: 1.15rem;
  width: 2rem;
  flex-shrink: 0;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  background-color: var(--input);
  box-shadow: var(--shadow-xs);
  transition: all 0.2s;
  outline: none;
  cursor: pointer;

  &:focus-visible {
    border-color: var(--ring);
    box-shadow: 0 0 0 3px var(--ring-50);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-state="checked"] {
    background-color: var(--primary);
  }

  &[data-state="unchecked"] {
    background-color: var(--input);
  }

  @media (prefers-color-scheme: dark) {
    &[data-state="unchecked"] {
      background-color: var(--input-80);
    }
  }
`

const SwitchThumb = styled.span`
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: var(--background);
  pointer-events: none;
  transition: transform 0.2s;
  transform: translateX(0);

  &[data-state="checked"] {
    transform: translateX(calc(100% - 2px));
  }

  @media (prefers-color-scheme: dark) {
    &[data-state="unchecked"] {
      background-color: var(--foreground);
    }
    &[data-state="checked"] {
      background-color: var(--primary-foreground);
    }
  }
`

function Switch({
  className,
  checked,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [isChecked, setIsChecked] = React.useState(checked ?? false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
    onChange?.(e)
  }

  return (
    <SwitchContainer
      data-slot="switch"
      data-state={isChecked ? "checked" : "unchecked"}
      className={cn(className)}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        style={{ display: "none" }}
        {...props}
      />
      <SwitchThumb
        data-slot="switch-thumb"
        data-state={isChecked ? "checked" : "unchecked"}
      />
    </SwitchContainer>
  )
}

export { Switch }
