import { UploadIcon, X } from 'lucide-react'
import clsx from 'clsx'
import Image from 'next/legacy/image'
import { ChangeEvent, DragEvent, useState } from 'react'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'
import { FieldError } from 'react-hook-form'

type FileInputProps = {
  name: string
  label: string
  value: File | string | null
  onChange: (value: File | string | null) => void
  error?: FieldError
  accept?: HTMLInputElement['accept']
}

export const FileInput = ({ label, name, value, onChange, error, ...props }: FileInputProps) => {
  const [dragActive, setDragActive] = useState(false)
  const t = useTranslations('FileInput')
  const fileUrl = value instanceof File ? URL.createObjectURL(value) : value

  const handleDrag = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    if (event.dataTransfer.files) {
      const file = event.dataTransfer.files[0]
      onChange(file)
    }
  }

  const handleChange = function (event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0]
      onChange(file)
    }
  }

  return (
    <fieldset>
      <label htmlFor={name} className="block">
        <span className="relative mb-1 block text-sm text-slate-300">{label}</span>
        <input
          id={name}
          name={name}
          type="file"
          onChange={handleChange}
          {...props}
          className="peer sr-only"
        />
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={clsx(
            'flex items-center gap-4 rounded-lg border-2 border-dashed bg-slate-750 p-4 peer-focus:border-venom',
            dragActive ? 'border-solid border-venom' : error ? 'border-yellow' : 'border-slate-500'
          )}
        >
          <div className="relative grid aspect-square w-24 place-content-center rounded-lg bg-slate-850">
            {fileUrl ? (
              <>
                <Image
                  src={fileUrl}
                  alt={''}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <div className="absolute -right-2 -top-2 rounded-lg shadow-lg">
                  <Button
                    onClick={() => onChange(null)}
                    icon={<X className="size-icon" />}
                    label={t('remove')}
                    contentType="icon"
                    size="small"
                  />
                </div>
              </>
            ) : (
              <UploadIcon
                className={clsx('size-8 text-slate-300', dragActive && 'pointer-events-none')}
              />
            )}
          </div>
          <p className={clsx(dragActive && 'pointer-events-none')}>
            {t.rich('dragOrBrowseFile', {
              span: chunk => (
                <span className="cursor-pointer font-bold hover:text-venom">{chunk}</span>
              ),
            })}
          </p>
        </div>
      </label>
      {error && (
        <span className="mt-1 text-sm text-yellow">
          {error.message ||
            (error.type === 'validate' ? t('fileSizeError') : t('pleaseSelectAFile'))}
        </span>
      )}
    </fieldset>
  )
}
