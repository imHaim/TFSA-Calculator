// Historical TFSA data with cumulative limits
const historicalData = [
    { year: 2009, limit: 5000, cumulative: 5000 },
    { year: 2010, limit: 5000, cumulative: 10000 },
    { year: 2011, limit: 5000, cumulative: 15000 },
    { year: 2012, limit: 5000, cumulative: 20000 },
    { year: 2013, limit: 5500, cumulative: 25500 },
    { year: 2014, limit: 5500, cumulative: 31000 },
    { year: 2015, limit: 10000, cumulative: 41000 },
    { year: 2016, limit: 5500, cumulative: 46500 },
    { year: 2017, limit: 5500, cumulative: 52000 },
    { year: 2018, limit: 5500, cumulative: 57500 },
    { year: 2019, limit: 6000, cumulative: 63500 },
    { year: 2020, limit: 6000, cumulative: 69500 },
    { year: 2021, limit: 6000, cumulative: 75500 },
    { year: 2022, limit: 6000, cumulative: 81500 },
    { year: 2023, limit: 6500, cumulative: 88000 },
    { year: 2024, limit: 7000, cumulative: 95000 },
    { year: 2025, limit: 7000, cumulative: 102000 }
];
// Populate the historical TFSA limits table
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById('historyTableBody');
    historicalData.forEach(data => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.year}</td>
            <td>$${data.limit.toLocaleString()}</td>
            <td>$${data.cumulative.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
});


// Elements
const birthdateInput = document.getElementById('birthdateInput');
const contributedInput = document.getElementById('contributedInput');
const contributedAmountDisplay = document.getElementById('contributedAmount');
const resultMessage = document.getElementById('resultMessage');
const projectionChartElement = document.getElementById('projectionChart');

let projectionChart;

// Update contributed amount display
contributedInput.addEventListener('input', () => {
    contributedAmountDisplay.textContent = parseInt(contributedInput.value).toLocaleString();
    calculateContributionLimit();
});

// Calculate contribution limit on birthdate change
birthdateInput.addEventListener('change', () => {
    calculateContributionLimit();
});

// Calculate Contribution Limit Function
function calculateContributionLimit() {
    const contributedAmount = parseInt(contributedInput.value) || 0;
    const birthdate = new Date(birthdateInput.value);
    const currentYear = new Date().getFullYear();

    if (isNaN(birthdate)) {
        resultMessage.textContent = 'Please select a valid birthdate.';
        resultMessage.classList.remove('text-success');
        resultMessage.classList.add('text-danger');
        return;
    }

    const age = currentYear - birthdate.getFullYear();
    if (age < 18) {
        resultMessage.textContent = 'You must be at least 18 years old to contribute to a TFSA.';
        resultMessage.classList.remove('text-success');
        resultMessage.classList.add('text-danger');
        return;
    }

    const yearTurned18 = birthdate.getFullYear() + 18;
    let totalContributionLimit = 0;

    const eligibleYears = historicalData.filter(data => data.year >= yearTurned18 && data.year <= currentYear);
    eligibleYears.forEach(data => {
        totalContributionLimit += data.limit;
    });

    const remainingContributionRoom = totalContributionLimit - contributedAmount;

    // Display result
    resultMessage.textContent = `Your total TFSA contribution limit is $${totalContributionLimit.toLocaleString()}. After subtracting your contributions, you have $${remainingContributionRoom.toLocaleString()} left to contribute.`;
    resultMessage.classList.remove('text-danger');
    resultMessage.classList.add('text-success');

    // Update Projection Chart
    updateProjectionChart(eligibleYears, contributedAmount);
}

// Initialize Projection Chart
function updateProjectionChart(eligibleYears, contributedAmount) {
    const labels = eligibleYears.map(data => data.year);
    const limits = eligibleYears.map(data => data.cumulative);

    if (projectionChart) {
        projectionChart.destroy();
    }

    projectionChart = new Chart(projectionChartElement, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumulative Contribution Limit',
                data: limits,
                borderColor: '#007bff',
                fill: false,
                tension: 0.1
            }, {
                label: 'Your Contributions',
                data: limits.map(() => contributedAmount),
                borderColor: '#28a745',
                borderDash: [5, 5],
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
