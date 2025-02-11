// src/components/Validator/schemaSpec.js
export const SCHEMA_SPEC = {
    edit_mapping_books_book_attribute: {
      title: "Edit Book Attribute Mapping",
      description: "Validate the mapping between books and book_attribute tables",
      collection: "books",
      mapping: {
        source: {
          table: "book_attribute",
          requiredColumns: ["attribute_id", "book_id"]
        },
        target: {
          field: "attributes"
        },
        requiredTransformations: [
          {
            lookupTable: "attribute",
            sourceColumn: "attribute_id",
            targetColumn: "attribute_name"
          }
        ]
      },
      url: "https://mongodb-developer.github.io/relational-migrator-lab/docs/edit-mapping-rules/edit-mapping-books-book-attribute"
    },
    edit_mapping_books_book_genre: {
      title: "Edit Book Genre Mapping",
      description: "Validate the mapping between books and book_genre tables",
      collection: "books",
      mapping: {
        source: {
          table: "book_genre",
          requiredColumns: ["genre_id", "book_id"]
        },
        target: {
          field: "genres"
        },
        requiredTransformations: [
          {
            lookupTable: "genre",
            sourceColumn: "genre_id",
            targetColumn: "genre_description"
          }
        ]
      },
      url: "https://mongodb-developer.github.io/relational-migrator-lab/docs/edit-mapping-rules/edit-mapping-books-book-genre"
    },
    add_mapping_books_authors: {
      title: "Add Books Authors Mapping",
      description: "Validate the mapping between books and authors",
      collection: "books",
      mapping: {
        source: {
          table: "author_book",
          requiredColumns: ["author_id", "book_id"]
        },
        target: {
          field: "authors"
        }
      },
      url: "https://mongodb-developer.github.io/relational-migrator-lab/docs/edit-mapping-rules/add-mapping-books-authors"
    },
    edit_mapping_books_author_book: {
      title: "Edit Author Book Mapping",
      description: "Validate the many-to-many relationship between books and authors",
      collection: "books",
      mapping: {
        source: {
          table: "author_book",
          requiredColumns: ["author_id", "book_id"]
        },
        target: {
          field: "authors"
        }
      },
      url: "https://mongodb-developer.github.io/relational-migrator-lab/docs/edit-mapping-rules/edit-mapping-books-author-book"
    },
    add_mapping_books_reviews: {
      title: "Add Books Reviews Mapping",
      description: "Validate the mapping between books and reviews",
      collection: "books",
      mapping: {
        source: {
          table: "review",
          requiredColumns: ["review_id", "review_text", "book_id"]
        },
        target: {
          field: "reviews"
        }
      },
      url: "https://mongodb-developer.github.io/relational-migrator-lab/docs/edit-mapping-rules/add-mapping-books-reviews"
    },
    edit_mapping_authors_alias: {
      title: "Edit Authors Alias Mapping",
      description: "Validate the mapping between authors and aliases",
      collection: "authors",
      mapping: {
        source: {
          table: "alias",
          requiredColumns: ["alias_id", "author_id", "alias_name"]
        },
        target: {
          field: "aliases"
        }
      },
      url: "https://mongodb-developer.github.io/relational-migrator-lab/docs/edit-mapping-rules/edit-mapping-authors-alias"
    }
  };