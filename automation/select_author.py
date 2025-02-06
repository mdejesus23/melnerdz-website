def load_authors_from_file(file_path):
    authors = []
    try:
    
        import importlib.util
        spec = importlib.util.spec_from_file_location("authors_data", file_path)
        authors_data = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(authors_data)
      
        authors = authors_data.authors
    except FileNotFoundError:
        print("Error: The authors file was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

    return authors

def choose_author(authors):
    if not authors:
        print("No authors found.")
        return None

    # Try to find the author "Dobb Mayo"
    default_author = None
    default_index = None
    for i, author in enumerate(authors):
        if author['name'] == "Dobb Mayo":
            default_author = author
            default_index = i + 1  # Store the 1-based index
            break

    # Display the authors and pre-select the default author
    print("Choose an author:")
    for i, author in enumerate(authors, start=1):
        if i == default_index:
            print(f"{i}. {author['name']} (default)")  # Mark the default author
        else:
            print(f"{i}. {author['name']}")

    # Allow the user to press Enter to confirm the default or choose another author
    while True:
        try:
            choice = input(f"Enter the number corresponding to the author (default is {default_index}): ")
            
            # If the input is empty, return the default author
            if choice == "":
                print(f"Selected default author: {default_author['name']}")
                return default_author
            
            # Otherwise, return the selected author based on user input
            choice = int(choice)
            if 1 <= choice <= len(authors):
                return authors[choice - 1]
            else:
                print(f"Invalid choice. Please choose a number between 1 and {len(authors)}.")
        except ValueError:
            print("Please enter a valid number.")

