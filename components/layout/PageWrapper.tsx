import Navigation from './Navigation'
import NavBar from './NavBar'

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <div className="md:flex">
        <Navigation />
        {children}
      </div>
    </>
  )
}
