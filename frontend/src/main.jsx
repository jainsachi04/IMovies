import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';
function Guard({ children, admin=false }) { const {user,loading}=useAuth(); if(loading)return <div className="loading-state page-shell">Getting things ready…</div>; if(!user)return <Navigate to="/login" replace/>; if(admin&&user.role!=='admin')return <Navigate to="/" replace/>; return children; }
function App(){return <AuthProvider><BrowserRouter><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/movie/:id" element={<MovieDetails/>}/><Route path="/book/:showId" element={<Booking/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/bookings" element={<Guard><Bookings/></Guard>}/><Route path="/admin" element={<Guard admin><Admin/></Guard>}/><Route path="*" element={<main className="page-shell container py-5"><h1>Page not found</h1><a href="/">Return home</a></main>}/></Routes><footer className="site-footer"><div className="container"><span className="brand">IMOVIES<span className="brand-dot">.</span></span><span>Stories worth sharing. Seats worth saving.</span><span>© {new Date().getFullYear()} IMovies</span></div></footer></BrowserRouter></AuthProvider>}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
