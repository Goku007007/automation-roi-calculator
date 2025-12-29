// API endpoint (your FastAPI backend)
const API_URL = "http://localhost:8007";

// Get form and results elements
const form = document.getElementById("roi-form");
const resultsSection = document.getElementById("results-section");
const resultsContent = document.getElementById("results-content");

// Handle form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload

    // Collect form data
    const formData = {
        process_name: document.getElementById("process_name").value,
        frequency: document.getElementById("frequency").value,
        runs_per_period: parseInt(document.getElementById("runs_per_period").value),
        hours_per_run: parseFloat(document.getElementById("hours_per_run").value),
        staff_count: parseInt(document.getElementById("staff_count").value),
        hourly_rate: parseFloat(document.getElementById("hourly_rate").value),
        implementation_cost: parseFloat(document.getElementById("implementation_cost").value)
    };

    try {
        // Send data to backend
        const response = await fetch(`${API_URL}/calculate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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

// Display results on the page
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
        </div>
    `;
    resultsSection.classList.remove("hidden");
}