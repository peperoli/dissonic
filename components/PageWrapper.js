import Navigation from "./navigation"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "./NavBar";

export default function PageWrapper({ children }) {
  return (
    <>
    <NavBar />
    <div className="flex">
      <Navigation />
      {children}
      <ToastContainer
				position="bottom-right"
				autoClose={3000}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
        theme="dark"
			/>
    </div>
    </>
  )
}