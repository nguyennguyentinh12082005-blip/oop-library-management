import docx
from docx.document import Document
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl
from docx.table import Table
from docx.text.paragraph import Paragraph
import sys

def iter_block_items(parent):
    """
    Iterate through the paragraphs and tables in order of appearance.
    """
    if isinstance(parent, Document):
        parent_elm = parent.element.body
    elif isinstance(parent, docx.table._Cell):
        parent_elm = parent._tc
    else:
        raise ValueError("Unknown parent type")

    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)

def format_run(run):
    """
    Apply bold and italic formatting to a run, preserving spaces.
    """
    text = run.text
    if not text:
        return ""
    
    bold = run.bold
    italic = run.italic
    
    if not (bold or italic):
        return text
        
    stripped = text.strip()
    if not stripped:
        return text
        
    formatted = stripped
    if bold:
        formatted = f"**{formatted}**"
    if italic:
        formatted = f"*{formatted}*"
        
    # Re-attach leading and trailing whitespace
    l_spaces = text[:len(text) - len(text.lstrip())]
    r_spaces = text[len(text) - len(text.rstrip()):]
    
    return l_spaces + formatted + r_spaces

def convert_paragraph(p):
    """
    Convert a paragraph to markdown formatting based on its style.
    """
    text = ""
    for run in p.runs:
        text += format_run(run)
        
    style = p.style.name if p.style else ""
    
    # Identify headings
    if style.startswith("Heading 1"):
        return f"# {text}\n\n"
    elif style.startswith("Heading 2"):
        return f"## {text}\n\n"
    elif style.startswith("Heading 3"):
        return f"### {text}\n\n"
    elif style.startswith("Heading 4"):
        return f"#### {text}\n\n"
    elif style.startswith("Heading 5"):
        return f"##### {text}\n\n"
    elif style.startswith("Heading 6"):
        return f"###### {text}\n\n"
        
    # Identify lists
    if style.startswith("List Bullet"):
        return f"- {text}\n"
    elif style.startswith("List Number"):
        return f"1. {text}\n"
        
    if not text.strip():
        return "\n"
        
    return f"{text}\n\n"

def convert_table(table):
    """
    Convert a table to a markdown table.
    """
    markdown_table = []
    
    for row_idx, row in enumerate(table.rows):
        row_cells = []
        for cell in row.cells:
            cell_text = ""
            for p in cell.paragraphs:
                p_text = ""
                for run in p.runs:
                    p_text += format_run(run)
                if p_text.strip():
                    cell_text += p_text + "<br>"
            if cell_text.endswith("<br>"):
                cell_text = cell_text[:-4]
            cell_text = cell_text.strip().replace('\n', '<br>')
            row_cells.append(cell_text)
            
        markdown_table.append("| " + " | ".join(row_cells) + " |")
        
        # Add heading separator
        if row_idx == 0:
            dividers = ["---"] * len(row.cells)
            markdown_table.append("| " + " | ".join(dividers) + " |")
            
    return "\n" + "\n".join(markdown_table) + "\n\n"

def docx_to_markdown(docx_path, md_path):
    doc = docx.Document(docx_path)
    md_content = ""
    in_list = False
    
    for item in iter_block_items(doc):
        if isinstance(item, Paragraph):
            style = item.style.name if item.style else ""
            is_list_item = style.startswith("List")
            
            # Formatting line breaks for lists
            if in_list and not is_list_item:
                md_content += "\n"
                in_list = False
            elif not in_list and is_list_item:
                in_list = True
                
            md_content += convert_paragraph(item)
        elif isinstance(item, Table):
            if in_list:
                md_content += "\n"
                in_list = False
            md_content += convert_table(item)
            
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

if __name__ == "__main__":
    import os
    docx_file = r"e:\LTHDT_OOP\TL CK\OOP_T6_N13.docx"
    md_file = r"e:\LTHDT_OOP\TL CK\OOP_T6_N13.md"
    
    if os.path.exists(docx_file):
        docx_to_markdown(docx_file, md_file)
        print(f"Successfully converted: {docx_file} -> {md_file}")
    else:
        print(f"Error: {docx_file} does not exist.")
