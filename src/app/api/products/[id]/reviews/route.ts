import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { RowDataPacket } from 'mysql2/promise';

interface ReviewData extends RowDataPacket {
  id: number;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: Date;
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const [rows] = await pool.query<ReviewData[]>(
      'SELECT * FROM reviews WHERE product_id = ?',
      [context.params.id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { rating, review_text, user_Id } = await request.json();

    if (!rating || !review_text || !user_Id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating value. Rating must be a number between 1 and 5." },
        { status: 400 }
      );
    }

    if (typeof review_text !== 'string' || review_text.trim() === '') {
      return NextResponse.json(
        { error: "Invalid review text. Review text must be a non-empty string." },
        { status: 400 }
      );
    }

     if (typeof user_Id !== 'string' || user_Id.trim() === '') {
      return NextResponse.json(
        { error: "Invalid userId. Review text must be a non-empty string." },
        { status: 400 }
      );
    }

    // Check if product exists
    const [productResult] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM products WHERE id = ?',
      [context.params.id]
    );

    if (productResult.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check for existing review
    const [existingReview] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
      [context.params.id, user_Id]
    );

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "User has already reviewed this product" },
        { status: 400 }
      );
    }

    // Create new review
    const [result] = await pool.query<any>(
      'INSERT INTO reviews (product_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [context.params.id, user_Id, rating, review_text]
    );

    const newReviewId = result.insertId;

    // Fetch the newly created review
    const [newReview] = await pool.query<ReviewData[]>(
      'SELECT * FROM reviews WHERE id = ?',
      [newReviewId]
    );

    // Fetch all reviews for the product
    const [rows] = await pool.query<ReviewData[]>(
      'SELECT * FROM reviews WHERE product_id = ?',
      [context.params.id]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Review created successfully",
      newReview: newReview[0],
      reviews: rows
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
