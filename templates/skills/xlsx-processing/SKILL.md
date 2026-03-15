---
name: xlsx-processing
description: >
  Use when the user needs Excel file manipulation — reading, writing, formulas, charts,
  conditional formatting, data validation, pivot tables, or large file handling.
  Trigger conditions: create Excel reports programmatically, read spreadsheet data,
  add formulas or charts, apply conditional formatting, perform data validation,
  generate pivot tables, handle CSV import/export, process large datasets in Excel format.
---

# XLSX Processing

## Overview

Manipulate Excel files programmatically using openpyxl for rich formatting and pandas for data analysis. This skill covers reading/writing spreadsheets, formulas, charts, conditional formatting, data validation, pivot table generation, CSV import/export, and strategies for handling large files.

Apply this skill whenever Excel files need to be created, read, transformed, or enriched through code rather than manual editing.

## Multi-Phase Process

### Phase 1: Requirements

1. Determine operation (read, write, transform, report)
2. Identify data sources and volume
3. Define formatting and formula requirements
4. Plan sheet structure and naming
5. Assess performance needs (row count, file size)

> **STOP — Do NOT begin implementation until you know the row count and whether formatting is needed (this determines library choice).**

### Phase 2: Implementation

1. Select library (see decision table)
2. Implement data loading and transformation
3. Apply formatting, formulas, and validation
4. Add charts and conditional formatting
5. Optimize for file size and memory

> **STOP — Do NOT skip memory optimization for files exceeding 10,000 rows.**

### Phase 3: Validation

1. Open in Excel, LibreOffice, and Google Sheets
2. Verify formulas calculate correctly
3. Check formatting renders consistently
4. Test with edge cases (empty data, max rows)
5. Validate data accuracy

## Library Decision Table

| Scenario | Library | Why |
|---|---|---|
| Rich formatting (colors, borders, fonts) | openpyxl | Full formatting API |
| Data analysis, aggregation, pivots | pandas | DataFrame operations |
| Formatted report from data analysis | pandas + openpyxl | Combine strengths |
| Reading data only, no formatting needed | pandas | Simplest API |
| Large file (> 10K rows), write-heavy | openpyxl write_only | Streaming writes, low memory |
| Large file (> 10K rows), read-heavy | openpyxl read_only | Streaming reads, low memory |
| CSV to/from Excel conversion | pandas | One-liner operations |
| Charts in spreadsheet | openpyxl | Chart API with full control |

## openpyxl Patterns

### Creating a Workbook
```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.title = "Report"

# Header row
headers = ['Name', 'Department', 'Revenue', 'Target', 'Achievement']
header_font = Font(name='Calibri', size=11, bold=True, color='FFFFFF')
header_fill = PatternFill(start_color='2F5496', end_color='2F5496', fill_type='solid')
header_alignment = Alignment(horizontal='center', vertical='center')
thin_border = Border(
    left=Side(style='thin'),
    right=Side(style='thin'),
    top=Side(style='thin'),
    bottom=Side(style='thin'),
)

for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col, value=header)
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = header_alignment
    cell.border = thin_border

# Data rows
for row_idx, row_data in enumerate(data, 2):
    for col_idx, value in enumerate(row_data, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=value)
        cell.border = thin_border

# Auto-fit column widths
for col in range(1, len(headers) + 1):
    max_length = max(
        len(str(ws.cell(row=row, column=col).value or ''))
        for row in range(1, ws.max_row + 1)
    )
    ws.column_dimensions[get_column_letter(col)].width = min(max_length + 2, 50)

# Freeze header row
ws.freeze_panes = 'A2'

wb.save('report.xlsx')
```

### Formulas
```python
# Basic formulas
ws['E2'] = '=C2/D2'                    # Division
ws['F2'] = '=SUM(C2:C100)'             # Sum
ws['G2'] = '=AVERAGE(C2:C100)'         # Average
ws['H2'] = '=COUNTIF(E2:E100,">1")'   # Count if
ws['I2'] = '=IF(E2>=1,"Met","Below")'  # Conditional
ws['J2'] = '=VLOOKUP(A2,Sheet2!A:B,2,FALSE)'  # Lookup

# Array formula (Excel 365 dynamic array)
ws['K2'] = '=UNIQUE(A2:A100)'

# Named range
from openpyxl.workbook.defined_name import DefinedName
ref = f"Report!$C$2:$C${len(data)+1}"
defn = DefinedName('RevenueRange', attr_text=ref)
wb.defined_names.add(defn)
```

### Charts
```python
from openpyxl.chart import BarChart, LineChart, PieChart, Reference

# Bar chart
chart = BarChart()
chart.type = 'col'
chart.title = 'Revenue by Department'
chart.y_axis.title = 'Revenue ($)'
chart.x_axis.title = 'Department'
chart.style = 10  # Built-in style

data_ref = Reference(ws, min_col=3, min_row=1, max_row=ws.max_row)
cats_ref = Reference(ws, min_col=2, min_row=2, max_row=ws.max_row)
chart.add_data(data_ref, titles_from_data=True)
chart.set_categories(cats_ref)
chart.width = 20
chart.height = 12

ws.add_chart(chart, 'G2')

# Line chart with multiple series
line = LineChart()
line.title = 'Monthly Trends'
for col in range(3, 6):
    values = Reference(ws, min_col=col, min_row=1, max_row=13)
    line.add_data(values, titles_from_data=True)
cats = Reference(ws, min_col=1, min_row=2, max_row=13)
line.set_categories(cats)
ws.add_chart(line, 'G20')
```

### Conditional Formatting
```python
from openpyxl.formatting.rule import CellIsRule, ColorScaleRule, DataBarRule

# Highlight cells above threshold
ws.conditional_formatting.add(
    'C2:C100',
    CellIsRule(operator='greaterThan', formula=['100000'],
              fill=PatternFill(bgColor='C6EFCE'))
)

# Red for below target
ws.conditional_formatting.add(
    'E2:E100',
    CellIsRule(operator='lessThan', formula=['1'],
              fill=PatternFill(bgColor='FFC7CE'),
              font=Font(color='9C0006'))
)

# Color scale (green to red)
ws.conditional_formatting.add(
    'E2:E100',
    ColorScaleRule(
        start_type='min', start_color='F8696B',
        mid_type='percentile', mid_value=50, mid_color='FFEB84',
        end_type='max', end_color='63BE7B'
    )
)

# Data bars
ws.conditional_formatting.add(
    'C2:C100',
    DataBarRule(start_type='min', end_type='max', color='638EC6')
)
```

### Data Validation
```python
from openpyxl.worksheet.datavalidation import DataValidation

# Dropdown list
dv = DataValidation(type='list', formula1='"Active,Inactive,Pending"', allow_blank=True)
dv.error = 'Please select a valid status'
dv.errorTitle = 'Invalid Entry'
ws.add_data_validation(dv)
dv.add('D2:D100')

# Number range
nv = DataValidation(type='whole', operator='between', formula1=0, formula2=100)
nv.error = 'Value must be between 0 and 100'
ws.add_data_validation(nv)
nv.add('F2:F100')

# Date validation
dv_date = DataValidation(type='date', operator='greaterThan', formula1='2025-01-01')
ws.add_data_validation(dv_date)
dv_date.add('G2:G100')
```

## pandas Patterns

### Reading Excel
```python
import pandas as pd

# Read single sheet
df = pd.read_excel('data.xlsx', sheet_name='Sheet1')

# Read with options
df = pd.read_excel('data.xlsx',
    sheet_name='Sales',
    header=0,
    usecols='A:E',
    dtype={'ID': str, 'Revenue': float},
    parse_dates=['Date'],
    na_values=['N/A', 'null', ''],
)

# Read all sheets
sheets = pd.read_excel('data.xlsx', sheet_name=None)  # Dict of DataFrames
```

### Writing Excel with pandas + openpyxl
```python
with pd.ExcelWriter('output.xlsx', engine='openpyxl') as writer:
    df_summary.to_excel(writer, sheet_name='Summary', index=False)
    df_detail.to_excel(writer, sheet_name='Detail', index=False)

    # Access openpyxl workbook for formatting
    wb = writer.book
    ws = wb['Summary']
    # Apply formatting...
```

### Pivot Tables
```python
# Create pivot table
pivot = pd.pivot_table(
    df,
    values='Revenue',
    index='Department',
    columns='Quarter',
    aggfunc='sum',
    margins=True,
    margins_name='Total'
)

# Write to Excel with formatting
pivot.to_excel(writer, sheet_name='Pivot')
```

## CSV Import/Export

```python
# CSV to XLSX
df = pd.read_csv('data.csv', encoding='utf-8-sig')
df.to_excel('output.xlsx', index=False)

# XLSX to CSV
df = pd.read_excel('data.xlsx')
df.to_csv('output.csv', index=False, encoding='utf-8-sig')

# Handle encoding issues
df = pd.read_csv('data.csv', encoding='latin-1')  # or 'cp1252'
```

## Large File Handling

### Memory-Efficient Reading
```python
# openpyxl read-only mode
from openpyxl import load_workbook

wb = load_workbook('large_file.xlsx', read_only=True)
ws = wb.active

for row in ws.iter_rows(min_row=2, values_only=True):
    process_row(row)

wb.close()
```

### Chunked Writing
```python
# Write large datasets in chunks
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows

wb = Workbook(write_only=True)
ws = wb.create_sheet()

# Write header
ws.append(headers)

# Write in chunks
chunk_size = 10000
for chunk in pd.read_csv('large.csv', chunksize=chunk_size):
    for row in dataframe_to_rows(chunk, index=False, header=False):
        ws.append(row)

wb.save('output.xlsx')
```

### Performance Decision Table

| Rows | Strategy | Notes |
|---|---|---|
| < 10,000 | Standard openpyxl or pandas | Full formatting available |
| 10K - 100K | write_only / read_only mode, chunked | Limited formatting in write_only |
| 100K - 1M | write_only mode, consider CSV instead | Near Excel row limit |
| > 1M | Use CSV or Parquet, not XLSX | Excel limit: 1,048,576 rows |

## Anti-Patterns / Common Mistakes

| Anti-Pattern | Why It Fails | What To Do Instead |
|---|---|---|
| openpyxl for pure data analysis | Verbose and slow for analytics | Use pandas for data operations |
| Loading large files into memory | Memory exhaustion, crashes | Use read_only / write_only modes |
| Hardcoding row/column numbers | Breaks when data shape changes | Calculate from data length |
| Inconsistent date formats | Dates render as numbers or strings | Set number_format explicitly |
| Not closing read_only workbooks | Resource leaks | Always call `wb.close()` or use context manager |
| Using .xls format | Legacy, limited, security risks | Always use .xlsx |
| Formatting cells one by one | Extremely slow for large ranges | Apply styles to ranges or use named styles |
| Not testing in actual Excel | Features render differently | Test in Excel, LibreOffice, and Google Sheets |
| Forgetting to freeze header row | Poor UX when scrolling large data | Always freeze panes for data sheets |

## Anti-Rationalization Guards

- Do NOT use openpyxl for data analysis that pandas handles in one line.
- Do NOT skip the row count assessment -- it determines your entire approach.
- Do NOT assume standard mode works for files over 10K rows -- use streaming modes.
- Do NOT test only in one spreadsheet application -- formatting varies.
- Do NOT forget to close workbooks opened in read_only mode.

## Integration Points

| Skill | How It Connects |
|---|---|
| `pdf-processing` | Excel data feeds into PDF report generation |
| `docx-processing` | Excel data populates Word document tables |
| `email-composer` | Generated spreadsheets attach to professional emails |
| `file-organizer` | Output file naming and directory structure conventions |
| `database-schema-design` | Database exports to Excel for reporting |
| `deployment` | Automated report generation in CI/CD pipelines |

## Skill Type

**FLEXIBLE** — Choose openpyxl for rich formatting and pandas for data analysis. Combine both when you need formatted reports from data analysis. Adapt file handling strategy to data volume.
