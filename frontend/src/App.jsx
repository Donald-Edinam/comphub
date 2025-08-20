import { Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import Signin1 from "./pages/auth/Signup"
import Login5 from "./pages/auth/Login"

function App() {
  return (
    <>
      <Routes>
        <Route path="/"  index element={<Home />} />
        <Route path="/signup" element={<Signin1 />} />
        <Route path="/login" element={<Login5 />} />
      </Routes>
    </>
  )
}

export default App