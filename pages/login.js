import supabase from "../utils/supabase"

export default function LoginPage() {
  async function handleSubmit(event) {
    event.preventDefault()

    const email = event.target.email.value

    await supabase.auth.signIn({ email })
  }
  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-Mail</label>
        <input type="text" id="email" name="email" />
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}