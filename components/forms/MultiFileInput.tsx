import { ChangeEvent, DragEvent, useRef, useState } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { FieldError } from 'react-hook-form'
import { FileIcon, XIcon } from 'lucide-react'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'

function FileItem({ file, onRemove }: { file: File; onRemove: () => void }) {
  const fileUrl = URL.createObjectURL(file)
  const t = useTranslations('MultiFileInput')

  function formatSize(bytes: number) {
    if (bytes < 1024 ** 2) {
      return (bytes / 1024).toFixed(1) + ' KB'
    } else {
      return (bytes / 1024 ** 2).toFixed(1) + ' MB'
    }
  }

  return (
    <div className="flex items-center gap-4 text-left text-sm">
      <div className="relative grid h-16 w-16 flex-none place-content-center rounded-md bg-slate-700">
        {file.type.startsWith('image/') && fileUrl ? (
          <Image src={fileUrl} alt={file.name} fill className="rounded-md object-cover" />
        ) : (
          <FileIcon className="text-xl" />
        )}
      </div>
      <div className="grid place-items-start">
        <div className="w-full truncate">{file.name}</div>
        <div className="text-slate-300">{formatSize(file.size)}</div>
        <Button
          label={t('remove')}
          icon={<XIcon className="size-icon" />}
          appearance="tertiary"
          size="small"
          danger
          onClick={onRemove}
          className="-ml-4"
        />
      </div>
    </div>
  )
}

export function MultiFileInput({
  label,
  name,
  value,
  onChange,
  error,
  hint,
  accept,
}: {
  label: string
  name: string
  error?: FieldError
  hint?: string
  value: File[]
  onChange: (files: File[]) => void
  accept?: HTMLInputElement['accept']
}) {
  const ref = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const t = useTranslations('MultiFileInput')

  function handleDrag(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true)
    } else if (event.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files)
      onChange(value.concat(files))
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      onChange(value.concat(files))
    }
  }

  return (
    <div>
      <label htmlFor={name}>
        <div className="mb-2 text-sm text-slate-300">{label}</div>
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          multiple
          onChange={handleFileChange}
          className="peer sr-only"
        />
        <div
          role="button"
          ref={ref}
          onDrag={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={clsx(
            'bg-slate-50 w-full cursor-pointer rounded-lg border-2 border-slate-300 p-6 text-center peer-focus:outline peer-focus:ring-2',
            !dragActive && 'border-dashed'
          )}
        >
          {value.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {value.map((file, index) => {
                if (file instanceof File) {
                  return (
                    <FileItem
                      file={file}
                      onRemove={() => onChange(value.filter(item => item.name !== file.name))}
                      key={index}
                    />
                  )
                }
              })}
            </div>
          ) : (
            <span className="text-center text-slate-300">
              {dragActive
                ? 'Dateien hier ablegen'
                : t.rich('dragOrBrowseFiles', {
                    span: chunk => (
                      <span className="cursor-pointer font-bold hover:text-venom">{chunk}</span>
                    ),
                  })}
            </span>
          )}
        </div>
      </label>
      {error && (
        <div className="text-red-600 shadow absolute z-10 mt-1 rounded bg-white px-2 py-1 text-sm">
          {error.message || 'Bitte wählen Sie eine Datei aus.'}
        </div>
      )}
      {hint && <p className="mt-1 text-sm text-slate-700">{hint}</p>}
    </div>
  )
}
