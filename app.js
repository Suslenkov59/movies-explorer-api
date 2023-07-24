require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const {errors} = require('celebrate');

const {PORT, NODE_ENV, DATABASEURL} = process.env;
const {requestLogger, errorLogger} = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const {handleError} = require('./utils/handleError');

const app = express();

const {mongodbUrl} = require('./utils/constants')

mongoose.connect(NODE_ENV === 'production' ? DATABASEURL : mongodbUrl)

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors);
app.use(requestLogger);
app.use(limiter);
router(app);
app.use(errorLogger);
app.use(errors());

app.use(handleError);

app.listen(NODE_ENV === 'production' ? PORT : 3000, () => {
  console.log(`App started on ${PORT} port`);
})
