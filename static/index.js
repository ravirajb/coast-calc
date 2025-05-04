if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('ServiceWorker registration successful');
        })
        .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    // Initialize Chart.js
    Chart.register();

    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('results');
    const coastFireNumber = document.getElementById('coastFireNumber');
    const coastFireAge = document.getElementById('coastFireAge');
    const portfolioValues = document.getElementById('portfolioValues');
    const growthChart = document.getElementById('growthChart');
    // Ensure Chart.js is loaded before initializing
    if (typeof Chart === 'undefined') {
        window.Chart = window.Chart || {};
    }

    // Initialize Chart.js after DOM is loaded
    const initializeChart = () => {
        if (typeof Chart !== 'undefined') {
            // Your existing chart initialization code here
        }
    };

    // Check if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        initializeChart();
    } else {
        // Wait for Chart.js to load
        const checkChartLoaded = setInterval(() => {
            if (typeof Chart !== 'undefined') {
                clearInterval(checkChartLoaded);
                initializeChart();
            }
        }, 100);
    }

    const currencySelect = document.getElementById('currency');
    window.Chart = window.Chart || {}; // Ensure Chart is available globally

    // Initialize Chart.js
    if (typeof Chart === 'undefined') {
        Chart = window.Chart;
    }
    Chart = window.Chart;
});

    // Update currency display (placeholder function)
    function updateCurrencyDisplay() {
        // Placeholder function - currency formatting removed
    }

    // Enhanced currency configuration
    const currencyConfig = {
        USD: {
            symbol: '$',
            symbolNative: '$',
            decimalDigits: 2,
            rounding: 0
        },
        EUR: {
            symbol: '€',
            symbolNative: '€',
            decimalDigits: 2,
            rounding: 0
        },
        GBP: {
            symbol: '£',
            symbolNative: '£',
            decimalDigits: 2,
            rounding: 0
        },
        CHF: {
            symbol: 'CHF',
            symbolNative: 'CHF',
            decimalDigits: 2,
            rounding: 0
        },
        JPY: {
            symbol: '¥',
            symbolNative: '¥',
            decimalDigits: 0,
            rounding: 0
        },
        KRW: {
            symbol: '₩',
            symbolNative: '₩',
            decimalDigits: 0,
            rounding: 0
        },
        AUD: {
            symbol: 'A$',
            symbolNative: 'A$',
            decimalDigits: 2,
            rounding: 0
        },
        ITL: {
            symbol: 'L',
            symbolNative: 'L',
            decimalDigits: 0,
            rounding: 0
        },
        DEM: {
            symbol: 'DM',
            symbolNative: 'DM',
            decimalDigits: 2,
            rounding: 0
        }
    };

    // Format currency with appropriate symbol and decimal places
    function formatCurrency(amount, config) {
        const currency = config.currency || 'USD';
        const currencyInfo = currencyConfig[currency];
        if (!currencyInfo) return amount.toString();
        
        const formatted = amount.toFixed(currencyInfo.decimalDigits);
        return `${currencyInfo.symbol}${formatted}`;
    }

    // Tooltip management
    let tooltipTimeout;
    const TOOLTIP_DURATION = 5000; // 5 seconds

    function showTooltip(tooltip) {
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
        
        // Clear any existing timeout
        if (tooltipTimeout) {
            clearTimeout(tooltipTimeout);
        }

        // Set new timeout to hide tooltip
        tooltipTimeout = setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }, TOOLTIP_DURATION);
    }

    function hideTooltip(tooltip) {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    }

    // Initialize tooltips
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', () => showTooltip(tooltip));
        tooltip.addEventListener('mouseleave', () => hideTooltip(tooltip));
    });

    // Enable deletion in all input fields
    const inputFields = document.querySelectorAll('input[type="number"]');
    inputFields.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.preventDefault();
                input.value = '';
            }
        });
    });

    // Add event listeners to all input groups
    document.querySelectorAll('.input-group').forEach(group => {
        group.addEventListener('mouseenter', (e) => {
            const tooltip = group.querySelector('.tooltip-text');
            if (tooltip) {
                showTooltip(tooltip);
            }
        });

        group.addEventListener('mouseleave', (e) => {
            const tooltip = group.querySelector('.tooltip-text');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        });
    });

    calculateBtn.addEventListener('click', calculateCoastFIRE);
    currencySelect.addEventListener('change', updateCurrencyDisplay);

    // Initialize FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle active class on question
            question.classList.toggle('active');
            
            // Toggle active class on answer
            answer.classList.toggle('active');
        });
    });

    function calculateCoastFIRE() {
        // Get input values
        const currentAge = parseInt(document.getElementById('currentAge').value);
        const retirementAge = parseInt(document.getElementById('retirementAge').value);
        const currentSavings = parseFloat(document.getElementById('currentSavings').value);
        const preRetirementReturn = parseFloat(document.getElementById('preRetirementReturn').value) / 100;
        const postRetirementReturn = parseFloat(document.getElementById('postRetirementReturn').value) / 100;
        const annualSpending = parseFloat(document.getElementById('annualSpending').value);
        const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;

        // Validate age inputs
        if (!currentAge || currentAge < 1 || currentAge > 100 || !retirementAge || retirementAge < 1 || retirementAge > 100) {
            alert('Please select valid ages between 1 and 100');
            return;
        }

        // Validate that current age is less than retirement age
        if (currentAge >= retirementAge) {
            alert('Current Age must be less than Planned Retirement Age');
            return;
        }

        const selectedCurrency = currencySelect.value;
        const config = currencyConfig[selectedCurrency];

        // Get selected withdrawal rate
        const selectedRate = document.querySelector('input[name="withdrawalRate"]:checked');
        const withdrawalRate = selectedRate ? parseFloat(selectedRate.value) : 4; // Default to 4% if none selected

        // Calculate Coast FIRE number
        const coastFireNumberValue = calculateCoastFireNumber(annualSpending, withdrawalRate);
        coastFireNumber.textContent = formatCurrency(coastFireNumberValue, config);
        coastFireNumber.setAttribute('data-currency', 'true');

        // Calculate age when Coast FIRE is reached
        const coastFireAgeValue = calculateCoastFireAge(currentSavings, coastFireNumberValue, preRetirementReturn);
        const roundedAge = Math.min(Math.round(coastFireAgeValue), 100);
        coastFireAge.textContent = `${roundedAge} years old`;

        // Calculate portfolio values at retirement
        portfolioValues.innerHTML = '';
        const portfolioValue = calculatePortfolioValue(currentSavings, preRetirementReturn, retirementAge - currentAge);
        const rateDisplay = (withdrawalRate * 100).toFixed(1);
        portfolioValues.innerHTML += `
            <div class="portfolio-value">
                <h4>${rateDisplay}% Withdrawal Rate</h4>
                <p>${portfolioValue.toFixed(2)}</p>
            </div>
        `;

        // Update chart
        updateGrowthChart(currentSavings, coastFireNumberValue, preRetirementReturn, retirementAge - currentAge, config);
    }

    // Use the highest withdrawal rate for most conservative estimate
    function calculateCoastFireNumber(annualSpending, withdrawalRate) {
        return annualSpending / withdrawalRate;
    }

    // Calculate portfolio value using compound interest
    function calculatePortfolioValue(initialAmount, rate, years) {
        return initialAmount * Math.pow(1 + rate, years);
    }

    function calculateCoastFireAge(currentSavings, targetAmount, rate) {
        const yearsToReach = Math.log(targetAmount / currentSavings) / Math.log(1 + rate);
        const currentAge = parseFloat(document.getElementById('currentAge').value);
        return Math.round(yearsToReach) + currentAge;
    }

    function calculatePortfolioValue(initialAmount, rate, years) {
        return initialAmount * Math.pow(1 + rate, years);
    }

    // Monte Carlo simulation
    function runMonteCarloSimulation(initialAmount, targetAmount, years, withdrawalRate, simulations, confidence) {
        const results = [];
        const stockMean = historicalReturns.stocks.reduce((sum, value) => sum + value, 0) / historicalReturns.stocks.length;
        const stockStdDev = calculateStandardDeviation(historicalReturns.stocks);
        const bondMean = historicalReturns.bonds.reduce((sum, value) => sum + value, 0) / historicalReturns.bonds.length;
        const bondStdDev = calculateStandardDeviation(historicalReturns.bonds);

        // Run simulations
        for (let i = 0; i < simulations; i++) {
            let currentAmount = initialAmount;
            let success = true;

            for (let year = 0; year < years; year++) {
                // Generate random returns (60% stocks, 40% bonds)
                const stockReturn = generateRandomReturn(stockMean, stockStdDev);
                const bondReturn = generateRandomReturn(bondMean, bondStdDev);
                const portfolioReturn = (0.6 * stockReturn) + (0.4 * bondReturn);

                // Calculate new portfolio value
                currentAmount *= (1 + portfolioReturn);

                // Check if we've reached the target
                if (currentAmount >= targetAmount) {
                    success = true;
                    break;
                }
            }

            results.push(success ? currentAmount : 0);
        }

        // Sort results and calculate confidence interval
        results.sort((a, b) => a - b);
        const lowerBound = Math.floor(simulations * (1 - confidence / 100));
        const successRate = results.filter(result => result > 0).length / simulations * 100;

        return {
            successRate: successRate.toFixed(1),
            lowerBound: results[lowerBound].toFixed(2),
            results
        };
    }

    function updateGrowthChart(initialAmount, targetAmount, rate, years, config) {
        const ctx = growthChart.getContext('2d');
        const data = [];
        
        // Calculate growth for each year
        for (let i = 0; i <= years; i++) {
            data.push(initialAmount * Math.pow(1 + rate, i));
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: years + 1}, (_, i) => `Year ${i}`),
                datasets: [{
                    label: 'Portfolio Growth',
                    data: data,
                    borderColor: '#1d4ed8',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(29, 78, 216, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value, config);
                            },
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return formatCurrency(context.parsed.y, config);
                            }
                        }
                    }
                }
            }
        });
}

// Initialize the chart when the page loads
initializeChart();

// Initialize the chart when the configuration changes
function updateGrowthChart(data, config) {
    if (growthChart) {
        growthChart.data.labels = Array.from({ length: config.years }, (_, i) => i + 1);
        growthChart.data.datasets[0].data = data;
        growthChart.update();
    }
}
