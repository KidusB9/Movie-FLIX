const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const cors = require('cors');
const fetch = require('node-fetch');

const universitiesRouter = require('./routes/universities.js');

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// import universitiesRouter from './routes/universities'; // Import the universities router



const userRoutes = require('./routes/users');


app.use(express.json());
app.use('/api/users', userRoutes);
app.use(universitiesRouter);





app.post('/api/openai', async (req, res) => {
  // Ensure that messages are included in the request
  if (!req.body.messages || !Array.isArray(req.body.messages)) {
    return res.status(400).json({ message: "The 'messages' property is required and it must be an array." });
  }

  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: req.body.messages,
    max_tokens: req.body.max_tokens || 100,
    temperature: req.body.temperature || 0.5,
  };

  const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (openAiResponse.ok) {
    const jsonResponse = await openAiResponse.json();
    res.send(jsonResponse);
  } else {
    const errorResponse = await openAiResponse.text();
    console.error('Error from OpenAI:', errorResponse);
    res.status(openAiResponse.status).json({ message: 'Error communicating with OpenAI.', details: errorResponse });
  }
});



// Connect to MongoDB
mongoose.connect('mongodb://localhost/notflixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}...`));




// Routes
app.use('/api/users', userRoutes);
