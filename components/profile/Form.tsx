import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useProfiles } from '../../hooks/profiles/useProfiles'
import { EditProfile } from '../../types/types'
import { Button } from '../Button'
import { FileUpload } from '../forms/FileUpload'
import { TextField } from '../forms/TextField'
import { useEditProfile } from '@/hooks/profiles/useEditProfile'
import { useProfile } from '@/hooks/profiles/useProfile'
import { useTranslations } from 'next-intl'
import supabase from '@/utils/supabase/client'

type FormProps = {
  close: () => void
}

export const Form = ({ close }: FormProps) => {
  const { username } = useParams<{ username?: string }>()
  const { data: profile } = useProfile(null, username)
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
  } = useForm<EditProfile & { avatarFile: File | string | null }>({
    values: {
      ...profile,
      avatarFile: profile?.avatar_path
        ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_path).data.publicUrl
        : null,
    },
    mode: 'onChange',
  })
  const { data: profiles } = useProfiles()
  const editProfile = useEditProfile()
  const t = useTranslations('ProfileForm')
  const usernames = profiles?.map(item => item.username)

  const { push } = useRouter()

  const onSubmit: SubmitHandler<
    EditProfile & { avatarFile: File | string | null }
  > = async formData => {
    editProfile.mutate(formData)
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
          loading={editProfile.isPending}
        />
      </div>
    </form>
  )
}
