const moviesRouter = require('express').Router();

const { createMovies, getMovies, deleteMovie } = require('../controllers/movie');
const { validationCreateMovie, validationDeleteMovie } = require('../utils/joi-validation');

moviesRouter.post('/', validationCreateMovie, createMovies);

moviesRouter.get('/', getMovies);

moviesRouter.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = moviesRouter;
