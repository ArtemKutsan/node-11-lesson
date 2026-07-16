import express from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME;

const movies = [
  { id: 1, title: 'Интерстеллар', year: 2014, genre: 'sci-fi', ratings: [8, 9], reviews: [] },
  { id: 2, title: 'Крестный отец', year: 1972, genre: 'crime', ratings: [9, 10], reviews: [] },
  // { id: 3, title: 'Темный рыцарь', year: 2008, genre: 'action', ratings: [8, 9], reviews: [] },
];

// GET / — главная страница
app.get('/', (req, res) => {
  res.send(`Welcome to ${APP_NAME}`);
});

// GET /api/v1/health
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK' });
});

// GET /api/v1/movies
app.get('/api/v1/movies', (req, res) => {
  res.json(movies);
});

// GET /api/v1/movies/:id
app.get('/api/v1/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.json(movie);
});

// POST /api/v1/movies
app.post('/api/v1/movies', (req, res) => {
  const { title, year, genre } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Invalid title' });
  }

  const currentYear = new Date().getFullYear();
  if (!year || typeof year !== 'number' || year < 1895 || year > currentYear) {
    return res.status(400).json({ error: 'Invalid year' });
  }

  if (!genre || typeof genre !== 'string') {
    return res.status(400).json({ error: 'Invalid genre' });
  }

  const newMovie = {
    id: movies.length ? movies[movies.length - 1].id + 1 : 1,
    title,
    year,
    genre,
    ratings: [],
    reviews: [],
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// POST /api/v1/movies/:id/ratings
app.post('/api/v1/movies/:id/ratings', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((movie) => movie.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const { value } = req.body;

  if (typeof value !== 'number' || value < 1 || value > 10) {
    return res.status(400).json({ error: 'Rating must be a number from 1 to 10' });
  }

  movie.ratings.push(value);

  const count = movie.ratings.length;
  const average = movie.ratings.reduce((a, b) => a + b, 0) / count;

  res.status(201).json({ average, count });
});

// POST /api/v1/movies/:id/reviews
app.post('/api/v1/movies/:id/reviews', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  const { author, text } = req.body;

  if (!author || typeof author !== 'string') {
    return res.status(400).json({ error: 'Invalid author' });
  }

  if (!text || typeof text !== 'string' || text.length < 10) {
    return res.status(400).json({ error: 'Text must be at least 10 characters' });
  }

  const review = {
    author,
    text,
    createdAt: new Date().toISOString(),
  };

  movie.reviews.push(review);

  res.status(201).json(review);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
