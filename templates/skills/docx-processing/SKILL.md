---
name: docx-processing
description: When the user needs Word document generation, template filling, formatting, mail merge, or DOCX manipulation using python-docx or docxtpl.
---

# DOCX Processing

## Overview

Generate, manipulate, and template Word documents programmatically. This skill covers python-docx for direct document creation, docxtpl for Jinja2-based template filling, formatting control (headings, tables, images, headers/footers), mail merge operations, style management, and conversion strategies.

## Process

### Phase 1: Requirements
1. Determine if creating from scratch or filling a template
2. Identify document structure (sections, headers, tables, images)
3. Define data sources (JSON, CSV, database, API)
4. Plan styling requirements (fonts, colors, margins)
5. Determine output format (DOCX, PDF conversion needed)

### Phase 2: Implementation
1. Set up document template or create from scratch
2. Implement data binding and content generation
3. Apply formatting and styles
4. Add headers, footers, and page numbers
5. Handle images and embedded objects

### Phase 3: Validation
1. Verify document renders correctly in Word/LibreOffice
2. Check formatting consistency across pages
3. Validate data accuracy in generated documents
4. Test with edge cases (long text, missing data, special characters)
5. Verify PDF conversion if required

## python-docx Patterns

### Document Creation
```python
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = Document()

# Set default font
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(11)

# Add heading
doc.add_heading('Monthly Report', level=0)

# Add paragraph with formatting
para = doc.add_paragraph()
run = para.add_run('Important: ')
run.bold = True
run.font.color.rgb = RGBColor(0xCC, 0x00, 0x00)
para.add_run('This section requires attention.')

# Add table
table = doc.add_table(rows=1, cols=3, style='Light Grid Accent 1')
hdr_cells = table.rows[0].cells
hdr_cells[0].text = 'Name'
hdr_cells[1].text = 'Department'
hdr_cells[2].text = 'Revenue'

for name, dept, rev in data:
    row_cells = table.add_row().cells
    row_cells[0].text = name
    row_cells[1].text = dept
    row_cells[2].text = f'${rev:,.2f}'

# Add image
doc.add_picture('chart.png', width=Inches(5.5))

# Save
doc.save('report.docx')
```

### Headers and Footers
```python
from docx.enum.section import WD_ORIENT

section = doc.sections[0]

# Page setup
section.page_width = Cm(21)
section.page_height = Cm(29.7)
section.left_margin = Cm(2.5)
section.right_margin = Cm(2.5)
section.top_margin = Cm(2.5)
section.bottom_margin = Cm(2.5)

# Header
header = section.header
header_para = header.paragraphs[0]
header_para.text = 'Company Name — Confidential'
header_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
header_para.style.font.size = Pt(9)
header_para.style.font.color.rgb = RGBColor(0x88, 0x88, 0x88)

# Footer with page numbers
footer = section.footer
footer_para = footer.paragraphs[0]
footer_para.alignment = WD_ALIGN_PARAGRAPH.CENTER

# Add page number field
from docx.oxml.ns import qn
run = footer_para.add_run()
fldChar = OxmlElement('w:fldChar')
fldChar.set(qn('w:fldCharType'), 'begin')
run._r.append(fldChar)

run2 = footer_para.add_run()
instrText = OxmlElement('w:instrText')
instrText.set(qn('xml:space'), 'preserve')
instrText.text = ' PAGE '
run2._r.append(instrText)

run3 = footer_para.add_run()
fldChar2 = OxmlElement('w:fldChar')
fldChar2.set(qn('w:fldCharType'), 'end')
run3._r.append(fldChar2)
```

### Table Formatting
```python
from docx.shared import Cm, Pt
from docx.oxml.ns import nsdecls
from docx.oxml import parse_xml

# Set column widths
table.columns[0].width = Cm(4)
table.columns[1].width = Cm(6)
table.columns[2].width = Cm(3)

# Cell shading
for cell in table.rows[0].cells:
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="2F5496"/>')
    cell._tc.get_or_add_tcPr().append(shading)
    for paragraph in cell.paragraphs:
        for run in paragraph.runs:
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            run.font.bold = True

# Cell alignment
for row in table.rows:
    for cell in row.cells:
        cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
```

## docxtpl Template Patterns

### Template Syntax (Jinja2)
```
Template file (template.docx) contains:

{{ company_name }}
Date: {{ report_date }}

Dear {{ recipient_name }},

{% for item in items %}
- {{ item.name }}: ${{ item.price }}
{% endfor %}

Total: ${{ total }}

{%if urgent %}
URGENT: This requires immediate attention.
{%endif %}
```

### Template Rendering
```python
from docxtpl import DocxTemplate, InlineImage
from docx.shared import Mm

tpl = DocxTemplate('template.docx')

context = {
    'company_name': 'Acme Corp',
    'report_date': '2025-03-15',
    'recipient_name': 'Alice Johnson',
    'items': [
        {'name': 'Widget A', 'price': '29.99'},
        {'name': 'Widget B', 'price': '49.99'},
    ],
    'total': '79.98',
    'urgent': True,
    'chart': InlineImage(tpl, 'chart.png', width=Mm(120)),
}

tpl.render(context)
tpl.save('output.docx')
```

### Rich Text in Templates
```python
from docxtpl import RichText

rt = RichText()
rt.add('Normal text ')
rt.add('bold text', bold=True)
rt.add(' and ')
rt.add('red text', color='FF0000')
rt.add(' with ')
rt.add('a link', url_id=tpl.build_url_id('https://example.com'))

context = {'formatted_text': rt}
```

### Tables in Templates
```
Template table row with loop:
{% tr for row in table_data %}
{{ row.name }} | {{ row.value }} | {{ row.status }}
{% endtr %}
```

## Mail Merge

```python
from docxtpl import DocxTemplate
import csv

template = DocxTemplate('letter_template.docx')

with open('recipients.csv') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader):
        context = {
            'name': row['name'],
            'address': row['address'],
            'amount': row['amount'],
            'due_date': row['due_date'],
        }
        template.render(context)
        template.save(f'letters/letter_{i:04d}_{row["name"]}.docx')
        template = DocxTemplate('letter_template.docx')  # Re-load for next iteration
```

## Style Management

### Custom Styles
```python
from docx.enum.style import WD_STYLE_TYPE

# Create custom paragraph style
style = doc.styles.add_style('CustomHeading', WD_STYLE_TYPE.PARAGRAPH)
style.font.name = 'Arial'
style.font.size = Pt(16)
style.font.bold = True
style.font.color.rgb = RGBColor(0x2F, 0x54, 0x96)
style.paragraph_format.space_before = Pt(12)
style.paragraph_format.space_after = Pt(6)

# Apply custom style
doc.add_paragraph('Section Title', style='CustomHeading')
```

### Style Inheritance
```
Normal → Heading 1 → Heading 2 → ...
Normal → Body Text → List Paragraph
Normal → Table Normal → Table Grid
```

## Conversion Strategies

### DOCX to PDF
```python
# Option 1: LibreOffice (most reliable, server-friendly)
import subprocess
subprocess.run([
    'libreoffice', '--headless', '--convert-to', 'pdf',
    '--outdir', output_dir, input_file
])

# Option 2: docx2pdf (Windows/macOS with Word installed)
from docx2pdf import convert
convert('input.docx', 'output.pdf')

# Option 3: python-pptx + reportlab (for full control)
# Generate PDF directly with reportlab instead of converting
```

## Error Handling

```python
def safe_generate_document(template_path, context, output_path):
    try:
        tpl = DocxTemplate(template_path)
        tpl.render(context)
        tpl.save(output_path)
        return True
    except jinja2.UndefinedError as e:
        print(f"Missing template variable: {e}")
        return False
    except Exception as e:
        print(f"Document generation failed: {e}")
        return False
```

## Quality Checklist

- [ ] Document opens correctly in Word, LibreOffice, and Google Docs
- [ ] Fonts render consistently (use common system fonts)
- [ ] Tables fit within page margins
- [ ] Images are properly sized and positioned
- [ ] Headers/footers appear on all pages
- [ ] Page numbers are correct
- [ ] Special characters render properly (Unicode)
- [ ] Empty/missing data handled gracefully (no blank lines)
- [ ] Long text wraps properly in table cells

## Anti-Patterns

- Hardcoding font sizes in points instead of using styles
- Not handling missing template variables
- Generating huge tables without pagination consideration
- Using absolute image paths (breaks portability)
- Not testing with different Word versions
- Modifying python-docx XML directly when API methods exist
- Creating documents without styles (all direct formatting)

## Skill Type

**FLEXIBLE** — Choose between python-docx (programmatic) and docxtpl (template-based) based on document complexity. Simple reports may not need templates; complex recurring documents benefit from templates.
