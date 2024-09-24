import "./App.css"
import { useContext } from 'react'
import Pages from './component/Router'
import Navbar from './component/Navbar'
import { BrowserRouter } from 'react-router-dom'
import { UserContext } from './store/user'

const App = () => {
  return (
    <div className="w-full lg:max-w-[1600px] mx-auto">

        <Navbar />

    <div className="w-[97%] md:w-[95%] lg:w-[90%] mx-auto">
        <Pages />
      </div>
    </div>
  )
}

export default App
