var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressGraphQL = require('express-graphql')
const postsRouter = require('./routes/posts.js'); 
const profileRouter = require('./routes/profile.js'); 
const gptIntroRouter = require('./routes/gptIntro.js'); 
const recommendationsRouter = require('./routes/recommendations')
const searchRouter = require('./routes/search')
const conversation = require('./routes/conversation');
const { schema } = require('./graphql/graphql'); // Adjust the path accordingly

var app = express();
const cors = require('cors');
require('dotenv').config();

var url = process.env.VITE_SERVER_URL;

app.use(cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: url,
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
    maxAge: 3600,
  })
);

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: false
}))


app.use('/api/posts/', postsRouter);
app.use('/', profileRouter);
app.use('/', gptIntroRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/search', searchRouter);
app.use('/', conversation);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;