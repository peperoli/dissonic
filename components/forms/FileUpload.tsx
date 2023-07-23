import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import Image from 'next/legacy/image'
import { ChangeEvent, DragEvent, useEffect, useState } from 'react'
import { useAvatar } from '../../hooks/useAvatar'
import { useKillFile } from '../../hooks/useKillFile'
import { useUploadFile } from '../../hooks/useUploadFile'
import { Button } from '../Button'
import { SpinnerIcon } from '../layout/SpinnerIcon'

type FileUploadProps = {
  name: string
  label: string
  path?: string
  value: string | null | undefined
  onChange: (value: string | null | undefined) => void
}

export const FileUpload = ({ label, name, path, value, onChange }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false)
  const uploadFile = useUploadFile()
  const killFile = useKillFile()
  const getPreviewUrl = useAvatar(value)
  
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
      uploadFile.mutate({ file, path: path + file.name })
    }
  }

  const handleChange = function (event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0]
      uploadFile.mutate({ file, path: path + file.name })
    }
  }

  useEffect(() => {
    if (uploadFile.status === 'success') {
      onChange(uploadFile.data.path)
    }
  }, [uploadFile.status])

  const handleKill = function () {
    onChange(null)

    if (uploadFile.data?.path) {
      killFile.mutate({ bucket: 'avatars', name: uploadFile.data?.path })
    }
  }
  return (
    <label htmlFor={name} className="block">
      <span className="relative block mb-1 text-sm text-slate-300">{label}</span>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
        onChange={handleChange}
        className="sr-only peer"
      />
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={clsx(
          'flex items-center gap-4 p-4 rounded-lg border-2 border-dashed bg-slate-750 peer-focus:border-venom',
          dragActive ? ' border-solid border-venom' : ' border-slate-500'
        )}
      >
        <div className="relative grid place-content-center w-24 aspect-square rounded-lg bg-slate-850">
          {getPreviewUrl.data ? (
            <>
              <Image
                src={getPreviewUrl.data}
                alt={''}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <div className="absolute -top-2 -right-2 rounded-lg shadow-lg">
                <Button
                  onClick={handleKill}
                  icon={<XMarkIcon className="h-icon" />}
                  label="Entfernen"
                  contentType="icon"
                  size="small"
                />
              </div>
            </>
          ) : (
            <>
              {uploadFile.isLoading ? (
                <SpinnerIcon className="h-8 text-slate-300 animate-spin" />
              ) : (
                <ArrowUpTrayIcon
                  className={clsx('h-8 text-slate-300', dragActive && 'pointer-events-none')}
                />
              )}
            </>
          )}
        </div>
        <p className={clsx(dragActive && 'pointer-events-none')}>
          Datei hinziehen
          <br />
          oder <span className="font-bold cursor-pointer hover:text-venom">durchsuchen</span>
        </p>
      </div>
    </label>
  )
}
