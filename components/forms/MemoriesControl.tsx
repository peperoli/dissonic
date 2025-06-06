import { ChangeEvent, DragEvent, useRef, useState } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { FieldError } from 'react-hook-form'
import { FileIcon, XIcon } from 'lucide-react'
import { Button } from '../Button'
import { useTranslations } from 'next-intl'
import { Band } from '@/types/types'
import { SelectField } from './SelectField'
import { Tables } from '@/types/supabase'

export type Memory =
  | Tables<'memories'>
  | {
      file: File
      band_id: number | null
    }

function MemoryItem({
  memory,
  onRemove,
  bands,
  setBandId,
}: {
  memory: Memory
  onRemove: () => void
  bands: Band[]
  setBandId: (bandId: number | null) => void
}) {
  const fileUrl = 'file' in memory ? URL.createObjectURL(memory.file) : memory.file_url
  const t = useTranslations('MultiFileInput')

  function formatSize(bytes: number) {
    if (bytes < 1024 ** 2) {
      return (bytes / 1024).toFixed(1) + ' KB'
    } else {
      return (bytes / 1024 ** 2).toFixed(1) + ' MB'
    }
  }

  return (
    <div className="flex w-full gap-4 text-left text-sm">
      <div className="relative grid size-22 flex-none place-content-center rounded-md bg-slate-700">
        {fileUrl ? (
          <Image src={fileUrl} alt="" fill className="rounded-md object-cover" />
        ) : (
          <FileIcon className="text-xl" />
        )}
      </div>
      <div className="grid w-full">
        <div className="w-full truncate">
          {'file' in memory ? memory.file.name : memory.file_name}{' '}
        </div>
        <div className="mb-2 text-slate-300">
          {formatSize('file' in memory ? memory.file.size : memory.file_size)}
        </div>
        <SelectField
          label="Band"
          name="bandId"
          items={bands.map(band => ({ id: band.id, name: band.name }))}
          allItems={bands}
          value={memory.band_id || null}
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

export function MemoriesControl({
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
  value: Memory[]
  onChange: (value: Memory[]) => void
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
      onChange(value.concat(files.map(file => ({ file, band_id: null }))))
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      onChange(value.concat(files.map(file => ({ file, band_id: null }))))
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
            'w-full cursor-pointer rounded-lg border-2 border-slate-500 bg-slate-750 p-6 text-center peer-focus:outline peer-focus:ring-2',
            !dragActive && 'border-dashed'
          )}
        >
          {value.length > 0 ? (
            <div className="grid gap-4">
              {value.map((memory, index) => {
                return (
                  <MemoryItem
                    memory={memory}
                    onRemove={() => {
                      const newValue = [...value]
                      newValue.splice(index, 1)
                      onChange(newValue)
                    }}
                    bands={bands}
                    setBandId={bandId => {
                      const newValue = [...value]
                      newValue.splice(index, 1, {
                        ...memory,
                        band_id: bandId,
                      })
                      onChange(newValue)
                    }}
                    key={index}
                  />
                )
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
