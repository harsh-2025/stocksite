
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const { AlphaVantageAPI } = require('alphavantage');
const yfinance = require('yfinance');
const { TimeSeries } = require('alphavantage');
const axios = require('axios');
const Axios = require('axios');
const app = express();
const stockdata = require('../data/stockdata.json')


const cheerio = require('cheerio');
const path = require("path");
require('dotenv').config();
const mongokey = process.env.MONGO_URL;
const port = 3001;
const stockRoutes = require('../routes/stocks')
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongokey, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    name: String,
    dob: String,
    email: String,
    username: String,
  password: String,
  stocks: [
    {
      stockSymbol: String,
      quantity: Number,
      boughtPrice: Number,
      companyName:String,
    },
  ],
});

const User = mongoose.model('User', userSchema);


const fetchUserStocks = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return null; // User not found
    }

    return user.stocks || []; // Return user's stocks or an empty array if not available
  } catch (error) {
    console.error('Error fetching user stocks:', error);
    throw error;
  }
};



// FEOSIB1AQCYGF21H
// app.get('/', (req, res) => {
//   app.use(express.static(path.resolve(__dirname, "portfoliomanage_frontend", "build")));
//   // res.send('Hello World!');
//   res.sendFile(path.resolve(__dirname, "portfoliomanage_frontend", "build", "index.html"));
// });
app.use(express.static(path.resolve(__dirname, "portfoliomanage_frontend", "build")));

// Define your route handlers
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "portfoliomanage_frontend", "build", "index.html"));
});

app.post('/addMoreStock', async (req, res) => {
  const { username, stockSymbol, quantity, boughtPrice } = req.body;

  try {
    // Add logic to update user stocks and return the updated user
    const updatedUser = await updateUserStocks(username, stockSymbol, quantity, boughtPrice);
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updateStock', async (req, res) => {
  const { username, stockSymbol, quantity, boughtPrice } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (user) {
      // Find the stock in the user's stocks
      const stockIndex = user.stocks.findIndex((stock) => stock.stockSymbol === stockSymbol);

      if (stockIndex !== -1) {
        // Update the quantity and bought price
        user.stocks[stockIndex].quantity = quantity;
        user.stocks[stockIndex].boughtPrice = boughtPrice;

        // Save the updated user to the database
        await user.save();

        return res.json({ user });
      }
    }

    res.status(404).json({ error: 'User or stock not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/deleteStock', async (req, res) => {
  const { username, stockSymbol, quantity } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (user) {
      // Find the stock in the user's stocks
      const stockIndex = user.stocks.findIndex((stock) => stock.stockSymbol === stockSymbol);

      if (stockIndex !== -1) {
        // If quantity is provided, decrease it; otherwise, remove the stock
        if (quantity) {
          user.stocks[stockIndex].quantity -= quantity;

          if (user.stocks[stockIndex].quantity <= 0) {
            user.stocks.splice(stockIndex, 1);
          }
        } else {
          user.stocks.splice(stockIndex, 1);
        }

        // Save the updated user to the database
        await user.save();

        return res.json({ user });
      }
    }

    res.status(404).json({ error: 'User or stock not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get_stock_data', async (req, res) => {
  const tickers = req.query.tickers;

  if (!tickers) {
    return res.status(400).json({ error: 'Tickers parameter is required' });
  }

  console.log('Fetching data for tickers:', tickers);

  try {
    const response = await fetch(`https://stocks.algobook.info/api/v1/stocks?tickers=${tickers}`);
    const stockData = await response.json();
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/search_stock', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword parameter' });
  }

  try {
    const response = await axios.get(`https://www.nseindia.com/api/search/autocomplete?q=${keyword}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error searching stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});













app.use(express.json());
app.post('/addStock', async (req, res) => {
  try {
    const { username, stockSymbol, quantity,boughtPrice,companyName } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming your User model has a 'stocks' field as an array
    // You may need to adjust this based on your data model
    user.stocks.push({ stockSymbol, quantity,boughtPrice });

    // Save the updated user
    const updatedUser = await user.save();
    
    // Send the updated user object back to the client
    res.json({ user: updatedUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/signup', async (req, res) => {
    try {
      const { name, dob, email, username, password } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Create a new user
      const newUser = new User({ name, dob, email, username, password });
      await newUser.save();
  
      res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Add a new route for handling login requests
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
      const stocks = await fetchUserStocks(username);
        return   res.status(200).json({ message: 'Login successful', user: { name: user.name, username: user.username ,stocks} });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// module.exports = router;







// setting up firebase************************************************
// const admin = require('firebase-admin');
// const express = require('express');
// const bodyParser = require('body-parser');

// // Initialize Firebase Admin SDK with your service account key
// const serviceAccount = require('../firebase/portfolio-b0786-firebase-adminsdk-r14oe-c97574f400.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://portfolio-b0786-default-rtdb.firebaseio.com',
// });

// const app = express();
// const port = 3001;

// app.use(bodyParser.json());

// // Example route for user signup
// app.post('/signup', async (req, res) => {
//   try {
//     const { name, dob, email, username, password } = req.body;

//     // Create a user in the Firebase Realtime Database
//     const userRef = admin.database().ref('users');
//     const newUserRef = userRef.push();
//     await newUserRef.set({
//       name,
//       dob,
//       email,
//       username,
//       password,
//     });

//     res.status(201).json({ message: 'Signup successful' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
