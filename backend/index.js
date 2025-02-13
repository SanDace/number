const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Define Schema
const numberSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true }
});

const NumberModel = mongoose.model('Number', numberSchema);

// POST Route to Save Number
app.post('/api/numbers', async (req, res) => {
    try {
        const newNumber = new NumberModel({ phoneNumber: req.body.phoneNumber });
        await newNumber.save();
        res.status(201).json({ message: 'Number saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
