"""
pdf_generator.py - Generate PDF reports for ROI calculations

Uses ReportLab to create professional PDF documents.
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from io import BytesIO

from models import ROIOutput


def generate_pdf_report(data: ROIOutput) -> bytes:
    """
    Generate a PDF report from ROI calculation results.
    
    Args:
        data: The ROIOutput from the calculation
        
    Returns:
        PDF file as bytes
    """
    # Create a buffer to hold the PDF
    buffer = BytesIO()
    
    # Create the PDF document
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch)
    
    # Container for elements
    elements = []
    
    # Get styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=20
    )
    
    # Title
    elements.append(Paragraph("Automation ROI Report", title_style))
    elements.append(Paragraph(f"Process: {data.process_name}", styles['Heading2']))
    elements.append(Spacer(1, 20))
    
    # Key Metrics Table
    metrics_data = [
        ["Metric", "Value"],
        ["Annual Labor Cost", f"${data.annual_labor_cost:,.2f}"],
        ["Annual Savings", f"${data.annual_savings:,.2f}"],
        ["Payback Period", f"{data.payback_months} months"],
        ["ROI", f"{data.roi_percentage}%"],
        ["5-Year Savings", f"${data.five_year_savings:,.2f}"],
        ["Priority", data.priority_score],
    ]
    
    table = Table(metrics_data, colWidths=[3*inch, 2*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 30))
    
    # Recommendation
    elements.append(Paragraph("Recommendation", styles['Heading2']))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph(data.recommendation, styles['Normal']))
    
    # Build PDF
    doc.build(elements)
    
    # Get the PDF bytes
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes