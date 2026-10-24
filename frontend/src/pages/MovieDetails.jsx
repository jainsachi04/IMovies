import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api';
export default function MovieDetails() {
 const { id } = useParams(); const [movie,setMovie]=useState(null); const [shows,setShows]=useState([]); const [error,setError]=useState('');
 useEffect(()=>{Promise.all([api.get(`/movies/${id}`),api.get('/shows',{params:{movieId:id}})]).then(([m,s])=>{setMovie(m.data.movie);setShows(s.data.shows)}).catch(e=>setError(errorMessage(e)))},[id]);
 if(error)return <main className="page-shell"><div className="container alert alert-warning">{error}</div></main>;
 if(!movie)return <main className="page-shell"><div className="container loading-state">Loading movie details…</div></main>;
 const byDate = shows.reduce((acc,s)=>{const key=new Date(s.date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'});(acc[key] ||= []).push(s);return acc;},{});
 return <main className="page-shell"><div className="container"><Link to="/" className="back-link">← All movies</Link><div className="detail-layout"><img className="detail-poster" src={movie.posterUrl} alt={`${movie.title} poster`}/><div className="detail-info"><div className="eyebrow dark-eyebrow">{movie.genre?.toUpperCase()} · {movie.language?.toUpperCase()}</div><h1>{movie.title}</h1><div className="detail-stats"><span>★ {movie.rating}</span><span>{movie.duration} min</span><span>{movie.language}</span></div><p>{movie.description}</p><h2 className="subheading">Choose your showtime</h2>{Object.keys(byDate).length?Object.entries(byDate).map(([day,dayShows])=><div className="show-day" key={day}><b>{day}</b><div className="showtime-list">{dayShows.map(show=><Link key={show._id} to={`/book/${show._id}`} className="showtime-card"><span>{show.time}</span><small>{show.cinema}</small><b>₹{show.price}</b></Link>)}</div></div>):<p className="muted-copy">No shows available yet. Run the database seed command to add demo shows.</p>}</div></div></div></main>;
}
