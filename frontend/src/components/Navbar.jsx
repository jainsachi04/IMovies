import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); };
  return <nav className="navbar navbar-expand-lg navbar-dark im-nav"><div className="container"><Link className="navbar-brand brand" to="/"><span className="brand-mark">i</span> IMOVIES<span className="brand-dot">.</span></Link><button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navContent" aria-label="Toggle navigation"><span className="navbar-toggler-icon"/></button><div className="collapse navbar-collapse" id="navContent"><div className="navbar-nav ms-auto align-items-lg-center gap-lg-3"><NavLink className="nav-link" to="/">Discover</NavLink>{user && <NavLink className="nav-link" to="/bookings">My bookings</NavLink>}{user?.role === 'admin' && <NavLink className="nav-link" to="/admin">Admin</NavLink>}{user ? <><span className="nav-user">Hi, {user.name.split(' ')[0]}</span><button className="btn btn-sm btn-outline-light rounded-pill px-3" onClick={signOut}>Log out</button></> : <><Link className="nav-link" to="/login">Log in</Link><Link className="btn btn-sm btn-coral rounded-pill px-3" to="/register">Join IMovies</Link></>}</div></div></div></nav>;
}
