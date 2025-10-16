import { Band } from '@/types/types'
import clsx from 'clsx'
import { CheckIcon, UploadIcon, XIcon } from 'lucide-react'
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
          <span className="flex flex-col items-center text-center">
            <UploadIcon className="mb-2 size-icon" />
            {isDragActive ? (
              <p>{t('dropFilesHere')}</p>
            ) : (
              <p>
                <span className="cursor-pointer font-bold hover:text-venom">{t('browse')}</span>
                <span className="hidden md:inline"> {t('orDragFilesHere')}</span>
              </p>
            )}
            <small className="text-slate-300">{t('fileUploadInstructions')}</small>
          </span>
        </div>
      </label>
      {fileItems.length > 0 && (
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
      )}
    </div>
  )
}

function MemoryItem({
  fileItem,
  setFileItem,
  onRemove,
  bands,
}: {
  fileItem: MemoryFileItem
  setFileItem: (item: MemoryFileItem) => void
  onRemove: () => void
  bands: Band[]
}) {
  const imagePreview =
    fileItem.preview || (fileItem.fileId && getCloudflareImageUrl(fileItem.fileId, { width: 300 }))
  const t = useTranslations('MemoriesControl')

  return (
    <div className="flex w-full gap-4 text-left">
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
            <VideoPlayer src={getCloudflareVideoUrl(fileItem.fileId)} size="sm" />
          ) : null)}
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
            <div>
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
