"""
pdf_generator.py - Generate Professional PDF Reports

Creates branded, visually appealing PDF reports with:
- Professional gradient header with branding
- Executive summary with highlighted metrics
- Color-coded tables
- Professional formatting
"""

from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.graphics.shapes import Drawing, Rect, String
from io import BytesIO

from models import ROIOutput


# Brand Colors - Modern gradient palette
COLORS = {
    'primary': colors.HexColor('#2563eb'),       # Bright blue
    'primary_dark': colors.HexColor('#1e40af'),  # Dark blue
    'primary_light': colors.HexColor('#3b82f6'), # Light blue
    'success': colors.HexColor('#059669'),       # Emerald
    'success_light': colors.HexColor('#10b981'), # Light emerald
    'warning': colors.HexColor('#d97706'),       # Amber
    'danger': colors.HexColor('#dc2626'),        # Red
    'gray_50': colors.HexColor('#f8fafc'),
    'gray_100': colors.HexColor('#f1f5f9'),
    'gray_200': colors.HexColor('#e2e8f0'),
    'gray_400': colors.HexColor('#94a3b8'),
    'gray_600': colors.HexColor('#475569'),
    'gray_800': colors.HexColor('#1e293b'),
    'gray_900': colors.HexColor('#0f172a'),
    'white': colors.white,
}


def get_priority_color(priority: str) -> colors.Color:
    """Get color based on priority score."""
    priority_colors = {
        'High': COLORS['success'],
        'Medium': COLORS['warning'],
        'Low': COLORS['danger'],
    }
    return priority_colors.get(priority, COLORS['gray_600'])


def get_priority_bg_color(priority: str) -> colors.Color:
    """Get background color based on priority score."""
    priority_colors = {
        'High': colors.HexColor('#dcfce7'),   # Light green
        'Medium': colors.HexColor('#fef3c7'), # Light amber
        'Low': colors.HexColor('#fee2e2'),    # Light red
    }
    return priority_colors.get(priority, COLORS['gray_100'])


def create_logo_header(data: ROIOutput, styles: dict) -> list:
    """Create a professional header with branding."""
    elements = []
    
    # Brand header bar
    header_data = [[
        Paragraph(
            '<font size="24" color="#2563eb"><b>⚡ AutomateROI</b></font>',
            styles['Normal']
        ),
        Paragraph(
            f'<font size="10" color="#64748b">Generated {datetime.now().strftime("%B %d, %Y")}</font>',
            ParagraphStyle('RightAlign', parent=styles['Normal'], alignment=TA_RIGHT)
        ),
    ]]
    
    header_table = Table(header_data, colWidths=[4*inch, 3*inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
    ]))
    elements.append(header_table)
    
    # Title section with blue background
    title_style = ParagraphStyle(
        'ReportTitle',
        parent=styles['Heading1'],
        fontSize=22,
        textColor=COLORS['white'],
        alignment=TA_CENTER,
        spaceAfter=0,
    )
    
    subtitle_style = ParagraphStyle(
        'ReportSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.HexColor('#bfdbfe'),
        alignment=TA_CENTER,
    )
    
    title_content = [
        [Paragraph("AUTOMATION ROI REPORT", title_style)],
        [Paragraph(f"Process: {data.process_name}", subtitle_style)],
    ]
    
    title_table = Table(title_content, colWidths=[7*inch])
    title_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLORS['primary']),
        ('TOPPADDING', (0, 0), (-1, 0), 20),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 20),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(title_table)
    elements.append(Spacer(1, 25))
    
    return elements


def create_kpi_cards(data: ROIOutput, styles: dict) -> list:
    """Create executive summary KPI cards."""
    elements = []
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=COLORS['gray_800'],
        spaceBefore=5,
        spaceAfter=15,
        fontName='Helvetica-Bold',
    )
    
    elements.append(Paragraph("📊 EXECUTIVE SUMMARY", section_title))
    
    # Create individual KPI cards
    def make_kpi(label, value, sublabel, color):
        return Table([
            [Paragraph(f'<font size="9" color="#64748b">{label}</font>', styles['Normal'])],
            [Paragraph(f'<font size="22" color="{color}"><b>{value}</b></font>', styles['Normal'])],
            [Paragraph(f'<font size="8" color="#94a3b8">{sublabel}</font>', styles['Normal'])],
        ], colWidths=[2.2*inch])
    
    # Format values
    savings_value = f"${data.annual_savings:,.0f}"
    roi_value = f"{data.roi_percentage:,.1f}%"
    payback_value = f"{data.payback_months:.1f} mo"
    
    kpi_row = [[
        make_kpi("ANNUAL SAVINGS", savings_value, "Projected yearly benefit", "#059669"),
        make_kpi("RETURN ON INVESTMENT", roi_value, "First year ROI", "#2563eb"),
        make_kpi("PAYBACK PERIOD", payback_value, "Time to break even", "#7c3aed"),
    ]]
    
    kpi_table = Table(kpi_row, colWidths=[2.33*inch, 2.33*inch, 2.33*inch])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLORS['gray_50']),
        ('BOX', (0, 0), (0, 0), 1, COLORS['gray_200']),
        ('BOX', (1, 0), (1, 0), 1, COLORS['gray_200']),
        ('BOX', (2, 0), (2, 0), 1, COLORS['gray_200']),
        ('TOPPADDING', (0, 0), (-1, -1), 15),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    elements.append(kpi_table)
    elements.append(Spacer(1, 25))
    
    return elements


def create_cost_analysis(data: ROIOutput, styles: dict) -> list:
    """Create cost analysis section."""
    elements = []
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=COLORS['gray_800'],
        spaceBefore=5,
        spaceAfter=15,
        fontName='Helvetica-Bold',
    )
    
    elements.append(Paragraph("💰 COST ANALYSIS", section_title))
    
    # Current vs Automated costs - two column layout
    current_data = [
        ["Current State", ""],
        ["Annual Labor Cost", f"${data.annual_labor_cost:,.0f}"],
        ["Annual Error Cost", f"${data.annual_error_cost:,.0f}"],
        ["Annual SLA Penalties", f"${data.annual_sla_cost:,.0f}"],
        ["Current Tool Cost", f"${data.annual_tool_cost:,.0f}"],
        ["TOTAL CURRENT COST", f"${data.total_current_cost:,.0f}"],
    ]
    
    automated_data = [
        ["With Automation", ""],
        ["Implementation Cost", f"${data.implementation_cost:,.0f}"],
        ["Annual License/Maintenance", f"${data.annual_automation_cost:,.0f}"],
        ["5-Year Total Cost", f"${data.total_cost_of_ownership:,.0f}"],
        ["Net Annual Savings", f"${data.net_annual_savings:,.0f}"],
        ["5-YEAR NET SAVINGS", f"${data.five_year_savings:,.0f}"],
    ]
    
    def style_cost_table(table, header_color, total_color):
        table.setStyle(TableStyle([
            # Header row
            ('BACKGROUND', (0, 0), (-1, 0), header_color),
            ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('TOPPADDING', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            # Data rows
            ('BACKGROUND', (0, 1), (-1, -2), COLORS['gray_50']),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            # Total row
            ('BACKGROUND', (0, -1), (-1, -1), total_color),
            ('TEXTCOLOR', (0, -1), (-1, -1), COLORS['white']),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            # Grid
            ('GRID', (0, 0), (-1, -1), 0.5, COLORS['gray_200']),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
    
    current_table = Table(current_data, colWidths=[2.2*inch, 1.3*inch])
    style_cost_table(current_table, COLORS['gray_600'], COLORS['danger'])
    
    automated_table = Table(automated_data, colWidths=[2.2*inch, 1.3*inch])
    style_cost_table(automated_table, COLORS['primary'], COLORS['success'])
    
    combined = Table([[current_table, automated_table]], colWidths=[3.5*inch, 3.5*inch])
    combined.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    elements.append(combined)
    elements.append(Spacer(1, 25))
    
    return elements


def create_recommendation(data: ROIOutput, styles: dict) -> list:
    """Create recommendation section with priority badge."""
    elements = []
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=COLORS['gray_800'],
        spaceBefore=5,
        spaceAfter=15,
        fontName='Helvetica-Bold',
    )
    
    elements.append(Paragraph("✅ RECOMMENDATION", section_title))
    
    priority_color = get_priority_color(data.priority_score)
    priority_bg = get_priority_bg_color(data.priority_score)
    
    # Priority badge and recommendation
    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontSize=12,
        textColor=priority_color,
        fontName='Helvetica-Bold',
    )
    
    rec_style = ParagraphStyle(
        'Recommendation',
        parent=styles['Normal'],
        fontSize=11,
        textColor=COLORS['gray_800'],
        leading=16,
    )
    
    rec_content = [
        [
            Paragraph(f"Priority: {data.priority_score}", badge_style),
        ],
        [
            Paragraph(data.recommendation, rec_style),
        ],
    ]
    
    rec_table = Table(rec_content, colWidths=[6.5*inch])
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), priority_bg),
        ('BOX', (0, 0), (-1, -1), 2, priority_color),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ]))
    
    elements.append(rec_table)
    elements.append(Spacer(1, 20))
    
    return elements


def create_assumptions(data: ROIOutput, styles: dict) -> list:
    """Create assumptions/methodology section."""
    elements = []
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=COLORS['gray_800'],
        spaceBefore=5,
        spaceAfter=15,
        fontName='Helvetica-Bold',
    )
    
    elements.append(Paragraph("📋 ASSUMPTIONS & METHODOLOGY", section_title))
    
    # List assumptions
    assumption_style = ParagraphStyle(
        'Assumption',
        parent=styles['Normal'],
        fontSize=9,
        textColor=COLORS['gray_600'],
        leftIndent=15,
        bulletIndent=5,
        spaceBefore=3,
        spaceAfter=3,
    )
    
    for assumption in data.assumptions[:6]:  # Limit to 6 assumptions
        elements.append(Paragraph(f"• {assumption}", assumption_style))
    
    elements.append(Spacer(1, 15))
    
    return elements


def create_footer(styles: dict) -> list:
    """Create professional footer."""
    elements = []
    
    elements.append(HRFlowable(width="100%", thickness=1, color=COLORS['gray_200'], spaceBefore=15))
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=COLORS['gray_400'],
        alignment=TA_CENTER,
        spaceBefore=10,
    )
    
    disclaimer = """
    This report is generated based on user-provided estimates. Actual results may vary.
    Consult with stakeholders before making investment decisions. | Generated by AutomateROI Calculator
    """
    
    elements.append(Paragraph(disclaimer, footer_style))
    
    return elements


def generate_pdf_report(data: ROIOutput) -> bytes:
    """
    Generate a professional PDF report from ROI calculation results.
    
    Args:
        data: The ROIOutput from the calculation
        
    Returns:
        PDF file as bytes
    """
    buffer = BytesIO()
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        topMargin=0.4*inch,
        bottomMargin=0.4*inch,
        leftMargin=0.5*inch,
        rightMargin=0.5*inch,
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Build report sections
    elements.extend(create_logo_header(data, styles))
    elements.extend(create_kpi_cards(data, styles))
    elements.extend(create_cost_analysis(data, styles))
    elements.extend(create_recommendation(data, styles))
    elements.extend(create_assumptions(data, styles))
    elements.extend(create_footer(styles))
    
    # Build PDF
    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes