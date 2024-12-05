import React from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import Home from './pages/Home';
import Header from './components/Header';
import Process from './pages/Process';
import Settings from './pages/Settings';
import About from './pages/About';
import Apps from './pages/Apps';
import AppDetail from './pages/AppDetail';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/apps' Component={Apps} />
        <Route path='/app/:id' Component={AppDetail} />
        <Route path='/settings' Component={Settings} />
        <Route path='/about' Component={About} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
