import { Link } from 'react-router-dom';
import LOGOS from './LOGOS.png';
export default function Navbar() {
return (
    <nav className="navbar navbar-custom">
    <div className="container-fluid">
     <Link 
        style={{ color: '#FFF', textDecoration: 'none', fontFamily: 'Poppins', fontSize: 20 }} 
        to='/'>
           <img src={LOGOS}  alt="Logo" className="navbar-logo" />
          <span className='navbar-title'>DILVEN POS</span>
      </Link>
    </div>
  </nav>
);
}