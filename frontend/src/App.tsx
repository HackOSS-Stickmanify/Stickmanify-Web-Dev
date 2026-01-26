import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'

function App() {

  // Temporary "login method" without auth
  const isLoggedIn = false;
  return isLoggedIn ? <Login/> : <Login/>

}

export default App
