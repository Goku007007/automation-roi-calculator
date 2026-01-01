// Automation scenarios for homepage before/after comparisons
// Each scenario includes manual vs automated workflows and ROI calculations

export const SCENARIOS = [
    {
        id: 'invoice-approval',
        title: 'Invoice Approval',
        category: 'Finance',
        categoryIcon: 'ReceiptIcon',
        description: 'AP invoice processing from receipt to payment',
        manualSteps: [
            { step: 1, action: 'Receive', description: 'Vendor emails invoice PDF' },
            { step: 2, action: 'Download', description: 'AP downloads and renames file' },
            { step: 3, action: 'Enter', description: 'Type invoice fields into spreadsheet' },
            { step: 4, action: 'Request', description: 'Email budget owner for approval' },
            { step: 5, action: 'Clarify', description: 'Owner asks questions, requests edits' },
            { step: 6, action: 'Follow up', description: 'Chase approval (multiple times)' },
            { step: 7, action: 'Approve', description: 'Owner finally approves via email' },
            { step: 8, action: 'Code', description: 'AP assigns cost center in ERP' },
            { step: 9, action: 'Schedule', description: 'Create payment and send confirmation' },
        ],
        automatedSteps: [
            { step: 1, action: 'Receive', description: 'Invoice arrives to shared inbox' },
            { step: 2, action: 'Extract', description: 'OCR captures key fields automatically' },
            { step: 3, action: 'Validate', description: 'Auto-check duplicates and PO match' },
            { step: 4, action: 'Route', description: 'Send to approver based on amount' },
            { step: 5, action: 'Approve', description: 'One-click approve/reject notification' },
            { step: 6, action: 'Escalate', description: 'Auto-reminder after SLA deadline' },
            { step: 7, action: 'Sync', description: 'ERP update with full audit trail' },
        ],
        assumptions: {
            volume: 120,
            volumeUnit: 'invoices/month',
            timeManualMinutes: 12,
            timeAutomatedMinutes: 3,
            hourlyRate: 40,
            toolCostMonthly: 250,
        },
        outputs: {
            manualHours: 24,
            manualCost: 960,
            automatedHours: 6,
            automatedCost: 240,
            netSavings: 470,
            paybackMonths: 0,
        },
        prefillParams: {
            taskName: 'Invoice Approval',
            frequency: 120,
            timePerTask: 12,
            people: 1,
            hourlyRate: 40,
        },
    },
    {
        id: 'lead-routing',
        title: 'Lead Routing',
        category: 'Sales',
        categoryIcon: 'UsersIcon',
        description: 'Inbound lead distribution to sales reps',
        manualSteps: [
            { step: 1, action: 'Submit', description: 'Lead fills out website form' },
            { step: 2, action: 'Receive', description: 'Form email goes to shared inbox' },
            { step: 3, action: 'Check', description: 'SDR checks inbox periodically' },
            { step: 4, action: 'Copy', description: 'SDR enters details into CRM' },
            { step: 5, action: 'Lookup', description: 'Find territory or segment owner' },
            { step: 6, action: 'Assign', description: 'Manually assign lead to rep' },
            { step: 7, action: 'Notify', description: 'Ping rep via Slack or email' },
            { step: 8, action: 'Fix', description: 'Manager corrects misroutes later' },
        ],
        automatedSteps: [
            { step: 1, action: 'Capture', description: 'Form submission triggers instantly' },
            { step: 2, action: 'Enrich', description: 'Lookup company size and region' },
            { step: 3, action: 'Assign', description: 'Route to rep by territory + capacity' },
            { step: 4, action: 'Create', description: 'CRM record and tasks auto-created' },
            { step: 5, action: 'Notify', description: 'Rep gets Slack alert immediately' },
            { step: 6, action: 'Sequence', description: 'Follow-up triggered if no response' },
        ],
        assumptions: {
            volume: 200,
            volumeUnit: 'leads/month',
            timeManualMinutes: 6,
            timeAutomatedMinutes: 1,
            hourlyRate: 45,
            toolCostMonthly: 150,
        },
        outputs: {
            manualHours: 20,
            manualCost: 900,
            automatedHours: 3.33,
            automatedCost: 150,
            netSavings: 600,
            paybackMonths: 0,
        },
        prefillParams: {
            taskName: 'Lead Routing',
            frequency: 200,
            timePerTask: 6,
            people: 1,
            hourlyRate: 45,
        },
    },
    {
        id: 'onboarding',
        title: 'New Hire Onboarding',
        category: 'HR',
        categoryIcon: 'UserPlusIcon',
        description: 'IT access provisioning for new employees',
        manualSteps: [
            { step: 1, action: 'Notify', description: 'HR emails IT about new hire' },
            { step: 2, action: 'Request', description: 'IT asks for missing info (role, apps)' },
            { step: 3, action: 'Reply', description: 'Manager sends app list' },
            { step: 4, action: 'Create', description: 'IT creates accounts one by one' },
            { step: 5, action: 'Assign', description: 'Manually assign licenses' },
            { step: 6, action: 'Order', description: 'Request laptop shipment' },
            { step: 7, action: 'Send', description: 'HR sends orientation docs' },
            { step: 8, action: 'Fix', description: 'Someone forgets access—delays' },
            { step: 9, action: 'Escalate', description: 'New hire reports issues in week 1' },
        ],
        automatedSteps: [
            { step: 1, action: 'Trigger', description: 'HRIS event starts workflow' },
            { step: 2, action: 'Select', description: 'Manager picks role template' },
            { step: 3, action: 'Provision', description: 'Accounts + groups auto-created' },
            { step: 4, action: 'License', description: 'Licenses assigned from template' },
            { step: 5, action: 'Order', description: 'Hardware ticket auto-created' },
            { step: 6, action: 'Send', description: 'Docs and checklists auto-sent' },
            { step: 7, action: 'Track', description: 'Dashboard shows readiness status' },
        ],
        assumptions: {
            volume: 10,
            volumeUnit: 'hires/month',
            timeManualMinutes: 150, // 2.5 hours
            timeAutomatedMinutes: 45, // 0.75 hours
            hourlyRate: 55,
            toolCostMonthly: 200,
        },
        outputs: {
            manualHours: 25,
            manualCost: 1375,
            automatedHours: 7.5,
            automatedCost: 412.5,
            netSavings: 762.5,
            paybackMonths: 0,
        },
        prefillParams: {
            taskName: 'New Hire Onboarding',
            frequency: 10,
            timePerTask: 150,
            people: 1,
            hourlyRate: 55,
        },
    },
];

export function getScenarioById(id) {
    return SCENARIOS.find(s => s.id === id);
}

export function buildPrefillUrl(scenario) {
    const params = new URLSearchParams();
    params.set('prefill', scenario.id);
    params.set('taskName', scenario.prefillParams.taskName);
    params.set('frequency', scenario.prefillParams.frequency);
    params.set('timePerTask', scenario.prefillParams.timePerTask);
    params.set('people', scenario.prefillParams.people);
    params.set('hourlyRate', scenario.prefillParams.hourlyRate);
    return `/calculator?${params.toString()}`;
}
