import path from 'path';
import { marked } from 'marked';
import yaml from 'js-yaml';
import fs from 'fs';
import chalk from 'chalk';

// Lazy load pdf-parse
async function loadPdfParse() {
  try {
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js');
    return pdfParse.default;
  } catch (error) {
    throw new Error(`Failed to load PDF parser: ${error.message}`);
  }
}

export async function parseDocument(filePath, content, options = {}) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  
  // Base document structure
  const doc = {
    content: '',
    metadata: {
      source: filePath,
      type: ext.slice(1),
      filename: fileName,
      ingested_at: new Date().toISOString()
    },
    documentId: options.documentId || `${fileName}-${Date.now()}`
  };

  try {
    switch (ext) {
      case '.md':
        const mdContent = fs.readFileSync(filePath, 'utf-8');
        return parseMarkdown(mdContent, doc);
      case '.txt':
        const txtContent = fs.readFileSync(filePath, 'utf-8');
        return parseText(txtContent, doc);
      case '.pdf':
        const buffer = fs.readFileSync(filePath);
        return await parsePDF(buffer, doc);
      case '.yaml':
      case '.yml':
        const yamlContent = fs.readFileSync(filePath, 'utf-8');
        return parseYAML(yamlContent, doc);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error processing ${filePath}:`), error.message);
    // Return a minimal document with error information
    return {
      ...doc,
      content: `Error processing file: ${error.message}`,
      metadata: {
        ...doc.metadata,
        error: error.message,
        processingFailed: true
      }
    };
  }
}

function parseMarkdown(content, doc) {
  // Extract frontmatter if present
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (frontmatterMatch) {
    const [, frontmatter, markdown] = frontmatterMatch;
    try {
      const metadata = yaml.load(frontmatter);
      doc.metadata = { ...doc.metadata, ...metadata };
      doc.content = marked.parse(markdown);
    } catch (error) {
      console.warn('Failed to parse frontmatter, treating as regular markdown');
      doc.content = marked.parse(content);
    }
  } else {
    doc.content = marked.parse(content);
  }

  return doc;
}

function parseText(content, doc) {
  doc.content = content.trim();
  return doc;
}

async function parsePDF(buffer, doc) {
  const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  
  try {
    if (isDevelopment) {
      console.log(chalk.blue(`📄 Processing PDF: ${doc.metadata.filename}`));
    }

    const pdfParse = await loadPdfParse();
    
    // Configure PDF parsing options
    const options = {
      pagerender: function(pageData) {
        if (isDevelopment) {
          console.log(chalk.gray(`   Processing page ${pageData.pagenum} of ${pageData.numpages}`));
        }
        // Return the raw text content instead of the text content object
        return pageData.getTextContent().then(textContent => {
          return textContent.items.map(item => item.str).join(' ');
        });
      },
      max: 0  // No page limit
    };

    const data = await pdfParse(buffer, options);

    // Clean up the text content
    const cleanText = data.text
      .trim()
      .replace(/\[object Object\]/g, '')  // Remove any remaining object notations
      .replace(/\n{3,}/g, '\n\n')         // Normalize multiple newlines
      .replace(/\s{2,}/g, ' ');           // Normalize multiple spaces

    doc.content = cleanText;
    doc.metadata = {
      ...doc.metadata,
      pages: data.numpages,
      title: data.info?.Title,
      author: data.info?.Author,
      keywords: data.info?.Keywords || '',
      creator: data.info?.Creator,
      producer: data.info?.Producer,
      creationDate: data.info?.CreationDate,
      modificationDate: data.info?.ModDate
    };

    if (isDevelopment) {
      console.log(chalk.green(`✅ Successfully processed ${doc.metadata.pages} pages`));
      console.log(chalk.gray(`   Content length: ${doc.content.length} characters`));
      if (doc.metadata.title) console.log(chalk.blue(`   Title: ${doc.metadata.title}`));
      if (doc.metadata.author) console.log(chalk.blue(`   Author: ${doc.metadata.author}`));
    }

    return doc;
  } catch (error) {
    const errorMessage = `PDF parsing failed: ${error.message}`;
    if (isDevelopment) {
      console.error(chalk.red(`❌ ${errorMessage}`));
      console.error(chalk.yellow('   This might be due to:'));
      console.error(chalk.yellow('   - Corrupted PDF file'));
      console.error(chalk.yellow('   - Password-protected PDF'));
      console.error(chalk.yellow('   - PDF with unsupported features'));
      console.error(chalk.yellow(`   - File path: ${doc.metadata.source}`));
      console.error(chalk.yellow('   Full error:', error.stack));
    }
    throw new Error(errorMessage);
  }
}

function parseYAML(content, doc) {
  const data = yaml.load(content);
  doc.content = data.content || '';
  doc.metadata = { ...doc.metadata, ...data.metadata };
  if (data.documentId) doc.documentId = data.documentId;
  return doc;
} 