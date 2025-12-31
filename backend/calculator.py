"""
calculator.py - ROI Calculation Engine

Production-grade calculation module for automation ROI analysis.
All savings projections are based on user-provided expectations.
"""

from models import ROIInput, ROIOutput, Frequency


# =============================================================================
# CONFIGURATION
# =============================================================================

class CalculatorConfig:
    """
    Configuration for recommendation thresholds.
    Savings rates are provided by the user, not assumed by the system.
    """
    
    # Payback period thresholds for recommendations (in months)
    HIGH_PRIORITY_THRESHOLD = 12
    MEDIUM_PRIORITY_THRESHOLD = 24
    
    # Minimum ROI for high priority recommendation
    HIGH_PRIORITY_ROI = 50
    
    # Tool savings estimate (users rarely know this precisely)
    DEFAULT_TOOL_SAVINGS_RATE = 0.30  # 30% conservative default


def calculate_periods_per_year(frequency: Frequency, working_days: int, hours_per_day: int) -> int:
    """
    Calculate how many times a process runs per year based on frequency and work schedule.
    
    Args:
        frequency: How often the process runs
        working_days: Number of working days per year (250-365)
        hours_per_day: Operating hours per day (8-24)
    
    Returns:
        Number of periods per year
    """
    yearly_hours = working_days * hours_per_day
    
    period_mapping = {
        Frequency.EVERY_MINUTE: yearly_hours * 60,
        Frequency.HOURLY: yearly_hours,
        Frequency.DAILY: working_days,
        Frequency.WEEKLY: 52,
        Frequency.BIWEEKLY: 26,
        Frequency.MONTHLY: 12,
        Frequency.QUARTERLY: 4,
    }
    
    return period_mapping.get(frequency, working_days)


# =============================================================================
# MAIN CALCULATION
# =============================================================================

def calculate_roi(inputs: ROIInput) -> ROIOutput:
    """
    Calculate automation ROI based on provided inputs.
    
    This function performs a comprehensive cost benefit analysis comparing
    current manual process costs against projected automation savings.
    
    Args:
        inputs: Validated user inputs containing process details and costs
    
    Returns:
        ROIOutput containing all calculated metrics and recommendations
    """
    config = CalculatorConfig()
    
    # Calculate annual run frequency
    periods_per_year = calculate_periods_per_year(
        inputs.frequency,
        inputs.working_days_per_year,
        inputs.hours_per_day
    )
    runs_per_year = inputs.runs_per_period * periods_per_year
    
    # Current cost calculations
    annual_labor_cost = _calculate_labor_cost(inputs, runs_per_year)
    annual_error_cost = _calculate_error_cost(inputs, runs_per_year)
    annual_sla_cost = _calculate_sla_cost(inputs)
    annual_tool_cost = inputs.current_tool_cost
    
    total_current_cost = (
        annual_labor_cost +
        annual_error_cost +
        annual_sla_cost +
        annual_tool_cost
    )
    
    # Projected savings calculations
    annual_savings = _calculate_savings(
        annual_labor_cost,
        annual_error_cost,
        annual_sla_cost,
        annual_tool_cost,
        inputs,
        config
    )
    
    savings_percent = (annual_savings / total_current_cost * 100) if total_current_cost > 0 else 0
    
    # True Cost of Ownership calculations
    annual_automation_cost = inputs.software_license_cost + inputs.annual_maintenance_cost
    net_annual_savings = annual_savings - annual_automation_cost
    total_cost_of_ownership = inputs.implementation_cost + (annual_automation_cost * 5)
    
    # ROI metrics (using net savings for accurate calculations)
    payback_months = _calculate_payback(inputs.implementation_cost, net_annual_savings)
    roi_percentage = _calculate_roi_percentage(net_annual_savings, inputs.implementation_cost)
    five_year_savings = _calculate_five_year_value(
        net_annual_savings,  # Use net savings 
        inputs.implementation_cost,
        inputs.volume_growth
    )
    
    # Recommendations
    priority_score, recommendation = _generate_recommendation(
        payback_months,
        roi_percentage,
        net_annual_savings,  # Use net savings
        config
    )
    
    confidence_level = _assess_confidence(inputs)
    assumptions = _build_assumptions_list(inputs, config)
    
    return ROIOutput(
        process_name=inputs.process_name,
        annual_labor_cost=round(annual_labor_cost, 2),
        annual_error_cost=round(annual_error_cost, 2),
        annual_sla_cost=round(annual_sla_cost, 2),
        annual_tool_cost=round(annual_tool_cost, 2),
        total_current_cost=round(total_current_cost, 2),
        automation_savings_percent=round(savings_percent, 1),
        annual_savings=round(annual_savings, 2),
        implementation_cost=round(inputs.implementation_cost, 2),
        annual_automation_cost=round(annual_automation_cost, 2),
        net_annual_savings=round(net_annual_savings, 2),
        total_cost_of_ownership=round(total_cost_of_ownership, 2),
        payback_months=round(payback_months, 1),
        roi_percentage=round(roi_percentage, 1),
        five_year_savings=round(five_year_savings, 2),
        priority_score=priority_score,
        recommendation=recommendation,
        confidence_level=confidence_level,
        assumptions=assumptions,
    )


# =============================================================================
# PRIVATE CALCULATION FUNCTIONS
# =============================================================================

def _calculate_labor_cost(inputs: ROIInput, runs_per_year: int) -> float:
    """Calculate annual labor cost for manual process execution."""
    annual_hours = inputs.hours_per_run * runs_per_year * inputs.staff_count
    return annual_hours * inputs.hourly_rate


def _calculate_error_cost(inputs: ROIInput, runs_per_year: int) -> float:
    """Calculate annual cost of errors in the current process."""
    if inputs.error_rate == 0:
        return 0.0
    
    errors_per_year = runs_per_year * (inputs.error_rate / 100)
    cost_per_error = inputs.error_fix_cost + (inputs.error_fix_hours * inputs.hourly_rate)
    return errors_per_year * cost_per_error


def _calculate_sla_cost(inputs: ROIInput) -> float:
    """Calculate annual cost of SLA breaches."""
    if not inputs.has_sla:
        return 0.0
    return inputs.sla_breaches_year * inputs.sla_penalty


def _calculate_savings(
    labor_cost: float,
    error_cost: float,
    sla_cost: float,
    tool_cost: float,
    inputs: ROIInput,
    config: CalculatorConfig
) -> float:
    """
    Calculate total projected annual savings from automation.
    Uses user-provided expectations, not hardcoded assumptions.
    """
    labor_savings = labor_cost * (inputs.expected_labor_reduction / 100)
    error_savings = error_cost * (inputs.expected_error_reduction / 100)
    sla_savings = sla_cost * (inputs.expected_sla_improvement / 100)
    tool_savings = tool_cost * config.DEFAULT_TOOL_SAVINGS_RATE
    
    return labor_savings + error_savings + sla_savings + tool_savings


def _calculate_payback(implementation_cost: float, annual_savings: float) -> float:
    """Calculate payback period in months."""
    if annual_savings <= 0:
        return 999.0  # Represents no viable payback
    return (implementation_cost / annual_savings) * 12


def _calculate_roi_percentage(annual_savings: float, implementation_cost: float) -> float:
    """Calculate first-year ROI as a percentage."""
    if implementation_cost <= 0:
        return 0.0
    return ((annual_savings - implementation_cost) / implementation_cost) * 100


def _calculate_five_year_value(
    annual_savings: float,
    implementation_cost: float,
    volume_growth: float
) -> float:
    """Calculate cumulative 5-year net savings with volume growth."""
    growth_rate = volume_growth / 100
    cumulative = 0.0
    current_savings = annual_savings
    
    for _ in range(5):
        cumulative += current_savings
        current_savings *= (1 + growth_rate)
    
    return cumulative - implementation_cost


def _generate_recommendation(
    payback_months: float,
    roi_percentage: float,
    annual_savings: float,
    config: CalculatorConfig
) -> tuple:
    """Generate priority score and actionable recommendation."""
    
    if payback_months <= config.HIGH_PRIORITY_THRESHOLD and roi_percentage > config.HIGH_PRIORITY_ROI:
        return (
            "High",
            f"Strong automation candidate with {payback_months:.0f}-month payback and "
            f"${annual_savings:,.0f} projected annual savings. Recommend initiating "
            "automation assessment and vendor evaluation."
        )
    
    if payback_months <= config.MEDIUM_PRIORITY_THRESHOLD and roi_percentage > 0:
        return (
            "Medium",
            f"Viable automation opportunity with {payback_months:.0f}-month payback. "
            f"Consider prioritizing based on strategic value and resource availability."
        )
    
    return (
        "Low",
        f"Current ROI metrics suggest limited financial benefit. Consider revisiting "
        "if process volume increases or if non-financial factors (quality, compliance, "
        "employee experience) justify investment."
    )


def _assess_confidence(inputs: ROIInput) -> str:
    """Assess confidence level based on data completeness."""
    data_points = sum([
        inputs.error_rate > 0,
        inputs.error_fix_cost > 0,
        inputs.has_sla and inputs.sla_penalty > 0,
        inputs.current_tool_cost > 0,
        inputs.volume_growth > 0,
    ])
    
    if data_points >= 4:
        return "High"
    if data_points >= 2:
        return "Medium"
    return "Low"


def _build_assumptions_list(inputs: ROIInput, config: CalculatorConfig) -> list:
    """Build list of user-provided values used in calculations."""
    return [
        f"Labor reduction: {inputs.expected_labor_reduction}% (user provided)",
        f"Error reduction: {inputs.expected_error_reduction}% (user provided)",
        f"SLA improvement: {inputs.expected_sla_improvement}% (user provided)",
        f"Tool cost reduction: {config.DEFAULT_TOOL_SAVINGS_RATE * 100:.0f}% (estimated)",
        f"Working days/year: {inputs.working_days_per_year}",
        f"Hours/day: {inputs.hours_per_day}",
        f"Volume growth: {inputs.volume_growth}% annually",
    ]


# =============================================================================
# DOCUMENTATION
# =============================================================================
"""
CALCULATOR MODULE OVERVIEW
==========================

This module is the core calculation engine for the Automation ROI Calculator.
It takes validated user inputs and produces financial projections.


FUNCTIONS:
----------

calculate_periods_per_year(frequency, working_days, hours_per_day)
    Converts frequency selection into annual run count.
    Accounts for user's specific work schedule (24/7 vs business hours).

calculate_roi(inputs: ROIInput) -> ROIOutput
    Main entry point. Orchestrates all calculations and returns results.

_calculate_labor_cost(inputs, runs_per_year)
    Formula: hours_per_run * runs_per_year * staff_count * hourly_rate

_calculate_error_cost(inputs, runs_per_year)
    Formula: (runs_per_year * error_rate/100) * (error_fix_cost + error_fix_hours * hourly_rate)

_calculate_sla_cost(inputs)
    Formula: sla_breaches_year * sla_penalty

_calculate_savings(labor_cost, error_cost, sla_cost, tool_cost, inputs, config)
    Uses user-provided reduction percentages to project savings.
    Formula: 
        labor_savings = labor_cost * (expected_labor_reduction / 100)
        error_savings = error_cost * (expected_error_reduction / 100)
        sla_savings = sla_cost * (expected_sla_improvement / 100)
        tool_savings = tool_cost * DEFAULT_TOOL_SAVINGS_RATE

_calculate_payback(implementation_cost, annual_savings)
    Formula: (implementation_cost / annual_savings) * 12 months

_calculate_roi_percentage(annual_savings, implementation_cost)
    Formula: ((annual_savings - implementation_cost) / implementation_cost) * 100

_calculate_five_year_value(annual_savings, implementation_cost, volume_growth)
    Compounds annual savings with growth rate over 5 years, minus implementation cost.

_generate_recommendation(payback_months, roi_percentage, annual_savings, config)
    Returns priority score (High/Medium/Low) and actionable recommendation text.

_assess_confidence(inputs)
    Rates confidence based on how much optional data the user provided.

_build_assumptions_list(inputs, config)
    Generates a list of all user inputs used in calculations for transparency.


KEY FORMULAS:
-------------

Annual Labor Cost:
    hours_per_run * runs_per_year * staff_count * hourly_rate

Annual Error Cost:
    (runs_per_year * error_rate%) * (fix_cost + fix_hours * hourly_rate)

Annual SLA Cost:
    sla_breaches_year * sla_penalty

Total Current Cost:
    labor_cost + error_cost + sla_cost + tool_cost

Annual Savings:
    (labor * labor_reduction%) + (error * error_reduction%) + 
    (sla * sla_reduction%) + (tools * 30%)

Payback Period (months):
    (implementation_cost / annual_savings) * 12

ROI Percentage:
    ((annual_savings - implementation_cost) / implementation_cost) * 100

5-Year Savings:
    Sum of (annual_savings * (1 + growth_rate)^year) for years 0-4, minus implementation_cost
"""