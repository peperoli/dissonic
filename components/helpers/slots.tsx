import { Children, cloneElement, HTMLAttributes, isValidElement, ReactNode } from 'react'

export function ButtonSlot({
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { children?: ReactNode }) {
  if (Children.count(children) > 1) {
    throw new Error('ButtonSlot only accepts a single child element')
  }

  if (isValidElement(children)) {
    return cloneElement(children, {
      ...props,
      ...children.props as { [key: string]: any },
    })
  }

  return null
}
