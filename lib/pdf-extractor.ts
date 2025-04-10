// Simplified pdf-extractor.ts that doesn't require PDF libraries
// Replace your existing pdf-extractor.ts with this

import fs from 'fs';
import path from 'path';

/**
 * Extract text from a PDF file (or any text file with .pdf extension)
 * This simple implementation just reads the file as text
 */
export async function getTextFromPDF(filename: string): Promise<string> {
  try {
    const documentsDir = path.join(process.cwd(), 'public', 'documents');
    const filePath = path.join(documentsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return `[File not found: ${filename}]`;
    }
    
    // Read file as text - this works for text files with any extension
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    return `[Error reading ${filename}: ${error.message}]`;
  }
}

/**
 * Scan the documents directory for files
 * This will find all files, not just PDFs
 */
export async function scanDocumentsDirectory(): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  
  try {
    // Get the documents directory path
    const documentsDir = path.join(process.cwd(), 'public', 'documents');
    
    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      console.error(`Documents directory not found: ${documentsDir}`);
      console.log(`Tried to access: ${documentsDir}`);
      
      // Create the directory if it doesn't exist
      try {
        fs.mkdirSync(documentsDir, { recursive: true });
        console.log(`Created documents directory at: ${documentsDir}`);
      } catch (createError) {
        console.error(`Failed to create documents directory: ${createError}`);
      }
      
      return results;
    }
    
    // Read directory contents
    const files = fs.readdirSync(documentsDir);
    console.log(`Found ${files.length} files in documents directory: ${files.join(', ')}`);
    
    // Process each file
    for (const file of files) {
      try {
        // Get file path
        const filePath = path.join(documentsDir, file);
        
        // Check if it's a file (not a directory)
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) continue;
        
        // Read the file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Store with filename (without extension) as key
        const key = file.replace(/\.[^/.]+$/, '').replace(/-/g, '_');
        results[key] = content;
        
        console.log(`Successfully processed file: ${file} (key: ${key})`);
      } catch (error) {
        console.error(`Error processing file ${file}: ${error}`);
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error scanning documents directory: ${error}`);
    return results;
  }
}// Modified pdf-extractor.ts that attempts to read PDFs without additional libraries
// This uses a binary-to-text approach that may work with some PDF files

import fs from 'fs';
import path from 'path';

/**
 * Extract text from a PDF file
 * This is a basic implementation that attempts to extract readable text from PDFs
 * without requiring additional libraries
 */
export async function getTextFromPDF(filename: string): Promise<string> {
  try {
    const documentsDir = path.join(process.cwd(), 'public', 'documents');
    const filePath = path.join(documentsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`PDF file not found: ${filePath}`);
      return `[PDF file not found: ${filename}]`;
    }
    
    // Read file as buffer
    const buffer = fs.readFileSync(filePath);
    
    // Convert buffer to string - this is a simplified approach
    // It won't work perfectly for all PDFs but might extract some readable text
    // from PDFs that aren't heavily compressed or encrypted
    let content = buffer.toString('utf8');
    
    // Basic cleaning of PDF content
    content = cleanPdfContent(content);
    
    if (content.trim().length === 0) {
      console.warn(`No readable text found in ${filename}, trying fallback method`);
      
      // Try another encoding as fallback
      content = buffer.toString('latin1');
      content = cleanPdfContent(content);
    }
    
    if (content.trim().length === 0) {
      console.error(`Could not extract readable text from ${filename}`);
      return `[Could not extract readable text from ${filename}]`;
    }
    
    console.log(`Successfully extracted text from ${filename} (${content.length} characters)`);
    return content;
  } catch (error) {
    console.error(`Error extracting text from PDF: ${error}`);
    return `[Error extracting text from ${filename}: ${error.message}]`;
  }
}

/**
 * Clean PDF content by removing binary data and keeping readable text
 * This is a best-effort approach that works with some PDFs
 */
function cleanPdfContent(content: string): string {
  // Remove binary data and keep only printable ASCII
  let cleaned = '';
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
      cleaned += content[i];
    } else {
      cleaned += ' ';
    }
  }
  
  // Look for text blocks - look for patterns like "BT ... ET" in PDF content
  const textBlocks = [];
  let inText = false;
  let currentBlock = '';
  
  const lines = cleaned.split('\n');
  for (const line of lines) {
    if (line.includes('BT')) {
      inText = true;
      currentBlock = '';
    }
    
    if (inText) {
      currentBlock += line + '\n';
    }
    
    if (line.includes('ET') && inText) {
      inText = false;
      textBlocks.push(currentBlock);
    }
  }
  
  // Extract likely text content
  const extractedText = textBlocks.join('\n');
  
  // Additional cleanup of common PDF artifacts
  let result = extractedText
    .replace(/\(\s*([^)]+)\s*\)/g, '$1') // Extract text in parentheses
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\f/g, '\f')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If we couldn't find text blocks, fall back to the cleaned content
  if (result.length < 50) {
    // Look for paragraphs that might contain text
    const paragraphs = cleaned.split('\n\n');
    const textParagraphs = paragraphs.filter(p => {
      // Paragraphs with a good text-to-symbol ratio are likely to be text
      const textRatio = p.replace(/[^a-zA-Z0-9 .,;:?!-]/g, '').length / p.length;
      return textRatio > 0.7 && p.length > 20;
    });
    
    if (textParagraphs.length > 0) {
      result = textParagraphs.join('\n\n');
    } else {
      // Last resort - just return the cleaned content
      result = cleaned;
    }
  }
  
  return result;
}

/**
 * Scan the documents directory for PDF files
 */
export async function scanDocumentsDirectory(): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  
  try {
    const documentsDir = path.join(process.cwd(), 'public', 'documents');
    
    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      console.error(`Documents directory not found: ${documentsDir}`);
      return results;
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(documentsDir);
    console.log(`Found ${files.length} files in documents directory: ${files.join(', ')}`);
    
    // Process PDF files
    for (const file of files) {
      if (file.toLowerCase().endsWith('.pdf')) {
        try {
          // Extract text from the PDF
          const content = await getTextFromPDF(file);
          
          // Skip files where we couldn't extract content
          if (content.startsWith('[') && content.includes('Error')) {
            console.warn(`Skipping ${file} due to extraction error`);
            continue;
          }
          
          // Store with filename (without extension) as the key
          const key = file.replace(/\.pdf$/i, '').replace(/-/g, '_');
          results[key] = content;
          
          console.log(`Successfully processed PDF: ${file} (key: ${key})`);
        } catch (error) {
          console.error(`Error processing PDF ${file}: ${error}`);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error(`Error scanning documents directory: ${error}`);
    return results;
  }
}