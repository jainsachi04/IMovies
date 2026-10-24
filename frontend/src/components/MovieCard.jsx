import { Link } from 'react-router-dom';
export default function MovieCard({ movie }) {
 const poster = movie.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
 return <article className="movie-card"><Link to={`/movie/${movie._id}`} className="poster-wrap"><img className="movie-poster" src={poster} alt={`${movie.title} poster`} loading="lazy"/><span className="poster-rating">★ {Number(movie.rating || 0).toFixed(1)}</span><span className="poster-cta">View showtimes <span>↗</span></span></Link><div className="movie-meta"><div className="movie-genre">{movie.genre} <span>·</span> {movie.language}</div><h3>{movie.title}</h3><p>{movie.duration} min</p></div></article>;
}
