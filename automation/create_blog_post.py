import os
import re
from pathlib import Path
from datetime import datetime
import shutil

from related_posts import update_related_posts
from authors_lists import extract_authors_to_python_file
from select_author import load_authors_from_file, choose_author

# Define paths using pathlib
BASE_BLOG_DIRECTORY = Path("src/content/blog/en")
AUTHORS_DIRECTORY = Path("src/data_files/authors.ts")
input_file_path = Path("src/data_files/authors.ts")
output_file_path = Path("src/data_files/authors_data.py")
default_image_source_path = "src/assets/images/dummy.jpg" # Default image directory copy this and save it in the same directory of created mdx file


def generate_slug(title):
    slug = title.lower()
    # Replace spaces with hyphens and remove non-alphanumeric characters (except hyphens)
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace spaces and consecutive hyphens with a single hyphen
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

def generate_mdx_content(title, author, pub_date, slug):
    if not pub_date:
        pub_date = datetime.now().strftime("%Y-%m-%d")

    frontmatter = f"""---
title: '{title}'
author: {author}
pubDate: {pub_date}
description: ''
discussionId: ''
slug: {slug}
cardImage: 'dummy.jpg'
cardImageAlt: ''
tags: 
- tag1
relatedPosts: []
---

"""
    return frontmatter

def create_mdx_file():
    # Load the list of authors from the authors data file
    authors_list = load_authors_from_file(output_file_path)

    # Let the user choose an author from the list
    print("Authors loaded:", authors_list) 
    selected_author = choose_author(authors_list)
    if not selected_author:
        print("No valid author selected. Exiting.")
        return
    else:
        print(f"Selected author: {selected_author['name']}")

    title = input("Enter the title of the post: ")
    pub_date = input("Enter the publication date (YYYY-MM-DD) or leave blank for the current date: ").strip()
    slug = generate_slug(title)

    # If pub_date is empty, use the current date
    if not pub_date:
        pub_date = datetime.now().strftime("%Y-%m-%d")

    # Generate MDX content
    mdx_content = generate_mdx_content(title, selected_author['name'], pub_date, slug)

    # Extract year and month from the publication date
    pub_date_obj = datetime.strptime(pub_date, "%Y-%m-%d")
    year = pub_date_obj.year
    month = pub_date_obj.month

    # Create the dynamic file path
    file_path = os.path.join(BASE_BLOG_DIRECTORY, str(year), f"{month:02d}", slug, "index.mdx")
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Write the content to the generated path
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(mdx_content)

   # Get the directory path where the MDX file was created
    image_destination_path = os.path.join(os.path.dirname(file_path), "dummy.jpg")

    # Copy the default image to the same directory
    shutil.copy(default_image_source_path, image_destination_path)

    print(f"Blog post created: {file_path}")


try:
    # Step 1: Extract authors from TypeScript file into a Python file
    print("Extracting authors data...")
    extract_authors_to_python_file(input_file_path, output_file_path)

    # Step 2: Create the MDX file for the new blog post
    create_mdx_file()

    # Step 3: Update related posts after creating the new post
    update_related_posts()
    
except Exception as e:
    print("Error occurred:", e)
    print("Exiting the script.")
    exit()