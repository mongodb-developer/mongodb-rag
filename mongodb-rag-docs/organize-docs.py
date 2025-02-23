import os
import shutil
import json

# Define the mapping of old files to new structured directories
structure = {
    "10-introduction": [
        ("intro.md", "1-overview.mdx"),
        ("installation.md", "2-prerequisites.mdx")
    ],
    "20-mongodb-atlas": [
        ("setup-mongodb.md", "1-what-is-mongodb.mdx"),
        ("20-mongodb-atlas/1-what-is-mongodb.mdx", "2-create-account.mdx"),
        ("20-mongodb-atlas/2-create-account.mdx", "3-create-cluster.mdx"),
    ],
    "30-rag-concepts": [
        ("rag-concepts.md", "1-intro.mdx"),
        ("understanding-hybrid-search.md", "2-how-rag-works.mdx")
    ],
    "40-mongodb-rag": [
        ("create-rag-app.md", "1-introduction.mdx"),
        ("setup-mongodb.md", "2-setup-mongodb.mdx"),
        ("create-embeddings.md", "3-create-embeddings.mdx")
    ],
    "50-build-rag-app": [
        ("build-rag-app.md", "1-introduction.mdx"),
        ("create-embeddings.md", "2-ingest-documents.mdx"),
        ("advanced-techniques.md", "3-perform-vector-search.mdx"),
    ],
    "60-advanced-techniques": [
        ("advanced-techniques.md", "1-introduction.mdx"),
        ("understanding-hybrid-search.md", "2-hybrid-search.mdx"),
    ],
    "70-production-deployment": [
        ("production-deployment.md", "1-introduction.mdx")
    ]
}

docs_dir = "docs/workshop"

# Function to move and rename files
def organize_docs():
    for folder, files in structure.items():
        folder_path = os.path.join(docs_dir, folder)

        # Create the directory if it does not exist
        os.makedirs(folder_path, exist_ok=True)

        for old_file, new_file in files:
            old_path = os.path.join(docs_dir, old_file)
            new_path = os.path.join(folder_path, new_file)

            if os.path.exists(old_path):
                shutil.move(old_path, new_path)
                print(f"Moved: {old_path} -> {new_path}")
            else:
                print(f"Warning: {old_path} not found!")

        # Create a _category_.json file for Docusaurus
        category_file = os.path.join(folder_path, "_category_.json")
        category_data = {
            "label": folder.replace("-", " ").title(),
            "collapsible": True,
            "collapsed": True
        }

        with open(category_file, "w") as f:
            json.dump(category_data, f, indent=2)
            print(f"Created category file: {category_file}")

if __name__ == "__main__":
    organize_docs()

