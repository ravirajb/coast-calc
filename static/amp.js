class Calculator {
    constructor() {
        this.elements = {
            monthlyContribution: document.getElementById('monthlyContribution'),
            currentAge: document.getElementById('currentAge'),
            desiredAge: document.getElementById('desiredAge'),
            monthlyExpenses: document.getElementById('monthlyExpenses'),
            expectedReturn: document.getElementById('expectedReturn'),
            calculateButton: document.querySelector('.calculate-button'),
            resultsSection: document.querySelector('.results-section'),
            coastFireNumber: document.getElementById('coastFireNumber'),
            coastFireAge: document.getElementById('coastFireAge'),
            portfolioValue: document.getElementById('portfolioValue')
        };

        this.initEventListeners();
    }

    initEventListeners() {
        this.elements.calculateButton.addEventListener('click', () => this.calculate());
    }

    calculate() {
        const monthlyContribution = parseFloat(this.elements.monthlyContribution.value);
        const currentAge = parseInt(this.elements.currentAge.value);
        const desiredAge = parseInt(this.elements.desiredAge.value);
        const monthlyExpenses = parseFloat(this.elements.monthlyExpenses.value);
        const expectedReturn = parseFloat(this.elements.expectedReturn.value);

        if (isNaN(monthlyContribution) || isNaN(currentAge) || isNaN(desiredAge) || isNaN(monthlyExpenses)) {
            alert('Please fill in all fields with valid numbers');
            return;
        }

        // Calculate Coast FIRE number
        const coastFireNumber = monthlyExpenses * 12 * 25;
        const yearsToCoast = Math.ceil((coastFireNumber / monthlyContribution) / 12);
        const coastFireAge = currentAge + yearsToCoast;

        // Calculate portfolio growth
        const years = Math.max(desiredAge - currentAge, yearsToCoast);
        const monthlyReturn = Math.pow(1 + expectedReturn, 1/12) - 1;
        let portfolioValue = 0;
        const growthData = [];

        for (let month = 0; month < years * 12; month++) {
            portfolioValue = (portfolioValue + monthlyContribution) * (1 + monthlyReturn);
            if (month % 12 === 0) {
                growthData.push(portfolioValue);
            }
        }

        // Update results
        this.elements.resultsSection.removeAttribute('hidden');
        this.elements.coastFireNumber.textContent = this.formatCurrency(coastFireNumber);
        this.elements.coastFireAge.textContent = `${coastFireAge} years old`;
        this.elements.portfolioValue.textContent = this.formatCurrency(portfolioValue);

        // Update chart
        const chartConfig = document.querySelector('amp-chart');
        const chartData = {
            labels: Array.from({ length: years }, (_, i) => i + 1),
            datasets: [{
                label: 'Portfolio Growth',
                data: growthData,
                borderColor: '#1d4ed8',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(29, 78, 216, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };

        chartConfig.config = JSON.stringify({
            chart: {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => this.formatCurrency(value),
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Portfolio Growth Over Time',
                            font: {
                                size: 16,
                                weight: '600'
                            }
                        }
                    }
                }
            }
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}

// Initialize calculator when the page loads
window.addEventListener('load', () => {
    new Calculator();
});
