import { Link, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { Snoop } from "./pages/Snoop.jsx"
import book from './assets/book.png'; // BOOK IMAGE FOR HEADER 
import "./styles.css"

function App() {
 return <>

    <header className="page-title">
        <img src={book} className="logo"/>
        <h1>open_book</h1>
    </header>

  <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/snoop" element={<Snoop />} />
  </Routes>
 </>
}

export default App