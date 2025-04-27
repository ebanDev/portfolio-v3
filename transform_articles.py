import os
import re
import shutil
import glob
from pathlib import Path

def clean_category(category_str):
    """Removes emojis and lowercases the category string."""
    # Basic emoji removal (might need refinement for broader emoji ranges)
    cleaned = re.sub(r'[^\w\s,-]', '', category_str).strip()
    return cleaned.lower()

def transform_article(filepath):
    """Transforms a single article file."""
    original_path = Path(filepath)
    original_name_no_ext = original_path.stem
    content_dir = original_path.parent

    print(f"Processing: {original_path.name}")

    try:
        with open(original_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"  Error reading file {original_path.name}: {e}")
        return

    header_data = {}
    content_lines = []
    in_header = True
    slug = None
    original_heading = None

    # Check and remove potential H1 heading
    if lines and lines[0].startswith('# '):
        original_heading = lines.pop(0).strip()
        # Skip potential blank line after heading
        if lines and lines[0].strip() == '':
            lines.pop(0)

    # Parse header key-values
    header_end_index = 0
    for i, line in enumerate(lines):
        line = line.strip()
        if not line: # End of header block
            header_end_index = i
            break
        match = re.match(r'^([\w\s]+):\s*(.*)$', line)
        if match:
            key = match.group(1).strip().lower()
            value = match.group(2).strip()
            header_data[key] = value
            if key == 'slug':
                slug = value
        else: # Line doesn't match key:value, assume end of header
            header_end_index = i
            break
    else: # If loop finishes without break, all lines were header
        header_end_index = len(lines)

    content_lines = lines[header_end_index:]

    if not slug:
        print(f"  Skipping {original_path.name}: No 'Slug' property found.")
        return

    # --- Prepare new content ---

    # Format front matter
    front_matter = ["---"]
    for key, value in header_data.items():
        if key == 'category':
            value = clean_category(value)
        front_matter.append(f"{key}: {value}")
    front_matter.append("---")
    new_front_matter_str = "\n".join(front_matter) + "\n\n" # Add extra newline

    # Update image paths in content
    original_image_folder_ref = f"{original_name_no_ext}/"
    new_image_folder_ref = f"{slug}/"
    new_content_str = "".join(content_lines)
    # Regex to find markdown images like ![](folder/name.png) or ![alt text](folder/name.png)
    new_content_str = re.sub(
        r'(!\[.*?\]\()' + re.escape(original_image_folder_ref),
        r'\1' + new_image_folder_ref,
        new_content_str
    )
     # Also handle simple image links like ![](folder/name.png) without alt text
    new_content_str = re.sub(
        r'(!\[\]\()' + re.escape(original_image_folder_ref),
        r'\1' + new_image_folder_ref,
        new_content_str
    )


    # --- Perform file/folder operations ---
    new_filename = content_dir / f"{slug}.md"
    original_image_folder = content_dir / original_name_no_ext
    new_image_folder = content_dir / slug

    # Check for conflicts before writing/renaming
    if new_filename.exists() and new_filename != original_path:
        print(f"  Skipping {original_path.name}: Target file {new_filename.name} already exists.")
        return
    if new_image_folder.exists() and new_image_folder != original_image_folder:
         # Check if it's a directory before complaining
        if new_image_folder.is_dir():
            print(f"  Warning: Target image folder {new_image_folder.name} already exists. Image paths updated, but folder not renamed.")
        else:
             print(f"  Skipping {original_path.name}: Target image folder name {new_image_folder.name} exists and is not a directory.")
             return


    # Write new file content (write first to avoid data loss if rename fails)
    try:
        with open(original_path if new_filename == original_path else new_filename, 'w', encoding='utf-8') as f:
            f.write(new_front_matter_str)
            f.write(new_content_str)
        print(f"  Content written to {new_filename.name}")
    except Exception as e:
        print(f"  Error writing to {new_filename.name}: {e}")
        # Attempt to revert or clean up might be needed here in a robust script
        return

    # Rename original file if slug changed filename
    if new_filename != original_path:
        try:
            os.remove(original_path)
            print(f"  Original file {original_path.name} removed.")
        except Exception as e:
            print(f"  Error removing original file {original_path.name}: {e}")
            # Potentially problematic state: new file exists, old file still exists

    # Rename image folder
    if original_image_folder.is_dir():
        if new_image_folder != original_image_folder:
            try:
                shutil.move(str(original_image_folder), str(new_image_folder))
                print(f"  Image folder renamed to {new_image_folder.name}")
            except Exception as e:
                print(f"  Error renaming image folder {original_image_folder.name} to {new_image_folder.name}: {e}")
        else:
             print(f"  Image folder name ({slug}) matches original. No rename needed.")
    else:
        print(f"  No image folder named '{original_name_no_ext}' found to rename.")


# --- Main Execution ---
articles_dir = Path('/home/eban/Projects/Dev/SESL/portfolio-v3/content/articles')
markdown_files = glob.glob(str(articles_dir / '*.md'))

if not markdown_files:
    print(f"No markdown files found in {articles_dir}")
else:
    print(f"Found {len(markdown_files)} markdown files. Starting transformation...")
    for md_file in markdown_files:
        transform_article(md_file)
    print("Transformation complete.")
