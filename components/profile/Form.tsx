import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/useProfiles'
import { AddProfile, EditProfile, Profile } from '../../types/types'
import { Button } from '../Button'
import { FileUpload } from '../forms/FileUpload'
import { TextField } from '../forms/TextField'

type FormProps = {
  userId: string
  profile?: Profile
  onSubmit: SubmitHandler<AddProfile> | SubmitHandler<EditProfile>
  mutateProfile:
    | UseMutationResult<void, unknown, AddProfile, unknown>
    | UseMutationResult<void, unknown, EditProfile, unknown>
  killFile: UseMutationResult<void, unknown, { bucket: string; name: string }, unknown>
  close: () => void
}

export const Form = ({ userId, profile, onSubmit, mutateProfile, killFile, close }: FormProps) => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
    reset,
  } = useForm<EditProfile>({
    defaultValues: profile && { username: profile.username, avatar_path: profile.avatar_path },
    mode: 'onChange',
  })
  const { data: profiles } = useProfiles()
  const usernames = profiles?.map(item => item.username)
  const queryClient = useQueryClient()
  const { push } = useRouter()

  const cancel = () => {
    const avatarPath = watch('avatar_path')
    if (avatarPath && dirtyFields.avatar_path) {
      killFile.mutate({ bucket: 'avatars', name: avatarPath })
    }
    reset()
    close()
  }

  useEffect(() => {
    if (mutateProfile.status === 'success') {
      queryClient
        .invalidateQueries(['profile', userId])
        .catch(error => console.error(error))
        .finally(() => (dirtyFields.username ? push(`/users/${watch('username')}`) : close()))
    }
  }, [mutateProfile.status])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <Controller
        name="avatar_path"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FileUpload
            name="avatar_path"
            label="Profilbild"
            path={`${userId}/`}
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
        autofill="off"
      />
      <div className="flex gap-4 [&>*]:flex-1">
        <Button onClick={cancel} label="Abbrechen" />
        <Button
          type="submit"
          label="Speichern"
          style="primary"
          disabled={Object.keys(errors).length > 0}
          loading={mutateProfile.status === 'loading' || killFile.status === 'loading'}
        />
      </div>
    </form>
  )
}
