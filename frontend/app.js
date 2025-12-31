/**
 * app.js - Frontend JavaScript for Automation ROI Calculator
 * 
 * Handles form submission, API communication, results display, and charts.
 * Automatically detects if auth is required and handles tokens accordingly.
 */

// API endpoint - change this to your deployed backend URL
const API_URL = "http://localhost:8007";

// Store the access token (only used if auth is required)
let accessToken = null;
let authRequired = false;

// Chart instances (to destroy before recreating)
let savingsChart = null;
let comparisonChart = null;

/**
 * Format large numbers compactly (e.g., $1.2M instead of $1,200,000)
 */
function formatCompact(value) {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1e9) {
        return sign + '$' + (absValue / 1e9).toFixed(1) + 'B';
    } else if (absValue >= 1e6) {
        return sign + '$' + (absValue / 1e6).toFixed(1) + 'M';
    } else if (absValue >= 1e3) {
        return sign + '$' + (absValue / 1e3).toFixed(0) + 'K';
    }
    return sign + '$' + absValue.toLocaleString();
}

// Get form and results elements
const form = document.getElementById("roi-form");
const resultsSection = document.getElementById("results-section");
const resultsContent = document.getElementById("results-content");


/**
 * Check if authentication is required
 */
async function checkAuthRequired() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        authRequired = data.auth_required || false;
    } catch (error) {
        console.log("Could not check auth status, assuming not required");
        authRequired = false;
    }
}


/**
 * Get an access token from the API (if auth is required)
 */
async function getAccessToken() {
    if (!authRequired) return null;

    const response = await fetch(`${API_URL}/token`);
    if (!response.ok) {
        throw new Error("Failed to get access token");
    }
    const data = await response.json();
    return data.access_token;
}


/**
 * Collect form data into an object
 */
function getFormData() {
    return {
        process_name: document.getElementById("process_name").value,
        frequency: document.getElementById("frequency").value,
        runs_per_period: parseInt(document.getElementById("runs_per_period").value),
        hours_per_run: parseFloat(document.getElementById("hours_per_run").value),
        staff_count: parseInt(document.getElementById("staff_count").value),
        hourly_rate: parseFloat(document.getElementById("hourly_rate").value),
        implementation_cost: parseFloat(document.getElementById("implementation_cost").value)
    };
}


/**
 * Build request headers (with auth if required)
 */
function getHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (authRequired && accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return headers;
}


/**
 * Handle form submission
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        // Check if auth is required and get token if needed
        await checkAuthRequired();
        if (authRequired && !accessToken) {
            accessToken = await getAccessToken();
        }

        // Collect form data
        const formData = getFormData();

        // Send data to backend
        const response = await fetch(`${API_URL}/calculate`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("Calculation failed");
        }

        const result = await response.json();
        displayResults(result);

    } catch (error) {
        resultsContent.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        resultsSection.classList.remove("hidden");
    }
});


/**
 * Display results on the page with charts
 */
function displayResults(data) {
    resultsContent.innerHTML = `
        <div class="result-card">
            <h3>${data.process_name}</h3>
            
            <!-- Metrics Grid -->
            <div class="metrics">
                <div class="metric">
                    <span class="label">Annual Labor Cost</span>
                    <span class="value">$${data.annual_labor_cost.toLocaleString()}</span>
                </div>
                <div class="metric highlight-savings">
                    <span class="label">Annual Savings</span>
                    <span class="value">$${data.annual_savings.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span class="label">Payback Period</span>
                    <span class="value">${data.payback_months} months</span>
                </div>
                <div class="metric highlight-roi">
                    <span class="label">ROI</span>
                    <span class="value">${data.roi_percentage}%</span>
                </div>
                <div class="metric">
                    <span class="label">5-Year Savings</span>
                    <span class="value">$${data.five_year_savings.toLocaleString()}</span>
                </div>
                <div class="metric priority-${data.priority_score.toLowerCase()}">
                    <span class="label">Priority</span>
                    <span class="value">${data.priority_score}</span>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="charts-container">
                <div class="chart-wrapper">
                    <h4>Cost vs Savings</h4>
                    <canvas id="comparison-chart"></canvas>
                </div>
                <div class="chart-wrapper">
                    <h4>5-Year Projection</h4>
                    <canvas id="savings-chart"></canvas>
                </div>
            </div>
            
            <p class="recommendation">${data.recommendation}</p>
            <button onclick="downloadPDF()">Download PDF Report</button>
        </div>
    `;

    resultsSection.classList.remove("hidden");

    // Create charts after DOM is updated
    setTimeout(() => {
        createComparisonChart(data);
        createSavingsChart(data);
    }, 100);
}


/**
 * Create comparison bar chart (Cost vs Savings)
 */
function createComparisonChart(data) {
    const ctx = document.getElementById('comparison-chart');
    if (!ctx) return;

    // Destroy existing chart
    if (comparisonChart) {
        comparisonChart.destroy();
    }

    comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Cost', 'Savings', 'Year 1 Net'],
            datasets: [{
                label: 'Amount ($)',
                data: [
                    data.implementation_cost,
                    data.annual_savings,
                    data.annual_savings - data.implementation_cost
                ],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',   // Red for cost
                    'rgba(16, 185, 129, 0.7)',  // Green for savings
                    data.annual_savings > data.implementation_cost
                        ? 'rgba(59, 130, 246, 0.7)'   // Blue if positive
                        : 'rgba(245, 158, 11, 0.7)'   // Amber if negative
                ],
                borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(16, 185, 129)',
                    data.annual_savings > data.implementation_cost
                        ? 'rgb(59, 130, 246)'
                        : 'rgb(245, 158, 11)'
                ],
                borderWidth: 2,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return '$' + context.raw.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: { size: 11 }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return formatCompact(value);
                        },
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}


/**
 * Create 5-year savings projection line chart
 */
function createSavingsChart(data) {
    const ctx = document.getElementById('savings-chart');
    if (!ctx) return;

    // Destroy existing chart
    if (savingsChart) {
        savingsChart.destroy();
    }

    // Calculate cumulative savings over 5 years
    const years = ['Year 0', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    const cumulativeSavings = [0];
    const annualSavings = data.annual_savings;

    for (let i = 1; i <= 5; i++) {
        const cumulative = (annualSavings * i) - data.implementation_cost;
        cumulativeSavings.push(cumulative);
    }

    savingsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Cumulative Net Savings',
                data: cumulativeSavings,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            return (value >= 0 ? '+' : '') + '$' + value.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: { size: 11 }
                    }
                },
                y: {
                    ticks: {
                        callback: function (value) {
                            return formatCompact(value);
                        },
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}


/**
 * Download PDF report
 */
async function downloadPDF() {
    try {
        const formData = getFormData();

        const response = await fetch(`${API_URL}/generate-pdf`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error("PDF generation failed");
        }

        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${formData.process_name.replace(/ /g, "_")}_ROI_Report.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        alert("Error generating PDF: " + error.message);
    }
}


// Check auth status on page load
checkAuthRequired();