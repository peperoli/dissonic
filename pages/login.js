import supabase from "../utils/supabase"

export default function LoginPage() {
  async function handleSubmit(event) {
    event.preventDefault()

    const email = event.target.email.value

    await supabase.auth.signIn({ email })

    window.alert('Du hast eine E-Mail mit einem Login-Link erhalten.')
  }
  return (
    <main className="p-8">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="text" id="email" name="email" />
        </div>
        <button type="submit" className="btn btn-primary">Log in</button>
      </form>
    </main>
  )
}