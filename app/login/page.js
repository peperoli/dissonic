import { useRouter } from "next/navigation"
import PageWrapper from "../../components/layout/PageWrapper"
import supabase from "../../utils/supabase"

export default function LoginPage() {
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: event.target.email.value,
        password: event.target.password.value,
      })

      if (loginError) {
        throw loginError
      }

      router.push('/')
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <PageWrapper>
      <main className="w-full max-w-lg p-8">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="form-control">
            <input type="text" id="email" name="email" placeholder="" />
            <label htmlFor="email">E-Mail</label>
          </div>
          <div className="form-control">
            <input type="password" id="password" name="password" placeholder="" />
            <label htmlFor="password">Passwort</label>
          </div>
          <button type="submit" className="btn btn-primary">Anmelden</button>
        </form>
      </main>
    </PageWrapper>
  )
}