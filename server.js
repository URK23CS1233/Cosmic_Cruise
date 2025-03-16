const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this to parse JSON bodies
app.use(express.static(__dirname));

mongoose.connect('mongodb://localhost:27017/CosmicCruise');

const db = mongoose.connection;

const bcrypt = require('bcrypt');

app.get("/", async(req,res) =>{
    res.sendFile(path.join(__dirname,"home.html"))
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    gender: String
});

const User = mongoose.model('User', userSchema); // Remove 'database' here

app.post('/signup', async function (req, res) {
    try {
        console.log(req.body.email);

        // Check if passwords match (assuming you have psw and psw-repeat fields)
        if (req.body.psw !== req.body['psw-repeat']) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.psw, // Storing password in plain text
            gender: req.body.gender
        });
        await user.save();
        res.json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(400).json({ message: 'Error signing up' });
    }
});



app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
