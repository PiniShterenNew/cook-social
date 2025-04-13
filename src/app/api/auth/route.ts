import { NextRequest, NextResponse } from 'next/server';
import { db, users, verificationCodes, userInterests } from '@/db';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Send verification code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email } = body;

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      );
    }

    // Generate a verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save the code to the database
    await db.insert(verificationCodes).values({
      id: uuidv4(),
      phone: phone || null,
      email: email || null,
      code: verificationCode,
      expiresAt: expiresAt.toISOString(),
      used: false,
      createdAt: new Date().toISOString(),
    });

    // In a real app, send SMS or email here
    console.log('Verification code (for demo only):', verificationCode);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

// Verify code
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, phone, email } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      );
    }

    // Find the verification code
    const codeQuery = phone
      ? eq(verificationCodes.phone, phone)
      : eq(verificationCodes.email, email || '');

    const validCode = await db.query.verificationCodes.findFirst({
      where: and(
        codeQuery,
        eq(verificationCodes.code, code),
        eq(verificationCodes.used, false),
      ),
    });

    // Check if code is valid
    if (!validCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Check if code is expired
    const now = new Date();
    const expiresAt = new Date(validCode.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Mark the code as used
    await db
      .update(verificationCodes)
      .set({ used: true })
      .where(eq(verificationCodes.id, validCode.id));

    // Check if user exists
    const existingUser = phone
      ? await db.query.users.findFirst({
          where: eq(users.phone, phone),
        })
      : await db.query.users.findFirst({
          where: eq(users.email, email || ''),
        });

    if (existingUser) {
      // Return existing user
      return NextResponse.json({
        user: existingUser,
        isNewUser: false,
      });
    }

    // User doesn't exist, return that registration is needed
    return NextResponse.json({
      isNewUser: true,
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}

// Register new user
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, phone, email, profileImage, bio, interests } = body;

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      );
    }

    // Generate a new ID
    const userId = uuidv4();
    const now = new Date().toISOString();

    // Create the user in the database
    await db.insert(users).values({
      id: userId,
      name: name || 'New User',
      username: username || `user${Date.now()}`,
      phone: phone || null,
      email: email || null,
      profileImage: profileImage || null,
      bio: bio || null,
      createdAt: now,
      updatedAt: now,
    });

    // Add interests if provided
    if (interests && interests.length > 0) {
      const interestsToInsert = interests.map((interest: string) => ({
        id: uuidv4(),
        userId,
        interest,
      }));

      await db.insert(userInterests).values(interestsToInsert);
    }

    // Get the full user
    const newUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        interests: true,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
