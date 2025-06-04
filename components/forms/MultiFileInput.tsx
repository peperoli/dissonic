import { ChangeEvent, DragEvent, useRef, useState } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { FieldError } from 'react-hook-form'
import { FileIcon, XIcon } from 'lucide-react'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'
import { Band } from '@/types/types'
import { SelectField } from './SelectField'

function FileItem({
  file,
  onRemove,
  bands,
  bandId,
  setBandId,
}: {
  file: File
  onRemove: () => void
  bands: Band[]
  bandId: number | null
  setBandId: (bandId: number | null) => void
}) {
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
    <div className="flex w-full items-center gap-4 text-left text-sm">
      <div className="relative grid size-20 flex-none place-content-center rounded-md bg-slate-700">
        {file.type.startsWith('image/') && fileUrl ? (
          <Image src={fileUrl} alt={file.name} fill className="rounded-md object-cover" />
        ) : (
          <FileIcon className="text-xl" />
        )}
      </div>
      <div className="grid w-full">
        <div className="w-full truncate mb-2">
          {file.name} <span className="text-slate-300">&bull; {formatSize(file.size)}</span>
        </div>
        <SelectField
          label="Band"
          name="bandId"
          items={bands.map(band => ({ id: band.id, name: band.name }))}
          allItems={bands}
          value={bandId}
          onValueChange={setBandId}
        />
      </div>
      <Button
        label={t('remove')}
        icon={<XIcon className="size-icon" />}
        contentType="icon"
        size="small"
        appearance="tertiary"
        danger
        onClick={onRemove}
      />
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
  bands,
}: {
  label: string
  name: string
  error?: FieldError
  hint?: string
  value: { file: File; bandId: number | null }[]
  onChange: (value: { file: File; bandId: number | null }[]) => void
  accept?: HTMLInputElement['accept']
  bands: Band[]
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
      onChange(value.concat(files.map(file => ({ file, bandId: null }))))
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      onChange(value.concat(files.map(file => ({ file, bandId: null }))))
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
            <div className="grid gap-4">
              {value.map((memory, index) => {
                if (memory.file instanceof File) {
                  return (
                    <FileItem
                      file={memory.file}
                      onRemove={() =>
                        onChange(value.filter(item => item.file.name !== memory.file.name))
                      }
                      bands={bands}
                      bandId={memory.bandId}
                      setBandId={bandId => {
                        onChange([
                          ...value.filter(item => item.file.name !== memory.file.name),
                          { file: memory.file, bandId },
                        ])
                      }}
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
