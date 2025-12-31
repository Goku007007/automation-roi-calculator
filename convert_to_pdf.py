"""
Convert markdown documentation to PDF
"""
import markdown
from weasyprint import HTML, CSS
import os

# Read the markdown file
with open('automation-roi-calculator-doc.md', 'r') as f:
    md_content = f.read()

# Convert markdown to HTML
html_content = markdown.markdown(md_content, extensions=['tables', 'fenced_code', 'toc'])

# Create full HTML with styling
full_html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {{
            size: A4;
            margin: 2cm;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            font-size: 11pt;
        }}
        h1 {{
            color: #1e40af;
            font-size: 28pt;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
            margin-top: 30px;
        }}
        h2 {{
            color: #1e293b;
            font-size: 18pt;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-top: 25px;
        }}
        h3 {{
            color: #3b82f6;
            font-size: 14pt;
            margin-top: 20px;
        }}
        h4 {{
            color: #64748b;
            font-size: 12pt;
            margin-top: 15px;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }}
        th {{
            background-color: #3b82f6;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: 600;
        }}
        td {{
            border: 1px solid #e2e8f0;
            padding: 8px 10px;
            background-color: #f8fafc;
        }}
        tr:nth-child(even) td {{
            background-color: #ffffff;
        }}
        code {{
            background-color: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', Consolas, monospace;
            font-size: 10pt;
        }}
        pre {{
            background-color: #1e293b;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 9pt;
        }}
        pre code {{
            background-color: transparent;
            padding: 0;
            color: inherit;
        }}
        blockquote {{
            border-left: 4px solid #3b82f6;
            margin: 15px 0;
            padding: 10px 20px;
            background-color: #eff6ff;
            color: #1e40af;
        }}
        img {{
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin: 15px 0;
        }}
        hr {{
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 30px 0;
        }}
        a {{
            color: #3b82f6;
            text-decoration: none;
        }}
        ul, ol {{
            margin: 10px 0;
            padding-left: 25px;
        }}
        li {{
            margin: 5px 0;
        }}
        .toc {{
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
{html_content}
</body>
</html>
"""

# Write to PDF
HTML(string=full_html, base_url=os.getcwd()).write_pdf('automation-roi-calculator-doc.pdf')

print("PDF created: automation-roi-calculator-doc.pdf")
