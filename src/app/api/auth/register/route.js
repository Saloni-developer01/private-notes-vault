// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email, password } = await req.json();
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({ email, password: hashedPassword });
//     return NextResponse.json({ message: "User registered" }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "User already exists" }, { status: 500 });
//   }
// }



// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password } = await req.json(); // Name add kiya
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({ name, email, password: hashedPassword });
//     return NextResponse.json({ message: "User registered" }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Registration failed" }, { status: 500 });
//   }
// }





import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await connectDB();
    
//     // Yahan check karein: 'name' ko bhi extract karna hai
//     const { name, email, password } = await req.json();

//     // Console check (debugging ke liye)
//     console.log("Registering user:", name, email);

//     // Pehle se user exist toh nahi karta?
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // YAHAN DHAYAN DEIN: 'name' yahan pass hona chahiye
//     await User.create({ 
//       name, 
//       email, 
//       password: hashedPassword 
//     });

//     return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return NextResponse.json({ error: "Registration failed" }, { status: 500 });
//   }
// }



// src/app/api/auth/register/route.js

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json(); // 1. Name yahan pakadna hai

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ 
      name, // 2. Name yahan pass karna hai
      email, 
      password: hashedPassword 
    });

    console.log("User Created:", newUser); // Terminal mein check karein name dikh raha hai ya nahi
    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}