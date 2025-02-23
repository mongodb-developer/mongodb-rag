import os
import shutil
import json

# Base workshop directory
docs_dir = "docs/workshop"

# Define the new structure
structure = {
    "10-introduction": [
        ("10-Introduction/01-introduction.md", "1-overview.mdx"),
        ("installation.md", "2-prerequisites.mdx")
    ],
    "20-mongodb-atlas": [
        ("20-mongodb-atlas/3-create-cluster.mdx", "3-create-cluster.mdx"),
        ("", "1-what-is-mongodb.mdx"),  # Placeholder
        ("", "2-create-account.mdx")  # Placeholder
    ],
    "30-rag-concepts": [
        ("30-RAG-Concepts/1-rag-concepts.md", "1-introduction.mdx"),
        ("30-RAG-Concepts/2-how-rag-works.mdx", "2-how-rag-works.mdx")
    ],
    "40-mongodb-rag": [
        ("40-MongoDB-RAG/1-Introduction.md", "1-introduction.mdx"),
        ("", "2-setup-mongodb.mdx"),  # Placeholder
        ("40-MongoDB-RAG/3-create-embeddings.mdx", "3-create-embeddings.mdx")
    ],
    "50-build-rag-app": [
        ("50-build-rag-app/1-introduction.mdx", "1-introduction.mdx"),
        ("", "2-ingest-documents.mdx"),  # Placeholder
        ("50-build-rag-app/3-perform-vector-search.mdx", "3-perform-vector-search.mdx"),
        ("", "4-integrate-llm.mdx")  # Placeholder
    ],
    "60-advanced-techniques": [
        ("", "1-introduction.mdx"),  # Placeholder
        ("", "2-hybrid-search.mdx"),
        ("", "3-metadata-filtering.mdx"),
        ("", "4-query-expansion.mdx")
    ],
    "70-production-deployment": [
        ("70-production-deployment/1-introduction.mdx", "1-introduction.mdx"),
        ("", "2-scaling.mdx"),
        ("", "3-monitoring.mdx"),
        ("", "4-cost-optimization.mdx")
    ]
}

# Function to reorganize the files
def restructure_workshop():
    for folder, files in structure.items():
        folder_path = os.path.join(docs_dir, folder)

        # Create the directory if it does not exist
        os.makedirs(folder_path, exist_ok=True)

        for old_file, new_file in files:
            old_path = os.path.join(docs_dir, old_file)
            new_path = os.path.join(folder_path, new_file)

            if old_file and os.path.exists(old_path):
                shutil.move(old_path, new_path)
                print(f"Moved: {old_path} -> {new_path}")
            else:
                # Create placeholder files
                if not os.path.exists(new_path):
                    with open(new_path, "w") as f:
                        f.write(f"---\nid: {new_file.replace('.mdx', '')}\ntitle: {new_file.replace('.mdx', '').replace('-', ' ').title()}\n---\n\nComing soon...")
                    print(f"Created placeholder: {new_path}")

        # Create _category_.json for Docusaurus
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
    restructure_workshop()
