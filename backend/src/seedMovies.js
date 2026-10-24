
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Movie = require('./models/Movie');
const Show = require('./models/Show');

const seatNames = Array.from(
  { length: 6 },
  (_, r) =>
    Array.from(
      { length: 8 },
      (_, c) => `${String.fromCharCode(65 + r)}${c + 1}`
    )
).flat();

const catalog = [
  {
    title: 'The Last Horizon',
    description: 'A thrilling journey beyond the edge of the known world.',
    genre: 'Adventure',
    duration: 132,
    language: 'English',
    rating: 8.4,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    title: 'City of Dreams',
    description: 'An aspiring musician discovers what matters most in a city that never sleeps.',
    genre: 'Drama',
    duration: 118,
    language: 'Hindi',
    rating: 7.9,
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Orbit 9',
    description: 'A space crew must solve a mystery before their return window closes.',
    genre: 'Sci-Fi',
    duration: 145,
    language: 'English',
    rating: 8.7,
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    title: 'Laughing Matters',
    description: 'A family wedding turns into a joyful chain of unexpected mix-ups.',
    genre: 'Comedy',
    duration: 106,
    language: 'Hindi',
    rating: 7.3,
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Shadow Protocol',
    description: 'An investigator follows a trail into a dangerous conspiracy.',
    genre: 'Thriller',
    duration: 126,
    language: 'Hindi',
    rating: 8.1,
    posterUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Monsoon Letters',
    description: 'Two old friends reconnect through letters lost to the monsoon.',
    genre: 'Romance',
    duration: 121,
    language: 'Hindi',
    rating: 7.8,
    posterUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80'
  }
];

async function seedMovies() {
  try {
    await connectDB();

    let movies = await Movie.find();

    if (movies.length === 0) {
      movies = await Movie.insertMany(catalog);
      console.log(`Added ${movies.length} movies.`);
    } else {
      console.log(`Movies already exist: ${movies.length}. No duplicates added.`);
    }

    if (await Show.countDocuments() === 0) {
      const shows = [];
      const now = new Date();

      for (let day = 0; day < 4; day++) {
        for (let i = 0; i < movies.length; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() + day);
          date.setHours(0, 0, 0, 0);

          shows.push({
            movie: movies[i]._id,
            cinema: ['PVR Treasure Island', 'INOX C21 Mall', 'Cinepolis'][i % 3],
            city: 'Indore',
            date,
            time: ['10:30', '13:45', '17:15', '20:30'][(i + day) % 4],
            price: [180, 220, 250][(i + day) % 3],
            seats: seatNames.map(seatNumber => ({
              seatNumber,
              status: 'available'
            }))
          });
        }
      }

      await Show.insertMany(shows);
      console.log(`Added ${shows.length} shows.`);
    } else {
      console.log('Shows already exist. No duplicate shows added.');
    }
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedMovies();
