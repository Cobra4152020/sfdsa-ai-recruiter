// Place this file at: app/api/test-pdf-read/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const documentsDir = path.join(process.cwd(), "public/documents");
    
    // Check if directory exists
    if (!fs.existsSync(documentsDir)) {
      return NextResponse.json({
        success: false,
        error: `Documents directory not found: ${documentsDir}`
      }, { status: 404 });
    }
    
    // Get list of files
    const files = fs.readdirSync(documentsDir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No PDF files found in documents directory",
        directory: documentsDir,
        allFiles: files
      });
    }
    
    // Read and attempt to extract text from each PDF
    const results: Record<string, any> = {};
    
    for (const file of pdfFiles) {
      const filePath = path.join(documentsDir, file);
      
      try {
        // Read the file as buffer
        const buffer = fs.readFileSync(filePath);
        
        // Convert to string - this is a simplified approach
        let content = buffer.toString('utf8');
        
        // Clean the content by removing non-printable characters
        let cleaned = '';
        for (let i = 0; i < content.length; i++) {
          const code = content.charCodeAt(i);
          if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
            cleaned += content[i];
          } else {
            cleaned += ' ';
          }
        }
        
        // Store results
        results[file] = {
          size: buffer.length,
          preview: cleaned.substring(0, 500) + '...',
          path: filePath
        };
      } catch (error) {
        results[file] = {
          error: error.message,
          path: filePath
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      directory: documentsDir,
      files: pdfFiles,
      results
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}