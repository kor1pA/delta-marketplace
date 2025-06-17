import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { executeQuery } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const productId = data.get('productId');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Make sure the upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    await createDirIfNotExists(uploadDir);

    // Create unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadDir, uniqueFilename);
    
    // Write the file to disk
    await writeFile(filepath, buffer);

    // Save to database
    const imageUrl = `/uploads/products/${uniqueFilename}`;    await executeQuery(
      'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
      [productId, imageUrl]
    );

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'File uploaded successfully' 
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await writeFile(dir, '', { flag: 'wx' });
  } catch (error: any) {
    if (error.code === 'EEXIST') {
      return;
    }
    throw error;
  }
}
