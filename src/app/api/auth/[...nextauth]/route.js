import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        // if (user && (await bcrypt.compare(credentials.password, user.password))) {
        //   // Yahan 'name' return karna bohot zaroori hai
        //   return { id: user._id, email: user.email, name: user.name }; 
        // }

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          // 2. YAHAN DHAYAN DEIN: explicitly name field return karein
          return { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name // <--- Ye line missing ho sakti hai
          };
        }
        return null;
      },
    }),
  ],
//   callbacks: {
//     // Ye function name ko session mein save karega
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//       }
//       return token;
//     }
//   },

callbacks: {
    // 3. JWT token mein user details save karein
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    // 4. Session mein token se data pass karein frontend ke liye
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },

secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" },
});

export { handler as GET, handler as POST };