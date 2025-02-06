import re
from pathlib import Path

# Function to parse the TypeScript authors array and convert it to JSON or a Python list
def extract_authors_to_python_file(input_file_path, output_file_path):
    authors_list = []
    try:
        with open(input_file_path, "r", encoding="utf-8") as file:
            content = file.read()

        # Use regex to match individual author objects
        author_matches = re.findall(r'\{\s*name: "(.*?)",\s*slug: "(.*?)",.*?bio: "(.*?)",.*?\}', content, re.S)

        # Build a Python list of author dictionaries
        for match in author_matches:
            author_data = {
                "name": match[0],
                "slug": match[1],
                "bio": match[2]
            }
            authors_list.append(author_data)

        # Write the Python list to a new .py file
        with open(output_file_path, "w", encoding="utf-8") as output_file:
            output_file.write("authors = [\n")
            for author in authors_list:
                output_file.write(f"  {repr(author)},\n")
            output_file.write("]\n")

        print(f"Authors data successfully written to {output_file_path}")

    except FileNotFoundError:
        print("Error: The input file was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

