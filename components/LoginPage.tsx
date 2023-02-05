"use client"

import { useRouter } from "next/navigation"
import { PageWrapper } from "./layout/PageWrapper"
import supabase from "../utils/supabase"
import React, { FormEvent } from "react"
import { Button } from "./Button"

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const target = event.target as typeof event.target & {
      email: { value: string }
      password: { value: string }
    }

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: target.email.value,
        password: target.password.value,
      })

      if (loginError) {
        throw loginError
      }

      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Unexpected error occurred, check the console.')
        console.error(error)
      }
    }
  }
  return (
    <PageWrapper>
      <main className="w-full max-w-lg p-8">
        <h1>Anmelden &amp; Konzerte eintragen</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="form-control">
            <input type="text" id="email" name="email" placeholder="william@delos.com" />
            <label htmlFor="email">E-Mail</label>
          </div>
          <div className="form-control">
            <input type="password" id="password" name="password" placeholder="" />
            <label htmlFor="password">Passwort</label>
          </div>
          <Button type="submit" label="Anmelden" style="primary" />
        </form>
      </main>
    </PageWrapper>
  )
}