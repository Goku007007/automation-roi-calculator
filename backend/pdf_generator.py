"""
pdf_generator.py - Enterprise-Grade One-Page PDF Reports

Creates CFO-ready automation assessment reports with:
- Clean, professional layout
- Muted, enterprise color palette
- Consultant-memo tone
- Single-page hard limit
"""

from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from io import BytesIO

from models import ROIOutput


# Enterprise Color Palette - Muted, professional
COLORS = {
    'brand': colors.HexColor('#2563eb'),         # Brand blue
    'brand_muted': colors.HexColor('#4b7bd5'),   # Softer header blue
    'text_primary': colors.HexColor('#111827'),  # Near black
    'text_secondary': colors.HexColor('#4b5563'), # Dark gray
    'text_muted': colors.HexColor('#9ca3af'),    # Light gray
    'positive': colors.HexColor('#3d8b6e'),      # Muted green
    'positive_bg': colors.HexColor('#f0f7f4'),   # Very subtle green bg
    'negative': colors.HexColor('#9b6b6b'),      # Muted red-brown
    'accent_purple': colors.HexColor('#6b5b8c'), # Muted purple
    'surface': colors.HexColor('#f9fafb'),       # Light surface
    'border': colors.HexColor('#e5e7eb'),        # Border gray
    'header_bg': colors.HexColor('#374151'),     # Dark gray header
    'white': colors.white,
}

# Typography
FONT = 'Helvetica'
FONT_BOLD = 'Helvetica-Bold'


def get_priority_color(priority: str) -> colors.Color:
    return {'High': COLORS['positive'], 'Medium': colors.HexColor('#8b7355'), 'Low': COLORS['negative']}.get(priority, COLORS['text_secondary'])


def get_priority_bg(priority: str) -> colors.Color:
    return {'High': COLORS['positive_bg'], 'Medium': colors.HexColor('#faf8f5'), 'Low': colors.HexColor('#faf5f5')}.get(priority, COLORS['surface'])


def generate_pdf_report(data: ROIOutput) -> bytes:
    """Generate an enterprise-grade one-page PDF report."""
    buffer = BytesIO()
    
    # Consistent margins
    margin = 0.5 * inch
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        topMargin=0.35 * inch,
        bottomMargin=0.2 * inch,
        leftMargin=margin,
        rightMargin=margin,
    )
    
    page_width = letter[0] - 2 * margin  # ~7.5 inches
    
    elements = []
    
    # ==================== HEADER (enterprise-clean) ====================
    header_data = [[
        Paragraph(f'<font name="{FONT_BOLD}" size="14" color="#2563eb">AutomateROI</font>', 
                  ParagraphStyle('Logo', alignment=TA_LEFT)),
        Paragraph(f'<font name="{FONT}" size="8" color="#9ca3af">{datetime.now().strftime("%B %d, %Y")}</font>',
                  ParagraphStyle('Date', alignment=TA_RIGHT)),
    ]]
    header = Table(header_data, colWidths=[page_width * 0.5, page_width * 0.5])
    header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(header)
    
    # Title bar (reduced height, no all-caps except section headers)
    title_table = Table([
        [Paragraph(f'<font name="{FONT_BOLD}" size="12" color="white">Automation ROI Report</font>',
                   ParagraphStyle('Title', alignment=TA_CENTER))],
        [Paragraph(f'<font name="{FONT}" size="9" color="#bfdbfe">{data.process_name.strip()}</font>',
                   ParagraphStyle('Sub', alignment=TA_CENTER))],
    ], colWidths=[page_width])
    title_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLORS['brand']),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 8),
    ]))
    elements.append(title_table)
    elements.append(Spacer(1, 16))
    
    # ==================== EXECUTIVE SUMMARY ====================
    section_style = ParagraphStyle('Section', fontName=FONT_BOLD, fontSize=9, textColor=COLORS['text_primary'], spaceAfter=8)
    elements.append(Paragraph("EXECUTIVE SUMMARY", section_style))
    
    # Three equal-width metric cards
    kpi_width = page_width / 3
    
    def kpi_card(label, value, caption, value_color):
        return Table([
            [Paragraph(f'<font name="{FONT}" size="7" color="#6b7280">{label}</font>', 
                       ParagraphStyle('Label', alignment=TA_LEFT))],
            [Paragraph(f'<font name="{FONT_BOLD}" size="15" color="{value_color}">{value}</font>',
                       ParagraphStyle('Value', alignment=TA_LEFT))],
            [Paragraph(f'<font name="{FONT}" size="6" color="#9ca3af">{caption}</font>',
                       ParagraphStyle('Caption', alignment=TA_LEFT))],
        ], colWidths=[kpi_width - 8])
    
    kpi_row = [[
        kpi_card("Annual Savings", f"${data.annual_savings:,.0f}", "Projected yearly benefit", "#3d8b6e"),
        kpi_card("Return on Investment", f"{data.roi_percentage:,.0f}%", "Based on provided inputs", "#4b7bd5"),
        kpi_card("Payback Period", f"{data.payback_months:.1f} months", "Time to break even", "#6b5b8c"),
    ]]
    kpi_table = Table(kpi_row, colWidths=[kpi_width, kpi_width, kpi_width])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLORS['surface']),
        ('BOX', (0, 0), (0, 0), 0.5, COLORS['border']),
        ('BOX', (1, 0), (1, 0), 0.5, COLORS['border']),
        ('BOX', (2, 0), (2, 0), 0.5, COLORS['border']),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 16))
    
    # ==================== COST ANALYSIS ====================
    elements.append(Paragraph("COST ANALYSIS", section_style))
    
    # Equal width, aligned tables
    table_width = (page_width - 12) / 2
    col1 = table_width * 0.6
    col2 = table_width * 0.4
    
    current_data = [
        ["Current State", ""],
        ["Annual labor cost", f"${data.annual_labor_cost:,.0f}"],
        ["Error & compliance costs", f"${data.annual_error_cost + data.annual_sla_cost:,.0f}"],
        ["Total current cost", f"${data.total_current_cost:,.0f}"],
    ]
    
    automated_data = [
        ["With Automation", ""],
        ["Implementation cost", f"${data.implementation_cost:,.0f}"],
        ["Annual license/maintenance", f"${data.annual_automation_cost:,.0f}"],
        ["5-year net savings", f"${data.five_year_savings:,.0f}"],
    ]
    
    def make_cost_table(rows, header_bg, total_bold=True):
        t = Table(rows, colWidths=[col1, col2])
        style_commands = [
            ('FONTNAME', (0, 0), (-1, -1), FONT),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (-1, 0), header_bg),
            ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
            ('FONTNAME', (0, 0), (-1, 0), FONT_BOLD),
            ('BACKGROUND', (0, 1), (-1, -2), COLORS['surface']),
            ('BACKGROUND', (0, -1), (-1, -1), COLORS['surface']),
            ('FONTNAME', (0, -1), (-1, -1), FONT_BOLD),  # Bold totals, not colored
            ('TEXTCOLOR', (0, -1), (-1, -1), COLORS['text_primary']),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 0.5, COLORS['border']),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]
        t.setStyle(TableStyle(style_commands))
        return t
    
    cost_combined = Table([
        [make_cost_table(current_data, COLORS['header_bg']),
         make_cost_table(automated_data, COLORS['brand_muted'])]
    ], colWidths=[table_width, table_width])
    cost_combined.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (0, 0), 0),
        ('RIGHTPADDING', (1, 0), (1, 0), 0),
    ]))
    elements.append(cost_combined)
    elements.append(Spacer(1, 16))
    
    # ==================== RECOMMENDATION ====================
    elements.append(Paragraph("RECOMMENDATION", section_style))
    
    priority_color = get_priority_color(data.priority_score)
    priority_bg = get_priority_bg(data.priority_score)
    
    # Get hex color for font (can't use Color object in font tag)
    priority_hex = {'High': '#3d8b6e', 'Medium': '#8b7355', 'Low': '#9b6b6b'}.get(data.priority_score, '#4b5563')
    
    # Truncate if needed
    rec_text = data.recommendation.strip()
    if len(rec_text) > 170:
        rec_text = rec_text[:167] + "..."
    
    # Consultant memo style: border emphasis, subtle bg
    rec_table = Table([[
        Paragraph(
            f'<font name="{FONT_BOLD}" size="8" color="{priority_hex}">{data.priority_score} Priority</font><br/>'
            f'<font name="{FONT}" size="8" color="#374151">{rec_text}</font>',
            ParagraphStyle('Rec', fontName=FONT, leading=11)
        ),
    ]], colWidths=[page_width])
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), priority_bg),
        ('BOX', (0, 0), (-1, -1), 1, priority_color),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(rec_table)
    elements.append(Spacer(1, 12))
    
    # ==================== ASSUMPTIONS ====================
    elements.append(Paragraph("ASSUMPTIONS", section_style))
    
    assumptions = data.assumptions[:4]
    assumption_text = "  •  ".join(assumptions)
    
    elements.append(Paragraph(
        f'<font name="{FONT}" size="7" color="#6b7280">{assumption_text}</font>',
        ParagraphStyle('Assumption', fontName=FONT, leading=9)
    ))
    
    # ==================== FOOTER ====================
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=COLORS['border']))
    elements.append(Paragraph(
        f'<font name="{FONT}" size="5" color="#9ca3af">Report based on user-provided estimates. Consult stakeholders before investment decisions. | automateroi.vercel.app</font>',
        ParagraphStyle('Footer', fontName=FONT, alignment=TA_CENTER, spaceBefore=3)
    ))
    
    # Build PDF
    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes