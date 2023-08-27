// import logo from './logo.svg';
import './App.css';
import {Routes,Route} from "react-router-dom";
import ImageUploadComponent from './main.js';
import ProceedCreate from "./preview"
import Footer from './footer';
import Navbar from './navbar';


function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<ImageUploadComponent/>}></Route>
        <Route path = "/download" element={<ProceedCreate/>} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
