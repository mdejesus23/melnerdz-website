from pathlib import Path
import frontmatter

def update_related_posts():

    # Use pathlib to find all index.mdx files recursively
    base_directory = Path("./src/content/blog/en")
    files = list(base_directory.rglob("index.mdx"))

    print("Running Script >>>")
    for file in files:
        related_posts = []
        
        # Read the content of the current file
        with file.open("r", encoding="utf-8") as f:
            content = f.read()

        # Parse the file using frontmatter
        post = frontmatter.loads(content)
        frontmatter_data = post.metadata
        current_file_slug = frontmatter_data.get('slug', '')

        for other_file in files:
            if file == other_file:
                continue  # Skip comparing the same file with itself
            
            # Read the content of the other file
            with other_file.open("r", encoding="utf-8") as f:
                other_content = f.read()

            # Parse other files
            other_post = frontmatter.loads(other_content)
            other_frontmatter_data = other_post.metadata
            other_file_slug = other_frontmatter_data.get('slug', '')

            # Check for related posts based on common tags
            if current_file_slug != other_file_slug and 'tags' in other_frontmatter_data and 'tags' in frontmatter_data:
                common_tags = set(frontmatter_data['tags']) & set(other_frontmatter_data['tags'])
                if common_tags:
                    related_posts.append(other_frontmatter_data['slug'])

        # Only update if there are related posts
        frontmatter_data['relatedPosts'] = related_posts if len(related_posts) >= 1 else []

        # Rebuild the file content with updated frontmatter
        post.metadata = frontmatter_data
        updated_file_contents = frontmatter.dumps(post)

        print(f"{frontmatter_data.get('title', 'Untitled')}:")
        print(f">>> {len(related_posts)} related articles found.")
        print(">>> Updating Article Contents")

        # Write the updated content back to the file
        with file.open("w", encoding="utf-8") as f:
            f.write(updated_file_contents)

# Run the script: ensures that certain parts of the script (such as executing a function) only run when the script is executed directly, not when it's imported into another script.
if __name__ == "__main__":
    update_related_posts()
