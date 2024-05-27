import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Work from './Components/Work';
import Desc from './Components/Desc';
import Workadmin from './Components/Workadmin'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   {/* <Desc/>
   {/* <Workadmin/> */}
   {/* <Work/>  */}
   <BrowserRouter>
   <Routes>
        <Route path="/" element={<h1>Home</h1>} /> 
        <Route path="/contact" element ={<>Contact</>}/>
        <Route path="/work" element ={<Work/>}/>
        <Route path="/cat" element ={<>cat</>}/>
        <Route path ="/work/workdes/:id" element={<Desc/>}/>
    </Routes>
    </BrowserRouter>
   </>
  )
}

export default App
