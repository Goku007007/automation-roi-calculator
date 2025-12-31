"""
pdf_generator.py - Generate Professional PDF Reports

Creates branded, visually appealing PDF reports with:
- Professional header with branding
- Color-coded metrics
- Executive summary section
- Assumptions and methodology
"""

from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, Image
)
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from io import BytesIO

from models import ROIOutput


# Brand Colors
COLORS = {
    'primary': colors.HexColor('#3b82f6'),      # Blue
    'primary_dark': colors.HexColor('#1e40af'),  # Dark blue
    'success': colors.HexColor('#10b981'),       # Green
    'warning': colors.HexColor('#f59e0b'),       # Amber
    'danger': colors.HexColor('#ef4444'),        # Red
    'gray_light': colors.HexColor('#f8fafc'),
    'gray_border': colors.HexColor('#e2e8f0'),
    'gray_text': colors.HexColor('#64748b'),
    'dark': colors.HexColor('#1e293b'),
}


def get_priority_color(priority: str) -> colors.Color:
    """Get color based on priority score."""
    priority_colors = {
        'High': COLORS['success'],
        'Medium': COLORS['warning'],
        'Low': COLORS['danger'],
    }
    return priority_colors.get(priority, COLORS['gray_text'])


def create_header_section(data: ROIOutput, styles: dict) -> list:
    """Create the report header with title and date."""
    elements = []
    
    # Main title
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=COLORS['dark'],
        spaceAfter=8,
        alignment=TA_CENTER,
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=COLORS['gray_text'],
        alignment=TA_CENTER,
        spaceAfter=20,
    )
    
    elements.append(Paragraph("Automation ROI Report", title_style))
    elements.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y')}", subtitle_style))
    
    # Process name header
    process_style = ParagraphStyle(
        'ProcessName',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=COLORS['primary'],
        spaceBefore=10,
        spaceAfter=20,
    )
    elements.append(Paragraph(f"Process: {data.process_name}", process_style))
    
    # Divider
    elements.append(HRFlowable(width="100%", thickness=2, color=COLORS['primary'], spaceAfter=20))
    
    return elements


def create_executive_summary(data: ROIOutput, styles: dict) -> list:
    """Create executive summary section with key highlights."""
    elements = []
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=COLORS['dark'],
        spaceBefore=10,
        spaceAfter=12,
    )
    
    elements.append(Paragraph("Executive Summary", section_title))
    
    # Summary cards as a table
    summary_data = [
        [
            create_metric_cell("Annual Savings", f"${data.annual_savings:,.0f}", COLORS['success']),
            create_metric_cell("ROI", f"{data.roi_percentage}%", COLORS['primary']),
            create_metric_cell("Payback", f"{data.payback_months} mo", COLORS['primary_dark']),
        ]
    ]
    
    summary_table = Table(summary_data, colWidths=[2.1*inch, 2.1*inch, 2.1*inch])
    summary_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    
    elements.append(summary_table)
    elements.append(Spacer(1, 25))
    
    return elements


def create_metric_cell(label: str, value: str, color: colors.Color) -> Table:
    """Create a styled metric cell for the summary."""
    cell_data = [
        [Paragraph(f'<font color="#64748b" size="9">{label}</font>', getSampleStyleSheet()['Normal'])],
        [Paragraph(f'<font color="{color.hexval()}" size="18"><b>{value}</b></font>', getSampleStyleSheet()['Normal'])],
    ]
    cell_table = Table(cell_data, colWidths=[2*inch])
    cell_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BACKGROUND', (0, 0), (-1, -1), COLORS['gray_light']),
        ('BOX', (0, 0), (-1, -1), 1, COLORS['gray_border']),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    return cell_table


def create_detailed_metrics(data: ROIOutput, styles: dict) -> list:
    """Create detailed metrics table."""
    elements = []
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=COLORS['dark'],
        spaceBefore=5,
        spaceAfter=12,
    )
    
    elements.append(Paragraph("Detailed Metrics", section_title))
    
    # Get priority color
    priority_color = get_priority_color(data.priority_score)
    
    metrics_data = [
        ["Metric", "Value"],
        ["Annual Labor Cost", f"${data.annual_labor_cost:,.2f}"],
        ["Gross Annual Savings", f"${data.annual_savings:,.2f}"],
        ["Annual Automation Cost", f"${data.annual_automation_cost:,.2f}"],
        ["Net Annual Savings", f"${data.net_annual_savings:,.2f}"],
        ["Implementation Cost", f"${data.implementation_cost:,.2f}"],
        ["5-Year Total Cost", f"${data.total_cost_of_ownership:,.2f}"],
        ["Payback Period", f"{data.payback_months} months"],
        ["First Year ROI", f"{data.roi_percentage}%"],
        ["5-Year Net Savings", f"${data.five_year_savings:,.2f}"],
        ["Priority Score", data.priority_score],
    ]
    
    table = Table(metrics_data, colWidths=[3.5*inch, 2.5*inch])
    table.setStyle(TableStyle([
        # Header
        ('BACKGROUND', (0, 0), (-1, 0), COLORS['primary']),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        # Body
        ('BACKGROUND', (0, 1), (-1, -2), COLORS['gray_light']),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        # Priority row highlight
        ('BACKGROUND', (0, -1), (-1, -1), priority_color),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.white),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        # Grid
        ('GRID', (0, 0), (-1, -1), 1, colors.white),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 25))
    
    return elements


def create_recommendation(data: ROIOutput, styles: dict) -> list:
    """Create recommendation section."""
    elements = []
    
    section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=COLORS['dark'],
        spaceBefore=5,
        spaceAfter=12,
    )
    
    recommendation_style = ParagraphStyle(
        'Recommendation',
        parent=styles['Normal'],
        fontSize=11,
        textColor=COLORS['dark'],
        backColor=COLORS['gray_light'],
        leftIndent=15,
        rightIndent=15,
        spaceBefore=5,
        spaceAfter=5,
        borderPadding=15,
    )
    
    elements.append(Paragraph("Recommendation", section_title))
    elements.append(Paragraph(data.recommendation, recommendation_style))
    elements.append(Spacer(1, 20))
    
    return elements


def create_footer(styles: dict) -> list:
    """Create footer with disclaimer."""
    elements = []
    
    elements.append(HRFlowable(width="100%", thickness=1, color=COLORS['gray_border'], spaceBefore=20))
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=COLORS['gray_text'],
        alignment=TA_CENTER,
        spaceBefore=10,
    )
    
    disclaimer = """
    This report is generated based on user-provided inputs and estimates. 
    Actual results may vary. Consult with stakeholders before making investment decisions.
    Generated by Automation ROI Calculator.
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
        topMargin=0.5*inch,
        bottomMargin=0.5*inch,
        leftMargin=0.75*inch,
        rightMargin=0.75*inch,
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Build report sections
    elements.extend(create_header_section(data, styles))
    elements.extend(create_executive_summary(data, styles))
    elements.extend(create_detailed_metrics(data, styles))
    elements.extend(create_recommendation(data, styles))
    elements.extend(create_footer(styles))
    
    # Build PDF
    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes