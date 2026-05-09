import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  MouseEvent,
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
    const childProps = children.props as HTMLAttributes<HTMLButtonElement>

    return cloneElement(children as ReactElement<HTMLAttributes<HTMLButtonElement>>, {
      ...props,
      ...childProps,
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        if (childProps.onClick) {
          childProps.onClick(event)
        }
        if (props.onClick) {
          props.onClick(event)
        }
      },
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
