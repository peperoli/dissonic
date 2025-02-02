import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { useSession } from '../../hooks/auth/useSession'
import { EditProfile } from '../../types/types'
import { Button } from '../Button'
import { FileUpload } from '../forms/FileUpload'
import { TextField } from '../forms/TextField'
import { useEditProfile } from '@/hooks/profiles/useEditProfile'
import { useDeleteAvatar } from '@/hooks/files/useDeleteAvatar'
import { useProfile } from '@/hooks/profiles/useProfile'
import { useUploadAvatar } from '@/hooks/profiles/useUploadAvatar'
import { useAvatar } from '@/hooks/profiles/useAvatar'
import { useTranslations } from 'next-intl'

type FormProps = {
  close: () => void
}

export const Form = ({ close }: FormProps) => {
  const { username } = useParams<{ username?: string }>()
  const { data: profile } = useProfile(null, username)
  const { data: avatar } = useAvatar(profile?.avatar_path)
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<EditProfile & { avatarFile: File | Blob | null }>({
    values: { ...profile, avatarFile: avatar?.file ?? null },
    mode: 'onChange',
  })
  const { data: profiles } = useProfiles()
  const { data: session } = useSession()
  const editProfile = useEditProfile()
  const deleteFiles = useDeleteAvatar()
  const uploadAvatar = useUploadAvatar()
  const t = useTranslations('ProfileForm')
  const usernames = profiles?.map(item => item.username)

  const { push } = useRouter()

  const onSubmit: SubmitHandler<
    EditProfile & { avatarFile: File | Blob | null }
  > = async formData => {
    const isFileInstance = formData.avatarFile instanceof File
    const avatarName = formData.avatarFile instanceof File ? formData.avatarFile.name : null
    const avatarPath = avatarName ? `${session?.user.id}/${avatarName}` : profile?.avatar_path

    if (profile?.avatar_path && (isFileInstance || !formData.avatarFile)) {
      deleteFiles.mutate(profile.avatar_path)
    }

    if (formData.avatarFile && isFileInstance) {
      const path = `${session?.user.id}/${avatarName}`
      uploadAvatar.mutate({ file: formData.avatarFile, path })
    }

    editProfile.mutate({ ...formData, avatar_path: formData.avatarFile ? avatarPath : null })
  }

  useEffect(() => {
    if (editProfile.status === 'success') {
      dirtyFields.username ? push(`/users/${watch('username')}`) : close()
    }
  }, [editProfile.status])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <Controller
        name="avatarFile"
        control={control}
        render={({ field }) => <FileUpload label={t('profilePicture')} {...field} />}
      />
      <TextField
        {...register('username', {
          required: true,
          validate: value =>
            value === profile?.username ||
            !usernames?.includes(value ?? '') ||
            t('usernameTakenError'),
        })}
        error={errors.username}
        label={t('username')}
        autoComplete="off"
      />
      <div className="flex gap-4 [&>*]:flex-1">
        <Button onClick={close} label={t('cancel')} />
        <Button
          type="submit"
          label={t('save')}
          appearance="primary"
          disabled={Object.keys(errors).length > 0}
          loading={editProfile.isPending || deleteFiles.isPending}
        />
      </div>
    </form>
  )
}
