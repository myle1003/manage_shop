const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');

const app = express();

const db = require('./config/key').MongoURI;


//------------ Mongo Connection ------------//
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));

//------------ EJS Configuration ------------//
app.use(cors());
app.use(express.json());

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }))

//------------ Routes ------------//
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3006;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));