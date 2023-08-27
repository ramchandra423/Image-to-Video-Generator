// import logo from './logo.svg';
import './App.css';
import {Routes,Route} from "react-router-dom";
import UploadComponent from './main.js';
import Preview from "./preview"
import Footer from './footer';
import Navbar from './navbar';


function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<UploadComponent/>}></Route>
        <Route path = "/download" element={<Preview/>} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
