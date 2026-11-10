import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { ReactNode } from 'react'
import { useTranslations } from 'use-intl'
import { Disclosure } from '../shared/Disclosure'

export function FurtherDetailsDisclosure({labels, children }: { labels: string[]; children: ReactNode }) {
  const t = useTranslations('FurtherDetailsDisclosure')

  return (
    <Disclosure.Root>
      <Disclosure.Trigger className="flex items-center justify-between gap-3">
        {({ isOpen }) => (
          <>
            {isOpen ? (
              <div className="font-bold">{t('furtherDetails')}</div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {labels.map(label => (
                  <span key={label} className="btn btn-secondary btn-small">
                    {label}
                  </span>
                ))}
              </div>
            )}
            <ChevronDown className={clsx('size-icon', isOpen && 'rotate-180')} />
          </>
        )}
      </Disclosure.Trigger>
      <Disclosure.Content className="mt-6 grid gap-6">
        {children}
      </Disclosure.Content>
    </Disclosure.Root>
  )
}
