const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/user');
const { validationCreateUser, loginValidation } = require('../utils/joi-validation');

const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFound = require('../utils/response-errors/NotFound');

module.exports = (app) => {
  app.post('/signup', validationCreateUser, createUser);
  app.post('/signin', loginValidation, login);

  app.use('/users', auth, userRouter);
  app.use('/movies', auth, moviesRouter);
  app.get('/signout', logout);

  app.use(auth, (req, res, next) => next(new NotFound('Страница не найдена')));
};
