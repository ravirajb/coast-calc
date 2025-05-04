import { trackFormInteraction, trackError } from './ga4-config.js';

// Track calculator specific events
function trackCalculatorEvents() {
    // Track input changes
    const inputs = document.querySelectorAll('input[type="number"], select');
    inputs.forEach(input => {
        input.addEventListener('change', (event) => {
            trackFormInteraction('input_change', {
                input_id: event.target.id,
                input_value: event.target.value
            });
        });
    });

    // Track calculation attempts
    const calculateButton = document.querySelector('.calculate-button');
    if (calculateButton) {
        calculateButton.addEventListener('click', (event) => {
            trackFormInteraction('calculate_attempt', {
                button_id: calculateButton.id
            });
        });
    }

    // Track successful calculations
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.addEventListener('change', (event) => {
            trackFormInteraction('calculation_success', {
                result_shown: true
            });
        });
    }

    // Track chart interactions
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.addEventListener('click', (event) => {
            trackFormInteraction('chart_interaction', {
                chart_id: chartContainer.id
            });
        });
    }
}

// Track user engagement
function trackUserEngagement() {
    // Track scroll depth
    let scrollThresholds = [0.25, 0.5, 0.75, 1.0];
    let trackedThresholds = [];

    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
        
        scrollThresholds.forEach(threshold => {
            if (scrollPercentage >= threshold && !trackedThresholds.includes(threshold)) {
                trackFormInteraction('scroll_depth', {
                    percentage: threshold * 100
                });
                trackedThresholds.push(threshold);
            }
        });
    });

    // Track session duration
    let sessionStart = Date.now();
    let lastActivity = sessionStart;

    function updateActivity() {
        lastActivity = Date.now();
    }

    // Track user activity
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keypress', updateActivity);
    document.addEventListener('click', updateActivity);

    // Check session duration
    setInterval(() => {
        const sessionDuration = (Date.now() - sessionStart) / 1000;
        const idleTime = (Date.now() - lastActivity) / 1000;

        if (idleTime > 300) { // 5 minutes of inactivity
            trackFormInteraction('session_end', {
                duration: sessionDuration,
                idle_time: idleTime
            });
        }
    }, 60000); // Check every minute
}

// Initialize tracking
function initializeTracking() {
    try {
        trackCalculatorEvents();
        trackUserEngagement();
    } catch (error) {
        trackError(error);
    }
}

// Export initialization function
export { initializeTracking };
