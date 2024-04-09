const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const baseRoutes = require('./routes/base.routes');
dotenv.config();
 

const PORT = process.env.PORT || 9990;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/base', baseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
