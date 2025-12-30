/**
 * app.js - Frontend JavaScript for Automation ROI Calculator
 * 
 * Handles form submission, API communication, and results display.
 * Uses JWT authentication for API access.
 */

// API endpoint
const API_URL = "http://localhost:8007";

// Store the access token
let accessToken = null;

// Get form and results elements
const form = document.getElementById("roi-form");
const resultsSection = document.getElementById("results-section");
const resultsContent = document.getElementById("results-content");


/**
 * Get an access token from the API
 */
async function getAccessToken() {
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
 * Handle form submission
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        // Get token if we don't have one
        if (!accessToken) {
            accessToken = await getAccessToken();
        }

        // Collect form data
        const formData = getFormData();

        // Send data to backend with auth token
        const response = await fetch(`${API_URL}/calculate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(formData)
        });

        // If unauthorized, try getting a new token
        if (response.status === 401) {
            accessToken = await getAccessToken();
            // Retry the request
            const retryResponse = await fetch(`${API_URL}/calculate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(formData)
            });
            if (!retryResponse.ok) {
                throw new Error("Calculation failed");
            }
            const result = await retryResponse.json();
            displayResults(result);
            return;
        }

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
        // Get token if we don't have one
        if (!accessToken) {
            accessToken = await getAccessToken();
        }

        const formData = getFormData();

        const response = await fetch(`${API_URL}/generate-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
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