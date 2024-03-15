import { useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { useSession } from '../../hooks/auth/useSession'
import { EditProfile } from '../../types/types'
import { Button } from '../Button'
import { FileUpload } from '../forms/FileUpload'
import { TextField } from '../forms/TextField'
import { useEditProfile } from '@/hooks/profiles/useEditProfile'
import { useKillFile } from '@/hooks/files/useKillFile'
import { useProfile } from '@/hooks/profiles/useProfile'

type FormProps = {
  close: () => void
}

export const Form = ({ close }: FormProps) => {
  const pathname = usePathname()
  const username = pathname.split('/').pop()
  const { data: profile } = useProfile(null, username)
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
    reset,
  } = useForm<EditProfile>({
    defaultValues: profile,
    mode: 'onChange',
  })
  const { data: profiles } = useProfiles()
  const { data: session } = useSession()
  const editProfile = useEditProfile()
  const killFile = useKillFile()
  const usernames = profiles?.map(item => item.username)
  const queryClient = useQueryClient()
  const { push } = useRouter()

  const onSubmit: SubmitHandler<EditProfile> = async formData => {
    if (profile?.avatar_path) {
      killFile.mutate({ bucket: 'avatars', name: profile.avatar_path })
    }
    editProfile.mutate({ ...formData, id: profile?.id })
  }

  const cancel = () => {
    const avatarPath = watch('avatar_path')
    if (avatarPath && dirtyFields.avatar_path) {
      killFile.mutate({ bucket: 'avatars', name: avatarPath })
    }
    reset()
    close()
  }

  useEffect(() => {
    if (editProfile.status === 'success') {
      queryClient
        .invalidateQueries(['profile', session?.user.id])
        .catch(error => console.error(error))
        .finally(() => (dirtyFields.username ? push(`/users/${watch('username')}`) : close()))
    }
  }, [editProfile.status])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <h2>Profil bearbeiten</h2>
      <Controller
        name="avatar_path"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FileUpload
            name="avatar_path"
            label="Profilbild"
            path={`${session?.user.id}/`}
            value={value}
            onChange={onChange}
          />
        )}
      />
      <TextField
        {...register('username', {
          required: true,
          validate: value =>
            value === profile?.username ||
            !usernames?.includes(value ?? '') ||
            'Dieser Benutzername ist bereits vergeben, sei mal kreativ.',
        })}
        error={errors.username}
        label="Benutzername"
        autoComplete="off"
      />
      <div className="flex gap-4 [&>*]:flex-1">
        <Button onClick={cancel} label="Abbrechen" />
        <Button
          type="submit"
          label="Speichern"
          appearance="primary"
          disabled={Object.keys(errors).length > 0}
          loading={editProfile.status === 'loading' || killFile.status === 'loading'}
        />
      </div>
    </form>
  )
}
