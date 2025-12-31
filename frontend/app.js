/**
 * app.js - Frontend JavaScript for Automation ROI Calculator
 * 
 * Handles form submission, API communication, and results display.
 * Automatically detects if auth is required and handles tokens accordingly.
 */

// API endpoint - change this to your deployed backend URL
const API_URL = "http://localhost:8007";

// Store the access token (only used if auth is required)
let accessToken = null;
let authRequired = false;

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
 * Display results on the page
 */
function displayResults(data) {
    resultsContent.innerHTML = `
        <div class="result-card">
            <h3>${data.process_name}</h3>
            <div class="metrics">
                <div class="metric">
                    <span class="label">Annual Labor Cost</span>
                    <span class="value">$${data.annual_labor_cost.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span class="label">Annual Savings</span>
                    <span class="value">$${data.annual_savings.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span class="label">Payback Period</span>
                    <span class="value">${data.payback_months} months</span>
                </div>
                <div class="metric">
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
            <p class="recommendation">${data.recommendation}</p>
            <button onclick="downloadPDF()">Download PDF</button>
        </div>
    `;
    resultsSection.classList.remove("hidden");
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