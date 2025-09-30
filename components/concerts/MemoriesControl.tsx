import { Band } from '@/types/types'
import clsx from 'clsx'
import { CheckIcon, PlaySquareIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useRef } from 'react'
import { Button } from '../Button'
import { SelectField } from '../forms/SelectField'
import { MemoryFileItem, useMemoriesControl } from '@/hooks/helpers/useMemoriesControl'
import { getCloudflareImageUrl, getCloudflareVideoUrl } from '@/lib/cloudflareHelpers'
import { VideoPlayer } from '../shared/VideoPlayer'

export function MemoriesControl({
  label,
  name,
  fileItems,
  setFileItems,
  acceptedFileTypes,
  bands,
}: {
  label: string
  name: string
  fileItems: MemoryFileItem[]
  setFileItems: Dispatch<SetStateAction<MemoryFileItem[]>>
  acceptedFileTypes?: string[]
  bands: Band[]
}) {
  const { isDragActive, onDrag, onDrop, onChange } = useMemoriesControl(fileItems, setFileItems, {
    prefix: 'concert-memories',
    acceptedFileTypes,
  })
  const ref = useRef(null)
  const t = useTranslations('MemoriesControl')

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
              ? t('dropFilesHere')
              : t.rich('dragOrBrowseMediaFiles', {
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
  fileItem: MemoryFileItem
  setFileItem: (item: MemoryFileItem) => void
  index: number
  onRemove: () => void
  bands: Band[]
}) {
  const imagePreview =
    fileItem.preview || (fileItem.fileId && getCloudflareImageUrl(fileItem.fileId, { width: 300 }))
  const t = useTranslations('MemoriesControl')

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
        {fileItem.file.type.startsWith('image/') && imagePreview && (
          <img
            src={imagePreview}
            alt=""
            className="absolute inset-0 size-full rounded-md object-contain"
          />
        )}
        {fileItem.file.type.startsWith('video/') &&
          (fileItem.preview ? (
            <video
              src={fileItem.preview}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 size-full rounded-md object-contain"
            />
          ) : fileItem.fileId ? (
            <VideoPlayer
              src={getCloudflareVideoUrl(fileItem.fileId)}
              hiddenControls
              autoPlay
              muted
              loop
            />
          ) : null)}
        {fileItem.file.type.startsWith('video/') && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-slate-900/70 p-1 text-sm">
            <PlaySquareIcon className="size-icon" />
            {fileItem.duration && (
              <span>
                {Math.floor(fileItem.duration / 60)}:
                {(fileItem.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="grid w-full">
        <div className="flex w-full gap-2">
          <div className="mb-2 grid w-full">
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
                <span className="text-blue">
                  Uploading ... {(fileItem.progress ?? 0) > 0 && <>{fileItem.progress}&#8200;%</>}
                </span>
              ) : fileItem.isSuccess ? (
                <span className="text-venom">
                  <CheckIcon className="size-icon" />
                </span>
              ) : null}
              <span className="text-slate-300">
                {fileItem.file.size ? formatSize(fileItem.file.size) : null}
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
        <div>
          <SelectField
            label="Band"
            name="bandId"
            items={bands.map(band => ({ id: band.id, name: band.name }))}
            allItems={bands}
            value={fileItem.bandId}
            onValueChange={bandId => setFileItem({ ...fileItem, bandId })}
            isClearable
          />
        </div>
      </div>
    </div>
  )
}
