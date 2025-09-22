import { useState } from 'react'
import { Route, Routes as MyRouter } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import Authentication from './pages/authentication'
import VideoComponent from './pages/VideoMeet'
import HomeComponent from './pages/HomeComponent'
import History from './pages/History'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
       <Toaster/>
       <MyRouter>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/Home' element={<HomeComponent/>}></Route>
        <Route path='/auth' element={<Authentication/>}></Route>
        <Route path='/History' element={<History/>}></Route>
        <Route path='/:id' element={<VideoComponent/>}></Route>
       </MyRouter>
    </>
  )
}

export default App;