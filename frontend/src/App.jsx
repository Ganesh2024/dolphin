import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./Components/Register/Register";
import { PageNotFound } from "./Components/PageNotFound/PageNotFound";
import LangSelect from './components/Langselection/LangSelect'
import Exercises from './components/Exercise/Exercises'
import { Login } from "./components/Login/Login";
import "./App.css";
import { Question } from "./components/Question/Question";


function App() {
  return (
    <BrowserRouter> 
        <Routes>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="langSelect" element={<LangSelect />} /> 
          <Route path="main" element={<Exercises/>} />
          <Route path="/" element={<Login/>} />
          <Route path="question" element={< Question/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter> 
  ) 
}

export default App
