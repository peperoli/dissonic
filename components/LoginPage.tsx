'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSignIn } from '../hooks/useSignIn'
import { Button } from './Button'
import { TextField } from './forms/TextField'
import { PageWrapper } from './layout/PageWrapper'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>()
  const { mutate, status } = useSignIn()
  const router = useRouter()

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async formData => {
    mutate(formData)
  }

  useEffect(() => {
    if (status === 'success') {
      router.push('/')
    }
  }, [status])
  return (
    <PageWrapper>
      <main className="w-full max-w-lg p-8">
        <h1>Anmelden &amp; Konzerte eintragen</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <TextField
            {...register('email', { required: true })}
            error={errors.email}
            type="email"
            label="E-Mail"
            placeholder="william@delos.com"
          />
          <TextField
            {...register('password', { required: true })}
            error={errors.password}
            type="password"
            label="Passwort"
          />
          <div>
            <Button type="submit" label="Anmelden" style="primary" loading={status === 'loading'} />
          </div>
        </form>
      </main>
    </PageWrapper>
  )
}
