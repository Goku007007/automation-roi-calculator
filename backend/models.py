"""
models.py - Data structures for input validation and output formatting
Pydantic models ensure users provide valid data before we calculate anything.
"""

from pydantic import BaseModel, Field
from enum import Enum


# =============================================================================
# ENUMS
# =============================================================================

class Frequency(str, Enum):
    """How often the process runs"""
    EVERY_MINUTE = "every_minute"
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"


# =============================================================================
# INPUT MODEL
# =============================================================================

class ROIInput(BaseModel):
    """All the inputs we need from the user to calculate ROI."""
    
    # Process details
    process_name: str = Field(..., description="Name of the process being analyzed")
    frequency: Frequency = Field(..., description="How often the process runs")
    runs_per_period: int = Field(..., ge=1, le=1000, description="Times executed per period")
    hours_per_run: float = Field(..., ge=0.1, le=40, description="Hours per execution")
    
    # Work schedule
    working_days_per_year: int = Field(default=250, ge=1, le=365, description="Working days per year (250 for Mon-Fri, 365 for 24/7)")
    hours_per_day: int = Field(default=8, ge=1, le=24, description="Operating hours per day (8 for standard, 24 for round-the-clock)")
    
    # Staff costs
    staff_count: int = Field(..., ge=1, le=100, description="Number of staff involved")
    hourly_rate: float = Field(..., ge=15, le=500, description="Average hourly cost per person")
    
    # Error handling (enter 0 if none)
    error_rate: float = Field(default=0, ge=0, le=50, description="Percentage of runs with errors. Enter 0 if none.")
    error_fix_cost: float = Field(default=0, ge=0, le=10000, description="Cost to fix each error. Enter 0 if none.")
    error_fix_hours: float = Field(default=0, ge=0, le=40, description="Hours to fix each error. Enter 0 if none.")
    
    # Compliance/SLA (enter 0 if none)
    has_sla: bool = Field(default=False, description="Are there SLA requirements?")
    sla_penalty: float = Field(default=0, ge=0, le=100000, description="Penalty per SLA breach. Enter 0 if none.")
    sla_breaches_year: int = Field(default=0, ge=0, le=100, description="Expected breaches per year. Enter 0 if none.")
    
    # Costs
    current_tool_cost: float = Field(default=0, ge=0, le=50000, description="Current annual tool costs. Enter 0 if none.")
    implementation_cost: float = Field(..., ge=1000, le=500000, description="One-time automation cost")
    
    # Growth
    volume_growth: float = Field(default=0, ge=0, le=100, description="Expected annual volume growth %. Enter 0 if none.")
    
    # Automation expectations (user-defined projections)
    expected_labor_reduction: float = Field(default=70, ge=0, le=100, description="Expected % of labor time automation will eliminate (0-100)")
    expected_error_reduction: float = Field(default=80, ge=0, le=100, description="Expected % of errors automation will eliminate (0-100)")
    expected_sla_improvement: float = Field(default=75, ge=0, le=100, description="Expected % improvement in SLA compliance (0-100)")


# =============================================================================
# OUTPUT MODEL
# =============================================================================

class ROIOutput(BaseModel):
    """The results we return after calculating ROI."""
    
    # Input summary
    process_name: str
    
    # Current costs
    annual_labor_cost: float
    annual_error_cost: float
    annual_sla_cost: float
    annual_tool_cost: float
    total_current_cost: float
    
    # Automation projections
    automation_savings_percent: float
    annual_savings: float
    
    # ROI metrics
    implementation_cost: float
    payback_months: float
    roi_percentage: float
    five_year_savings: float
    
    # Recommendation
    priority_score: str
    recommendation: str
    
    # Confidence
    confidence_level: str
    assumptions: list[str]


# =============================================================================
# DOCUMENTATION - Why Each Field Exists
# =============================================================================
"""
FREQUENCY OPTIONS:
------------------
Different frequencies = different annual calculations.
Calculated based on user's working_days_per_year and hours_per_day.
- EVERY_MINUTE: hours_per_year * 60
- HOURLY: working_days * hours_per_day
- DAILY: working_days (default 250)
- WEEKLY: 52 runs/year
- BIWEEKLY: 26 runs/year
- MONTHLY: 12 runs/year
- QUARTERLY: 4 runs/year

working_days_per_year:
    How many days per year the business operates.
    - 250: Standard Mon-Fri office
    - 300: 6-day operations
    - 365: 24/7 operations

hours_per_day:
    How many hours per day the process might run.
    - 8: Standard business hours
    - 24: Round-the-clock operations


INPUT FIELDS EXPLAINED:
-----------------------

process_name:
    Identifies what we're calculating. Appears in PDF report title.

frequency:
    A process running DAILY costs more annually than one running MONTHLY.
    This is the multiplier for all our calculations.
    Formula: runs_per_year = runs_per_period * periods_per_year

runs_per_period:
    Some processes run multiple times per period.
    Example: Invoice processing might happen 20 times per day.

hours_per_run:
    The time investment we're trying to reduce with automation.
    Formula: annual_hours = hours_per_run * runs_per_year

staff_count:
    More people = higher labor cost.
    Formula: labor_cost = hours * staff_count * hourly_rate

hourly_rate:
    The dollar value of each hour worked.
    "Fully-loaded" means including benefits, taxes, overhead - not just salary.
    Typical rule: actual_cost = salary * 1.3 to 1.5

error_rate:
    Manual processes often have errors. Errors cost money to fix.
    High error_rate = higher ROI from automation (more to improve).

error_fix_cost:
    Some errors are cheap (re-enter data), some are expensive (lost customer).
    Formula: annual_error_cost = runs * error_rate% * error_fix_cost

error_fix_hours:
    Time spent fixing errors = additional labor cost.
    Formula: error_labor_cost = errors * hours * hourly_rate

has_sla:
    If no SLA requirements, we skip penalty calculations.

sla_penalty:
    Some contracts have penalties for late delivery or non-compliance.
    Example: $5,000 fine per late report.

sla_breaches_year:
    More breaches = higher penalty cost = higher savings from automation.
    Formula: annual_sla_cost = sla_penalty * sla_breaches_year

current_tool_cost:
    If you're already paying for tools, automation might replace them.
    This gets added to savings (you stop paying for old tools).

implementation_cost:
    THE KEY NUMBER. How much will automation cost?
    Formula: payback_period = implementation_cost ÷ annual_savings
    - Payback < 12 months → Great investment
    - Payback 12-24 months → Good investment
    - Payback > 36 months → Questionable investment

volume_growth:
    If volume grows, manual costs grow. Automation scales for free.
    A 20% growth rate makes automation MORE valuable over time.
    Formula: year2_savings = year1_savings * (1 + growth_rate)

expected_labor_reduction:
    User's projection of how much labor automation will save.
    This should come from vendor estimates or similar projects.
    Default 70% is conservative but user should adjust based on their situation.

expected_error_reduction:
    User's projection of how much automation will reduce errors.
    Automation typically eliminates most human errors in repetitive tasks.

expected_sla_improvement:
    User's projection of SLA compliance improvement.
    Automation usually improves consistency and speed.


OUTPUT FIELDS EXPLAINED:
------------------------

annual_labor_cost:      Total hours * staff * hourly rate
annual_error_cost:      Number of errors * cost to fix each
annual_sla_cost:        Number of breaches * penalty per breach
annual_tool_cost:       Current software/tool costs
total_current_cost:     Sum of all costs above

automation_savings_percent:  Percentage of current costs that will be saved
annual_savings:             Dollar amount saved per year after automation

payback_months:         Months until automation investment pays for itself
roi_percentage:         Return on investment for Year 1
five_year_savings:      Total cumulative savings over 5 years

priority_score:         "High", "Medium", or "Low" - should you automate?
recommendation:         Human-readable advice
confidence_level:       How confident we are in estimates
assumptions:            List of inputs used in calculations (user-provided values)
"""