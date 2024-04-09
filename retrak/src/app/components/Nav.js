import Image from 'next/image'
import logo from '../assets/icon.png'
import '../styles/nav.scss'
export default function Navbar(){
    return (
        <nav>
        <div className="left">
          <img src={logo.src} alt="logo" width={50} height={50} />
        </div>
        <div className="right">
          <div className="img">
            <img src="https://www.teddyoweh.net/_next/static/media/oweh.43ffe13c.jpeg" alt="logo"  />
          </div>
        </div>
          </nav>
    )
}