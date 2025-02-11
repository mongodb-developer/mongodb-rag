# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Added **semantic chunking** strategy to split documents based on semantically meaningful sentence boundaries.
- Added **recursive chunking** strategy to split documents recursively based on sections or paragraphs.

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
