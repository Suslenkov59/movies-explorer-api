const Movie = require('../models/movie');

const BadRequest = require('../utils/response-errors/BadRequest');
const NotFound = require('../utils/response-errors/NotFound');
const RightsError = require('../utils/response-errors/RightsError');

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({owner: userId})
    .then((movie) => {
      if (!userId) {
        next(new NotFound('Фильмы не найдены'));
      } else {
        res.send(movie);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const {movieId} = req.params;

  Movie.findById(movieId)
    .orFail(new NotFound('Фильм не найден'))
    .then((movie) => {
      const owner = movie.owner.toString();
      if (owner === req.user._id) {
        return Movie.findByIdAndRemove(movieId)
          .then(() => {
            res.send({message: 'Фильм удалён'});
          })
          .catch(next);
      }
      throw new RightsError('Это не ваш фильм');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    });
};
