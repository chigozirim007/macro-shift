import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

// Use a direct client here (not the singleton) to avoid circular imports
function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const supabase = getSupabase();
        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, password_hash, first_name, last_name, username, avatar_url, is_verified, location, bio, created_at")
          .eq("email", credentials.email.toLowerCase())
          .maybeSingle();

        if (error || !user) {
          throw new Error("No account found with this email address.");
        }

        if (!user.is_verified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        if (!user.password_hash) {
          throw new Error("This account uses social login (Google or GitHub). Please sign in that way.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);
        if (!passwordMatch) {
          throw new Error("Incorrect password. Please try again.");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          image: user.avatar_url || null,
          username: user.username,
          location: user.location,
          bio: user.bio,
          created_at: user.created_at,
        };
      }
    }),
  ],
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updatedSession }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.location = user.location;
        token.bio = user.bio;
        token.created_at = user.created_at;
        token.name = user.name;
        token.picture = user.image;
      }
      
      // Handle session update
      if (trigger === "update" && updatedSession) {
        // Sync token with updated session data
        if (updatedSession.user?.name) token.name = updatedSession.user.name;
        if (updatedSession.user?.image !== undefined) token.picture = updatedSession.user.image;
        if (updatedSession.user?.username) token.username = updatedSession.user.username;
        if (updatedSession.user?.bio !== undefined) token.bio = updatedSession.user.bio;
        if (updatedSession.user?.location !== undefined) token.location = updatedSession.user.location;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.location = token.location;
        session.user.bio = token.bio;
        session.user.created_at = token.created_at;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
})
