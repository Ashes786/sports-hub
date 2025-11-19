import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, studentID, department } = await request.json()

    if (!name || !email || !password || !studentID || !department) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Check if student ID already exists
    if (studentID) {
      const existingStudentID = await db.user.findUnique({
        where: { studentID }
      })

      if (existingStudentID) {
        return NextResponse.json(
          { error: 'Student ID already exists' },
          { status: 409 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user - always as STUDENT
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STUDENT', // Always STUDENT
        studentID: studentID,
        department: department
      }
    })

    // Generate token
    const token = generateToken(user.id, user.email, user.role)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}