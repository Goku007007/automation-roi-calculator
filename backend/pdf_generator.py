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
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image as PlatypusImage
)
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.legends import Legend
from io import BytesIO

from models import ROIOutput, ROIInput


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


def create_savings_chart(data: ROIOutput, input_data: ROIInput = None):
    """Create a bar chart showing 5-year cumulative savings."""
    drawing = Drawing(400, 200)
    
    # Calculate dataset
    # If we have input_data, user growth rate. Otherwise flat.
    growth_rate = (input_data.volume_growth / 100.0) if input_data else 0.0
    
    # Costs
    annual_cost = data.annual_automation_cost
    
    # Savings (grows with volume)
    base_savings = data.annual_savings # Gross savings
    
    # Calculate years
    cumulative = []
    running_total = -data.implementation_cost # Start with sunk cost
    
    # Year 1 to 5
    for i in range(5):
        year_savings = base_savings * ((1 + growth_rate) ** i)
        net_year = year_savings - annual_cost
        running_total += net_year
        cumulative.append(running_total)
    
    # Check if numbers are huge (millions) to scale labels
    is_millions = abs(cumulative[-1]) >= 1000000
    divisor = 1000000 if is_millions else 1000
    suffix = 'M' if is_millions else 'k'
    
    data_points = [(c / divisor) for c in cumulative]
    
    bc = VerticalBarChart()
    bc.x = 50
    bc.y = 50
    bc.height = 125
    bc.width = 300
    bc.data = [data_points]
    bc.strokeColor = colors.white
    
    # Conditional color based on positive/negative
    bc.bars[0].fillColor = COLORS['brand_muted']
    
    bc.groupSpacing = 15
    bc.barSpacing = 5
    
    # Axis configuration
    bc.valueAxis.valueMin = min(0, min(data_points)) * 1.1 # Add some buffer
    bc.valueAxis.valueMax = max(data_points) * 1.1
    bc.valueAxis.valueStep = (bc.valueAxis.valueMax - bc.valueAxis.valueMin) / 4
    
    bc.categoryAxis.labels.boxAnchor = 'ne'
    bc.categoryAxis.labels.dx = 8
    bc.categoryAxis.labels.dy = -2
    bc.categoryAxis.labels.fontName = FONT
    bc.categoryAxis.categoryNames = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5']
    
    bc.valueAxis.labelTextFormat = f'$%d{suffix}'
    
    drawing.add(bc)
    
    # Title
    from reportlab.graphics.charts.textlabels import Label
    lab = Label()
    lab.setOrigin(200, 185)
    lab.boxAnchor = 'ne'
    lab.textAnchor = 'middle'
    lab.fontName = FONT_BOLD
    lab.fontSize = 10
    lab.setText('Projected Cumulative Cash Flow (5 Years)')
    drawing.add(lab)
    
    return drawing


def generate_pdf_report(
    data: ROIOutput,
    input_data: ROIInput = None,
    company_name: str = None,
    brand_color: str = None,
    logo_base64: str = None
) -> bytes:
    """
    Generate an enterprise-grade one-page PDF report.
    
    Branding options:
    - company_name: Custom company name (default: "AutomateROI")
    - brand_color: Hex color for title bar (default: "#2563eb")
    - logo_base64: Base64-encoded logo image (optional)
    """
    buffer = BytesIO()
    
    # Use custom branding or defaults
    display_name = company_name or "AutomateROI"
    title_color = colors.HexColor(brand_color) if brand_color else COLORS['brand']
    
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
    # Handle logo: either base64 image or text
    if logo_base64:
        try:
            from reportlab.platypus import Image
            from PIL import Image as PILImage
            import base64
            # Decode base64 and create image
            logo_data = base64.b64decode(logo_base64.split(',')[-1] if ',' in logo_base64 else logo_base64)
            logo_buffer = BytesIO(logo_data)
            
            # Get original dimensions and calculate scaled size
            pil_img = PILImage.open(BytesIO(logo_data))
            orig_width, orig_height = pil_img.size
            max_height = 0.5 * inch  # Max height in PDF
            
            # Preserve aspect ratio, only constrain by height
            scale = max_height / orig_height if orig_height > max_height * 72 / inch else 1
            pdf_width = (orig_width * scale / 72) * inch
            pdf_height = (orig_height * scale / 72) * inch
            
            logo_buffer.seek(0)
            logo_img = Image(logo_buffer, width=pdf_width, height=pdf_height)
            logo_img.hAlign = 'LEFT'
            logo_element = logo_img
        except Exception:
            # Fallback to text if image fails
            logo_element = Paragraph(
                f'<font name="{FONT_BOLD}" size="14" color="{brand_color or "#2563eb"}">{display_name}</font>', 
                ParagraphStyle('Logo', alignment=TA_LEFT)
            )
    else:
        logo_element = Paragraph(
            f'<font name="{FONT_BOLD}" size="14" color="{brand_color or "#2563eb"}">{display_name}</font>', 
            ParagraphStyle('Logo', alignment=TA_LEFT)
        )
    
    header_data = [[
        logo_element,
        Paragraph(f'<font name="{FONT}" size="8" color="#9ca3af">{datetime.now().strftime("%B %d, %Y")}</font>',
                  ParagraphStyle('Date', alignment=TA_RIGHT)),
    ]]
    header = Table(header_data, colWidths=[page_width * 0.5, page_width * 0.5])
    header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(header)
    
    # Title bar (uses custom brand color)
    title_table = Table([
        [Paragraph(f'<font name="{FONT_BOLD}" size="12" color="white">Automation ROI Report</font>',
                   ParagraphStyle('Title', alignment=TA_CENTER))],
        [Paragraph(f'<font name="{FONT}" size="9" color="#bfdbfe">{data.process_name.strip()}</font>',
                   ParagraphStyle('Sub', alignment=TA_CENTER))],
    ], colWidths=[page_width])
    title_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), title_color),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 8),
    ]))
    elements.append(title_table)
    elements.append(Spacer(1, 12))
    
    # ==================== SUMMARY & METRICS ====================
    section_style = ParagraphStyle('Section', fontName=FONT_BOLD, fontSize=9, textColor=COLORS['text_primary'], spaceAfter=8)
    
    # Summary Box
    exec_summary = getattr(data, 'executive_summary', {})
    
    if exec_summary:
        summary_para_style = ParagraphStyle(
            'SummaryPara',
            fontName=FONT,
            fontSize=8,
            leading=11,
            textColor=COLORS['text_primary'],
            spaceAfter=4
        )
        
        # Part 1: Is it worth it?
        is_worth_it = exec_summary.get('is_worth_it', '')
        if is_worth_it.startswith("Yes."):
            answer_color = "#3d8b6e"
            answer_text = "Yes"
            rest_text = is_worth_it[4:].strip()
        elif is_worth_it.startswith("Likely Yes."):
            answer_color = "#8b7355"
            answer_text = "Likely Yes"
            rest_text = is_worth_it[11:].strip()
        else:
            answer_color = "#9b6b6b"
            answer_text = "Needs Review"
            rest_text = is_worth_it.split(".", 1)[1].strip() if "." in is_worth_it else is_worth_it
            
        summary_content = [[
            Paragraph(
                f'<font name="{FONT_BOLD}" size="8" color="#374151">Recommendation: </font>'
                f'<font name="{FONT_BOLD}" size="9" color="{answer_color}">{answer_text}</font> '
                f'<font name="{FONT}" size="8" color="#374151">{rest_text}</font>',
                summary_para_style
            )
        ]]
        
        summary_table = Table(summary_content, colWidths=[page_width - 16])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('BOX', (0, 0), (-1, -1), 1, COLORS['brand_muted']),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 12))

    # Metric Cards
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
        kpi_card("Return on Investment", f"{data.roi_percentage:,.0f}%", "Year 1 ROI", "#4b7bd5"),
        kpi_card("Payback Period", f"{data.payback_months:.1f} months", "Time to break even", "#6b5b8c"),
    ]]
    kpi_table = Table(kpi_row, colWidths=[kpi_width, kpi_width, kpi_width])
    kpi_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 16))
    
    # ==================== COST ANALYSIS & PROJECTIONS ====================
    # Layout: Cost Table (Left) + Chart (Right)
    
    # Cost Table
    col1 = (page_width / 2) * 0.6
    col2 = (page_width / 2) * 0.3
    
    current_data = [
        ["Current State", ""],
        ["Labor Cost", f"${data.annual_labor_cost:,.0f}"],
        ["Error/SLA", f"${data.annual_error_cost + data.annual_sla_cost:,.0f}"],
        ["Total", f"${data.total_current_cost:,.0f}"],
    ]
    
    automated_data = [
        ["Future State", ""],
        ["Implementation", f"${data.implementation_cost:,.0f}"],
        ["Annual Maint.", f"${data.annual_automation_cost:,.0f}"],
        ["5-Year Net", f"${data.five_year_savings:,.0f}"],
    ]
    
    def make_cost_table(rows, header_bg):
        t = Table(rows, colWidths=[col1, col2])
        style_commands = [
            ('FONTNAME', (0, 0), (-1, -1), FONT),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (-1, 0), header_bg),
            ('TEXTCOLOR', (0, 0), (-1, 0), COLORS['white']),
            ('FONTNAME', (0, 0), (-1, 0), FONT_BOLD),
            ('BACKGROUND', (0, 1), (-1, -1), COLORS['surface']),
            ('GRID', (0, 0), (-1, -1), 0.5, COLORS['border']),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]
        t.setStyle(TableStyle(style_commands))
        return t
    
    left_column = [
        Paragraph("COST BREAKDOWN", section_style),
        make_cost_table(current_data, COLORS['header_bg']),
        Spacer(1, 8),
        make_cost_table(automated_data, COLORS['brand_muted'])
    ]
    
    # Chart (Right Side)
    chart = create_savings_chart(data, input_data)
    
    # Combine into a 2-column layout
    split_table = Table([
        [Table([[item] for item in left_column]), chart]
    ], colWidths=[page_width * 0.45, page_width * 0.55])
    
    split_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
    ]))
    
    elements.append(split_table)
    elements.append(Spacer(1, 16))
    
    # ==================== RECOMMENDATION ====================
    elements.append(Paragraph("STRATEGIC ADVICE", section_style))
    
    priority_bg = get_priority_bg(data.priority_score)
    priority_color = get_priority_color(data.priority_score)
    priority_hex = {'High': '#3d8b6e', 'Medium': '#8b7355', 'Low': '#9b6b6b'}.get(data.priority_score, '#4b5563')
    
    rec_text = data.recommendation.strip()
    # Less truncation now that we have space
    if len(rec_text) > 300:
        rec_text = rec_text[:297] + "..."
        
    rec_table = Table([[
        Paragraph(
            f'<font name="{FONT_BOLD}" size="10" color="{priority_hex}">Priority: {data.priority_score}</font><br/><br/>'
            f'<font name="{FONT}" size="9" color="#374151">{rec_text}</font>',
            ParagraphStyle('Rec', fontName=FONT, leading=11)
        ),
    ]], colWidths=[page_width])
    
    rec_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), priority_bg),
        ('BOX', (0, 0), (-1, -1), 1, priority_color),
        ('PADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(rec_table)
    
    # ==================== FOOTER ====================
    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=COLORS['border']))
    elements.append(Paragraph(
        f'<font name="{FONT}" size="6" color="#9ca3af">Report generated via AutomateROI | {datetime.now().year}</font>',
        ParagraphStyle('Footer', fontName=FONT, alignment=TA_CENTER, spaceBefore=4)
    ))
    
    # Build PDF
    doc.build(elements)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes

