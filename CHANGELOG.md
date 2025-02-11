# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2025-02-11
### Added
- **Dynamic Database & Collection Selection**: Users can now specify databases and collections dynamically at query time.
- **Expanded Documentation**: Updated README with step-by-step instructions from setup to implementation.
- **Updated Usage Examples**: `basic-usage.js` and `advanced-usage.js` now demonstrate dynamic database selection.
- **Enhanced Logging**: MongoRAG now logs database/collection selection during operations for better debugging.

### Changed
- **Refactored MongoRAG Connection Handling**: Ensures database and collection are dynamically set without breaking existing functionality.
- **Improved Tests**: Added new tests for dynamic selection and enhanced validation checks.

## [1.1.0] - 2025-02-11
### Changed
- Implemented **semantic chunking** using the `natural.SentenceTokenizer` to split documents into meaningful sentence chunks.
- Implemented **recursive chunking** that splits paragraphs first, and if sections are too large, further splits by sentences.
- Enhanced **sliding window** chunking to preserve overlap between chunks.

### Fixed
- Fixed document chunking strategies to provide more meaningful and efficient chunking based on document content.

## [1.0.0] - 2025-02-01
### Initial release
- Initial version with basic chunking functionality (sliding window strategy).

