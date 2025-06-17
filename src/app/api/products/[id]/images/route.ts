import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        
        // Validate id parameter
        if (!id || isNaN(parseInt(id))) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const query = `
            SELECT image_url
            FROM product_images
            WHERE product_id = ?
            ORDER BY display_order ASC
        `;
        const images = await executeQuery(query, [id]);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const formattedImages = images.map((image: { image_url: string }) => ({
            ...image,
            image_url: image.image_url.startsWith('http')
                ? image.image_url
                : `${baseUrl}${image.image_url}`, // Ensure valid absolute URL
        }));

        console.log('Formatted Images:', formattedImages); // Debug log

        return NextResponse.json(formattedImages);
    } catch (error) {
        console.error('Error fetching product images:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product images' },
            { status: 500 }
        );
    }
}
