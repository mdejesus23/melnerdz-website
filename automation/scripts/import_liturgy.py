"""
Import Liturgy of Hours EPUB content into MongoDB.

Parses the EPUB file, extracts content organized by Table of Contents (index files),
cleans the HTML, and saves each entry to the 'liturgyofhours' collection.

Usage:
    pip install pymongo beautifulsoup4 python-dotenv
    python3 scripts/import_liturgy.py
"""

import os
import re
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

from bs4 import BeautifulSoup, Comment
from dotenv import load_dotenv
from pymongo import MongoClient

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

EPUB_PATH = os.path.join(
    os.path.dirname(__file__), '..', 'liturgy-of-hours_oowx8l (1).epub'
)

# Season index files mapped to season names
SEASON_INDEX_FILES = {
    '1.advent.htm': 'Advent',
    '2.Christmas. index.htm': 'Christmas',
    '3.Lent. index.htm': 'Lent',
    '4.Paschal. index.htm': 'Paschal Time',
    '5.Ordinary 1_10. index.htm': 'Ordinary Time 1-10',
    '6.Ordinary 11_20. index.htm': 'Ordinary Time 11-20',
    '7.Ordinary 21_34. index.htm': 'Ordinary Time 21-34',
}


def get_mongo_uri():
    user = os.getenv('MONGO_USER')
    password = os.getenv('MONGO_PASSWORD')
    if not user or not password:
        raise RuntimeError('MONGO_USER and MONGO_PASSWORD must be set in .env')
    return (
        f'mongodb+srv://{user}:{password}@cluster0.v38num2.mongodb.net/'
        f'preparation?retryWrites=true&w=majority&appName=Cluster0'
    )


def clean_html(raw_html):
    """Strip MS Word junk from HTML, return clean HTML string."""
    soup = BeautifulSoup(raw_html, 'html.parser')

    # Remove HTML comments (MS Office conditional comments)
    for comment in soup.find_all(string=lambda t: isinstance(t, Comment)):
        comment.extract()

    # Remove <style> and <script> tags
    for tag in soup.find_all(['style', 'script', 'meta', 'link', 'object']):
        tag.decompose()

    # Remove MS Office specific tags (o:*, w:*, v:*, st1:*)
    for tag in soup.find_all(True):
        # Remove tags with MS Office namespaces
        if tag.name and ':' in tag.name:
            tag.unwrap()

    # Remove all class/style/lang attributes and MS-specific attrs
    remove_attrs = [
        'class', 'style', 'lang', 'link', 'vlink', 'xmlns', 'xmlns:v',
        'xmlns:o', 'xmlns:w', 'xmlns:st1', 'w:st',
    ]
    for tag in soup.find_all(True):
        for attr in remove_attrs:
            tag.attrs.pop(attr, None)
        # Remove any mso-* or xmlns:* attributes
        attrs_to_remove = [
            k for k in tag.attrs if k.startswith(('mso-', 'xmlns:'))
        ]
        for attr in attrs_to_remove:
            del tag.attrs[attr]

    # Get the body content (or full content if no body)
    body = soup.find('body')
    if body:
        content = body.decode_contents()
    else:
        content = str(soup)

    # Remove the head/html wrapper if present
    content = re.sub(r'</?html[^>]*>', '', content)
    content = re.sub(r'<head>.*?</head>', '', content, flags=re.DOTALL)

    # Clean up excessive whitespace but preserve structure
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    content = content.strip()

    return content


def find_split_files(zf, base_src):
    """Given a TOC source like 'V1AD01.sun_split_000.htm', find all split files."""
    all_files = zf.namelist()

    # If the file doesn't have _split_, it's a single file
    if '_split_' not in base_src:
        if base_src in all_files:
            return [base_src]
        return []

    # Extract the base name before _split_
    base = base_src.rsplit('_split_', 1)[0]
    pattern = re.compile(re.escape(base) + r'_split_\d+\.htm')

    matches = sorted([f for f in all_files if pattern.match(f)])
    return matches


def parse_index_entries(zf, index_file):
    """Parse a season index file to extract (title, src_file) pairs."""
    raw = zf.read(index_file).decode('utf-8')
    # Remove HTML comments
    raw = re.sub(r'<!--.*?-->', '', raw, flags=re.DOTALL)

    entries = []
    seen_srcs = set()

    # Find all <a href="...">text</a> links
    for match in re.finditer(
        r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', raw, re.DOTALL
    ):
        href = match.group(1)
        text = match.group(2)

        # Clean the text of inner HTML tags
        text = re.sub(r'<[^>]+>', '', text).strip()
        text = re.sub(r'\s+', ' ', text)

        # URL decode the href
        href = href.replace('%20', ' ')

        # Skip duplicate entries (some index files link same file multiple times)
        if href in seen_srcs:
            continue
        seen_srcs.add(href)

        if href and text:
            entries.append((text, href))

    return entries


def main():
    if not os.path.exists(EPUB_PATH):
        print(f'EPUB file not found: {EPUB_PATH}')
        return

    zf = zipfile.ZipFile(EPUB_PATH)
    all_files = set(zf.namelist())

    # Build documents from all season index files
    documents = []
    order = 0

    for index_file, season_name in SEASON_INDEX_FILES.items():
        if index_file not in all_files:
            print(f'Warning: Index file {index_file} not found in EPUB')
            continue

        entries = parse_index_entries(zf, index_file)
        print(f'\n{season_name}: {len(entries)} entries')

        for title, src_file in entries:
            order += 1
            split_files = find_split_files(zf, src_file)

            if not split_files:
                print(f'  Warning: No files found for "{title}" ({src_file})')
                continue

            # Combine content from all split files
            combined_html = ''
            for sf in split_files:
                raw = zf.read(sf).decode('utf-8')
                cleaned = clean_html(raw)
                if cleaned:
                    combined_html += cleaned + '\n'

            combined_html = combined_html.strip()

            if not combined_html:
                print(f'  Warning: Empty content for "{title}"')
                continue

            doc = {
                'season': season_name,
                'title': title,
                'order': order,
                'htmlContent': combined_html,
                'sourceFiles': split_files,
                'createdAt': datetime.now(timezone.utc),
            }
            documents.append(doc)
            print(f'  [{order}] {title} ({len(split_files)} files)')

    if not documents:
        print('\nNo documents extracted. Aborting.')
        return

    print(f'\n--- Total documents to insert: {len(documents)} ---')

    # Connect to MongoDB and insert
    uri = get_mongo_uri()
    client = MongoClient(uri)
    db = client['preparation']
    collection = db['liturgyofhours']

    # Drop existing collection to avoid duplicates on re-run
    existing = collection.count_documents({})
    if existing > 0:
        print(f'Dropping existing collection ({existing} documents)...')
        collection.drop()

    result = collection.insert_many(documents)
    print(f'Inserted {len(result.inserted_ids)} documents into liturgyofhours')

    # Create indexes
    collection.create_index('season')
    collection.create_index('order')
    print('Created indexes on season and order')

    client.close()
    print('Done!')


if __name__ == '__main__':
    main()
