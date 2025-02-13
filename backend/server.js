const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the application if connection fails
    }
};

connectDB();

// Define Schema
const numberSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true }
});

const NumberModel = mongoose.model('Number', numberSchema);

// POST Route to Save Number
app.post('/api/numbers', async (req, res) => {
    try {
        // Check MongoDB connection before operations
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connection not ready' });
        }
        
        const newNumber = new NumberModel({ phoneNumber: req.body.phoneNumber });
        await newNumber.save();
        res.status(201).json({ message: 'Number saved successfully!' });
    } catch (error) {
        console.error('Error saving number:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));