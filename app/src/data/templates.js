/**
 * Automation Templates Data
 * 
 * Central source of truth for all automation templates used in:
 * - Calculator (Quick Start)
 * - Marketplace (Template Library)
 */

export const TEMPLATES = [
    {
        id: 'invoice-processing',
        name: 'Invoice Processing',
        icon: 'ReceiptIcon',
        description: 'Accounts payable automation with data entry, validation, and routing.',
        category: 'Finance',
        defaults: {
            process_name: 'Invoice Processing',
            frequency: 'daily',
            runs_per_period: 20,          // ~250 invoices/month assuming daily
            hours_per_run: 0.25,          // 15 minutes per invoice
            staff_count: 2,
            hourly_rate: 24,              // BLS median for AP clerks
            error_rate: 5,                // 2-5% error rate
            error_fix_cost: 50,           // Rework cost
            implementation_cost: 15000,   // Mid-range setup
            software_license_cost: 3600,  // $300/month
            annual_maintenance_cost: 1200,
            expected_labor_reduction: 75, // 60-80% reduction
        },
        benchmarks: {
            timeReduction: '60-80%',
            errorReduction: '90%+',
            typicalPayback: '4-8 months',
        }
    },
    {
        id: 'employee-onboarding',
        name: 'Employee Onboarding',
        icon: 'UserPlusIcon',
        description: 'New hire paperwork, system access, and orientation workflows.',
        category: 'HR',
        defaults: {
            process_name: 'Employee Onboarding',
            frequency: 'monthly',
            runs_per_period: 3,           // ~3 hires/month
            hours_per_run: 8,             // 8-10 hrs per hire
            staff_count: 2,               // HR + IT
            hourly_rate: 35,              // BLS median
            error_rate: 10,               // Compliance risk
            error_fix_cost: 100,          // Remediation
            implementation_cost: 20000,   // System integration
            software_license_cost: 6000,  // HRIS cost
            annual_maintenance_cost: 2000,
            expected_labor_reduction: 50, // 30-50% reduction
        },
        benchmarks: {
            timeReduction: '30-50%',
            errorReduction: '75%+',
            typicalPayback: '8-14 months',
        }
    },
    {
        id: 'monthly-reporting',
        name: 'Monthly Reporting',
        icon: 'ChartBarIcon',
        description: 'Sales/marketing data aggregation, analysis, and report generation.',
        category: 'Operations',
        defaults: {
            process_name: 'Monthly Reporting',
            frequency: 'monthly',
            runs_per_period: 4,           // Weekly + Monthly
            hours_per_run: 6,             // 5-10 hrs per report
            staff_count: 1,
            hourly_rate: 37,              // Analyst rate
            error_rate: 3,                // Spreadsheet errors
            error_fix_cost: 75,           // Correction time
            implementation_cost: 12000,   // BI setup
            software_license_cost: 2400,  // Analytics tool
            annual_maintenance_cost: 1000,
            expected_labor_reduction: 65, // 50-65% automatable
        },
        benchmarks: {
            timeReduction: '50-65%',
            errorReduction: '80%+',
            typicalPayback: '6-10 months',
        }
    },
    {
        id: 'customer-support-triage',
        name: 'Support Ticket Triage',
        icon: 'HeadphonesIcon',
        description: 'Automated ticket categorization, routing, and basic auto-responses.',
        category: 'Support',
        defaults: {
            process_name: 'Support Ticket Triage',
            frequency: 'daily',
            runs_per_period: 50,          // 50 tickets/day
            hours_per_run: 0.1,           // 6 mins per ticket manual
            staff_count: 3,
            hourly_rate: 22,              // Support agent rate
            error_rate: 8,                // Misrouting rate
            error_fix_cost: 15,           // Rerouting cost
            implementation_cost: 8000,    // Helpdesk config
            software_license_cost: 4800,  // $400/mo tools
            annual_maintenance_cost: 800,
            expected_labor_reduction: 40, // 30-50% reduction
        },
        benchmarks: {
            timeReduction: '30-50%',
            errorReduction: '60%+',
            typicalPayback: '3-6 months',
        }
    },
    {
        id: 'lead-routing',
        name: 'Lead Routing & Scoring',
        icon: 'TargetIcon',
        description: 'Automatically qualify, score, and assign leads to sales representatives.',
        category: 'Sales',
        defaults: {
            process_name: 'Lead Routing',
            frequency: 'daily',
            runs_per_period: 20,          // 20 leads/day
            hours_per_run: 0.15,          // 9 mins per lead research
            staff_count: 2,               // SDRs
            hourly_rate: 28,              // SDR rate
            error_rate: 15,               // Missed/delayed follow-up
            error_fix_cost: 200,          // Lost opportunity cost (conservative)
            implementation_cost: 10000,   // CRM automation setup
            software_license_cost: 3000,  // Enrichment tools
            annual_maintenance_cost: 1500,
            expected_labor_reduction: 90, // Near 100% automation
        },
        benchmarks: {
            timeReduction: '80-95%',
            errorReduction: '95%+',
            typicalPayback: '2-5 months',
        }
    }
];
