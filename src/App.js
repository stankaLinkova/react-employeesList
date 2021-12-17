import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Detail from "./components/Detail";
import { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Listing from "./components/Listing";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Listing />} />
            <Route path="/detail/:emplId" element={<Detail />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
