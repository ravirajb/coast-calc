// GA4 configuration
const ga4Config = {
    measurementId: 'G-XXXXXXXXXX', // Replace with your GA4 measurement ID
    gtagId: 'GTM-XXXXXXXXXX', // Replace with your GTM container ID if using GTM
    
    // Event tracking configuration
    events: {
        page_view: {
            send_to: [ga4Config.measurementId],
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        },
        
        form_interaction: {
            send_to: [ga4Config.measurementId],
            event_category: 'Form',
            event_label: 'Calculator Interaction'
        },
        
        error_event: {
            send_to: [ga4Config.measurementId],
            event_category: 'Error',
            event_label: 'JavaScript Error'
        }
    }
};

// Initialize GA4
function initializeGA4() {
    // Create gtag script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Config.measurementId}`;
    document.head.appendChild(gtagScript);

    // Create gtag configuration
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ga4Config.measurementId, {
        'page_path': window.location.pathname
    });

    // Track initial page view
    trackPageView();

    // Set up event listeners
    setupEventListeners();
}

// Track page view
function trackPageView() {
    gtag('event', 'page_view', ga4Config.events.page_view);
}

// Track form interactions
function trackFormInteraction(eventName, additionalParams = {}) {
    const eventData = {
        ...ga4Config.events.form_interaction,
        event_name: eventName,
        ...additionalParams
    };
    gtag('event', eventName, eventData);
}

// Track errors
function trackError(error) {
    const eventData = {
        ...ga4Config.events.error_event,
        event_name: 'error',
        error_message: error.message,
        error_stack: error.stack
    };
    gtag('event', 'error', eventData);
}

// Setup event listeners
function setupEventListeners() {
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            trackFormInteraction('form_submit', {
                form_id: form.id
            });
        });
    });

    // Track button clicks
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            trackFormInteraction('button_click', {
                button_id: button.id,
                button_text: button.textContent
            });
        });
    });

    // Track errors
    window.addEventListener('error', (event) => {
        trackError(event.error);
    });

    // Track promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        trackError(new Error(event.reason));
    });
}

// Export functions for use in other scripts
export { initializeGA4, trackFormInteraction, trackError };
