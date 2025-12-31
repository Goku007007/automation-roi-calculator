// Client-side ROI calculation (fallback when backend unavailable)
export function calculateROIClient(data) {
    const frequencyMultipliers = {
        every_minute: 525600,
        hourly: 8760,
        daily: 365,
        weekly: 52,
        biweekly: 26,
        monthly: 12,
        quarterly: 4,
    };

    const mult = frequencyMultipliers[data.frequency] || 365;
    const annualRuns = data.runs_per_period * mult;
    const annualHours = annualRuns * data.hours_per_run * data.staff_count;
    const annualLaborCost = annualHours * data.hourly_rate;

    const laborReduction = data.expected_labor_reduction / 100;
    const annualSavings = annualLaborCost * laborReduction;

    const totalInvestment =
        parseFloat(data.implementation_cost || 0) +
        parseFloat(data.software_license_cost || 0) +
        parseFloat(data.annual_maintenance_cost || 0);

    const netAnnualSavings = annualSavings - parseFloat(data.software_license_cost || 0) - parseFloat(data.annual_maintenance_cost || 0);
    const paybackMonths = totalInvestment > 0 ? (totalInvestment / netAnnualSavings) * 12 : 0;
    const roiPercentage = totalInvestment > 0 ? ((netAnnualSavings - totalInvestment) / totalInvestment) * 100 : 0;
    const fiveYearSavings = (netAnnualSavings * 5) - totalInvestment;

    // Priority score
    let priorityScore = 50;
    if (roiPercentage > 200) priorityScore += 25;
    else if (roiPercentage > 100) priorityScore += 15;
    if (paybackMonths < 6) priorityScore += 25;
    else if (paybackMonths < 12) priorityScore += 15;

    const priority = priorityScore >= 75 ? 'High' : priorityScore >= 50 ? 'Medium' : 'Low';

    return {
        annual_labor_cost: Math.round(annualLaborCost),
        projected_savings: Math.round(annualSavings),
        net_annual_savings: Math.round(netAnnualSavings),
        payback_period_months: Math.round(paybackMonths * 10) / 10,
        roi_percentage: Math.round(roiPercentage),
        five_year_savings: Math.round(fiveYearSavings),
        implementation_cost: totalInvestment,
        priority_score: priorityScore,
        priority,
        recommendation: priorityScore >= 75
            ? 'Strong automation candidate. Consider prioritizing this project.'
            : priorityScore >= 50
                ? 'Viable automation opportunity. Evaluate alongside other projects.'
                : 'Lower priority. May need further optimization or cost reduction.',
    };
}

// Backend URL - Railway in production, localhost in development
const API_URL = import.meta.env.PROD
    ? 'https://automation-roi-calculator-production.up.railway.app'
    : 'http://localhost:8007';

export async function calculateROI(data) {
    // Try backend first
    try {
        const response = await fetch(`${API_URL}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return response.json();
        }
    } catch (err) {
        console.log('Backend unavailable, using client-side calculation');
    }

    // Fallback to client-side
    return calculateROIClient(data);
}

export async function generatePDF(data) {
    const response = await fetch(`${API_URL}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('PDF generation failed');
    }

    return response.blob();
}

export async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
