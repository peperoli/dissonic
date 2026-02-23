import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react'

export function ButtonSlot({
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { children?: ReactNode }): ReactElement | null {
  if (Children.count(children) > 1) {
    throw new Error('ButtonSlot only accepts a single child element')
  }

  if (isValidElement(children)) {
    const childProps = children.props as HTMLAttributes<any>

    return cloneElement(children as ReactElement<any>, {
      ...props,
      ...childProps,
      style: childProps.style
        ? {
            ...props.style,
            ...childProps.style,
          }
        : props.style,
    })
  }

  return null
}
