const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Replace with your API key from https://exchangeratesapi.io or other providers
const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

app.use(express.json());

// Endpoint to convert currency
app.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).json({ error: 'Please provide from, to, and amount query parameters' });
    }

    try {
        // Fetch exchange rate data
        const response = await axios.get(`${API_URL}${from}`);
        const rates = response.data.rates;

        if (!rates[to]) {
            return res.status(400).json({ error: `Currency "${to}" is not supported` });
        }

        const convertedAmount = (amount * rates[to]).toFixed(2);

        res.json({
            from,
            to,
            amount: parseFloat(amount),
            convertedAmount: parseFloat(convertedAmount),
            rate: rates[to],
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching exchange rates. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Currency Converter app is running on http://localhost:${PORT}`);
});

