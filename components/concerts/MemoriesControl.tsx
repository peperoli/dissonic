import { Band } from '@/types/types'
import clsx from 'clsx'
import { FileIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Button } from '../Button'
import { SelectField } from '../forms/SelectField'
import { FileItem, useMemoriesControl } from '@/hooks/helpers/useMemoriesControl'
import { getCloudflareImageUrl } from '@/lib/cloudflareHelpers'
import { TablesInsert } from '@/types/supabase'

export function MemoriesControl({
  label,
  name,
  value,
  onValueChange,
  acceptedFileTypes,
  bands,
  concertId,
}: {
  label: string
  name: string
  value: TablesInsert<'memories'>[]
  onValueChange: (value: TablesInsert<'memories'>[]) => void
  acceptedFileTypes?: string[]
  bands: Band[]
  concertId: number | null
}) {
  const { isDragActive, onDrag, onDrop, onChange, fileItems, setFileItems } = useMemoriesControl({
    prefix: 'concert-memories',
    acceptedFileTypes,
  })
  const ref = useRef(null)
  const t = useTranslations('MultiFileInput')

  useEffect(() => {
    if (!concertId) return

    const filteredFileItems = fileItems.filter(fileItem => fileItem.fileId != null)
    onValueChange(
      filteredFileItems.map(fileItem => ({
        cloudflare_file_id: fileItem.fileId!,
        file_type: fileItem.file.type,
        band_id: fileItem.bandId,
        concert_id: concertId,
      }))
    )
  }, [fileItems.length, fileItems.map(fileItem => fileItem.fileId).join(',')])

  return (
    <div className="grid">
      <label htmlFor={name}>
        <div className="mb-2 text-sm text-slate-300">{label}</div>
        <input
          type="file"
          id={name}
          name={name}
          accept={acceptedFileTypes?.join(',')}
          multiple
          onChange={onChange}
          className="peer sr-only"
        />
        <div
          role="button"
          ref={ref}
          onDrag={onDrag}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          className={clsx(
            'w-full cursor-pointer rounded-lg border-2 border-slate-500 bg-slate-750 p-6 text-center peer-focus:outline peer-focus:ring-2',
            !isDragActive && 'border-dashed'
          )}
        >
          <span className="text-center text-slate-300">
            {isDragActive
              ? 'Dateien hier ablegen'
              : t.rich('dragOrBrowseFiles', {
                  span: chunk => (
                    <span className="cursor-pointer font-bold hover:text-venom">{chunk}</span>
                  ),
                })}
          </span>
        </div>
      </label>
      <div className="mt-2 grid gap-4 rounded-lg bg-slate-750 p-4">
        {fileItems.map((fileItem, index) => {
          return (
            <MemoryItem
              fileItem={fileItem}
              setFileItem={item => {
                const newItems = [...fileItems]
                newItems[index] = item
                setFileItems(newItems)
              }}
              index={index}
              onRemove={() => {
                const newItems = fileItems.filter((_, i) => i !== index)
                setFileItems(newItems)
              }}
              bands={bands}
              key={index}
            />
          )
        })}
      </div>
      <pre className="max-w-xl overflow-auto">{JSON.stringify(fileItems, null, 2)}</pre>
    </div>
  )
}

function MemoryItem({
  fileItem,
  setFileItem,
  index,
  onRemove,
  bands,
}: {
  fileItem: FileItem
  setFileItem: (item: FileItem) => void
  index: number
  onRemove: () => void
  bands: Band[]
}) {
  const fileUrl = fileItem.preview
    ? fileItem.preview
    : fileItem.fileId
      ? getCloudflareImageUrl(fileItem.fileId)
      : null
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
        {fileItem.file?.type.startsWith('image/') && fileUrl ? (
          <Image src={fileUrl} alt="" fill className="rounded-md object-contain" />
        ) : fileItem.file?.type.startsWith('video/') && fileUrl ? (
          <video
            src={fileUrl}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 size-full rounded-md object-contain"
          />
        ) : (
          <FileIcon className="text-xl" />
        )}
      </div>
      <div className="grid w-full">
        <div className="flex w-full gap-2">
          <div className="mb-2 grid w-full">
            <span className="truncate">{fileItem.file?.name}</span>
            <div className="my-1 h-1 w-full rounded bg-slate-700">
              <div
                style={{ width: fileItem.progress + '%' }}
                className={clsx(
                  'h-1 rounded transition-[width]',
                  fileItem.error ? 'bg-red' : fileItem.isSuccess ? 'bg-venom' : 'bg-blue'
                )}
              />
            </div>
            <div className="flex justify-between">
              {fileItem.error ? (
                <span className="text-red">Error: {fileItem.error}</span>
              ) : fileItem.isLoading ? (
                <span className="text-blue">Uploading ... {fileItem.progress}&#8200;%</span>
              ) : fileItem.isSuccess ? (
                <span className="text-venom">Uploaded</span>
              ) : null}
              <span className="text-slate-300">
                {fileItem.file ? formatSize(fileItem.file.size) : null}
              </span>
            </div>
          </div>
          <Button
            label={t('remove')}
            icon={<XIcon className="size-icon" />}
            contentType="icon"
            size="small"
            appearance="tertiary"
            danger
            onClick={onRemove}
            className="ml-auto"
          />
        </div>
        <div className="overflow-hidden">
          <SelectField
            label="Band"
            name="bandId"
            items={bands.map(band => ({ id: band.id, name: band.name }))}
            allItems={bands}
            value={fileItem.bandId}
            onValueChange={bandId => setFileItem({ ...fileItem, bandId })}
          />
        </div>
      </div>
    </div>
  )
}
