import React,{useEffect} from 'react';
import Home from './components/home';
import Reader from './components/reader';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { keepTheme } from './theme'


function App() {
  useEffect(() => {
    keepTheme();
  })
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/blog/:id' element={<Reader />} />
          <Route path='*' element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
