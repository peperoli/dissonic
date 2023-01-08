import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'
import React, { Dispatch, FC, SetStateAction } from 'react'

interface FileInputProps {
  file: any
  setFile: Dispatch<SetStateAction<any>>
}

export const FileInput: FC<FileInputProps> = ({ file, setFile }) => {
  return (
    <div className="relative w-full h-32 rounded-lg border-2 border-dashed border-slate-500 bg-slate-700 accent-slate-50">
      <label htmlFor="avatar">
        <span className="absolute ml-4 mt-0.5 py-0.5 rounded text-xs text-slate-300 z-10">
          Profilbild
        </span>
        <span className="block p-4 pt-8">
          <ArrowUpTrayIcon className="h-icon mb-2" />
          {!file ? (
            <span className="text-sm text-slate-300">
              {/* Drag & Drop oder */}
              <span className="underline text-venom">Dateien durchsuchen</span>
            </span>
          ) : (
            <span>{file.name}</span>
          )}
        </span>
      </label>
      <input
        type="file"
        id="avatar"
        accept="image/png, image/jpeg, image/gif"
        className="sr-only"
        onChange={event => (event.target.files ? setFile(event.target.files[0]) : setFile(null))}
      />
    </div>
  )
}
