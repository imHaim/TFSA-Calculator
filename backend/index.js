const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// TFSA calculation logic
const tfsaLimits = [
    { year: 2009, limit: 5000 },
    { year: 2010, limit: 5000 },
    { year: 2011, limit: 5000 },
    { year: 2012, limit: 5000 },
    { year: 2013, limit: 5500 },
    { year: 2014, limit: 5500 },
    { year: 2015, limit: 10000 },
    { year: 2016, limit: 5500 },
    { year: 2017, limit: 5500 },
    { year: 2018, limit: 5500 },
    { year: 2019, limit: 6000 },
    { year: 2020, limit: 6000 },
    { year: 2021, limit: 6000 },
    { year: 2022, limit: 6000 },
    { year: 2023, limit: 6500 },
    { year: 2024, limit: 7000 },
    { year: 2025, limit: 7000 }
];

function calculateTFSALimit(age) {
    const currentYear = new Date().getFullYear();
    const yearTurned18 = currentYear - age + 18;
    let totalContributionLimit = 0;

    for (let i = 2009; i <= currentYear; i++) {
        if (i >= yearTurned18) {
            totalContributionLimit += tfsaLimits.find(y => y.year === i).limit;
        }
    }

    return totalContributionLimit;
}

// Define API endpoint
app.post('/api/calculate-tfsa', (req, res) => {
    const { age } = req.body;

    if (!age || isNaN(age) || age < 18) {
        return res.status(400).json({ message: 'Invalid age. Please provide a valid age (18 or above).' });
    }

    const contributionLimit = calculateTFSALimit(age);
    res.json({ age, contributionLimit });
});

// Start the server
app.listen(port, () => {
    console.log(`TFSA Calculator API running on http://localhost:${port}`);
});
