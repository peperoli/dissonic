import Navigation from "./navigation"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function PageWrapper({ children }) {
  return (
    <div className="flex">
      <Navigation />
      {children}
      <ToastContainer
				position="top-right"
				autoClose={3000}
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
        theme="dark"
			/>
    </div>
  )
}