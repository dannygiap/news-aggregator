const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('./middleware/auth');
const path = require('path');

const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(cors());

//connect to mongodb
mongoose
  .connect(config.get('URI'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Successfully connected to mongoDB database');
  })
  .catch((err) => {
    console.log('Error: ', err.message);
  });

//create schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  preferences: [
    {
      type: String,
    },
  ],
});

const UserModel = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  console.log('root page');
  res.send('root page');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: 'invalid form submission' });
  }

  UserModel.findOne({ email: email }).then((user) => {
    if (!user) return res.status(400).json({ msg: 'user does not exist' });
    //verify password
    bcrypt.compare(password, user.password).then((result) => {
      if (result === false) {
        return res.status(400).json({ msg: 'invalid username or password' });
      }
      jwt.sign(
        { id: user.id },
        config.get('jwtSecret'),
        { expiresIn: 7 * 24 * 60 * 60 * 1000 },
        (err, token) => {
          if (err) throw err;
          return res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              preferences: user.preferences,
            },
          });
        }
      );
    });
  });
});

app.get('/logout', function (req, res) {
  console.log('logged out');
  req.logout();
  res.redirect('/');
});

app.post('/register', (req, res) => {
  const { name, email, password, preferences } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'invalid form submission' });
  }

  UserModel.findOne({ email: email }).then((user) => {
    if (user) return res.status(400).json({ msg: 'user already exists' });
  });

  //hash password and store user into db
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      console.log(err);
    }
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) throw err;
      UserModel.create(
        {
          name: name,
          email: email,
          password: hash,
          preferences: preferences,
        },
        function (err, user) {
          jwt.sign(
            { id: user.id },
            config.get('jwtSecret'),
            { expiresIn: 7 * 24 * 60 * 60 * 1000 },
            (err, token) => {
              if (err) throw err;
              return res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  preferences: user.preferences,
                },
              });
            }
          );
        }
      );
    });
  });
});

app.put('/preferences', auth, (req, res) => {
  console.log('reached update preference endpoint');
  UserModel.findByIdAndUpdate(
    req.user.id,
    {
      preferences: req.body.preferences,
    },
    { new: true },
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  ).catch((err) => res.json({ msg: 'failed to update' }));
});

app.get('/search/:input', (req, res) => {
  //   res.setHeader('Access-Control-Allow-Origin', '*');
  fetch(
    `https://newsaggregation.cognitiveservices.azure.com/bing/v7.0/news/search?q=${req.params.input}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': config.get('key'),
      },
    }
  )
    .then((res) => res.json())
    .then((news) => res.send(news));
});

app.get('/news/:input', (req, res) => {
  //   res.setHeader('Access-Control-Allow-Origin', '*');
  fetch(
    `https://newsaggregation.cognitiveservices.azure.com/bing/v7.0/news?category=${req.params.input}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': config.get('key'),
      },
    }
  )
    .then((res) => res.json())
    .then((news) => res.send(news));
});

app.get('/news/trending', (req, res) => {
  //   res.setHeader('Access-Control-Allow-Origin', '*');
  fetch(
    'https://newsaggregation.cognitiveservices.azure.com/bing/v7.0/news/trendingtopics?mkt=en-us',
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': config.get('key'),
      },
    }
  )
    .then((res) => res.json())
    .then((news) => res.send(news));
});

app.get('/user', auth, (req, res) => {
  UserModel.findById(req.user.id)
    .select('-password')
    .then((user) => {
      res.json(user);
    });
});

const port = process.env.PORT || 3001;

//serve static if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
