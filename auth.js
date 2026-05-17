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
        console.log(">>> [AUTH] Authorizing Node:", credentials.email.toLowerCase());
        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, password_hash, first_name, last_name, username, avatar_url, is_verified, role, location, bio, created_at, interests")
          .eq("email", credentials.email.toLowerCase())
          .maybeSingle();

        if (error || !user) {
          return null;
        }

        if (!user.is_verified && user.role !== 'admin') {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        if (!user.password_hash) {
          throw new Error("This account uses social login (Google or GitHub). Please sign in that way.");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          image: user.avatar_url || null,
          username: user.username,
          location: user.location,
          bio: user.bio,
          role: user.role || 'user',
          is_verified: user.is_verified || false,
          created_at: user.created_at,
          interests: user.interests || [],
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
      console.log(">>> [AUTH] JWT Callback Triggered | Trigger:", trigger);
      
      // Initial sign in
      if (user) {
        console.log(">>> [AUTH] Initial Sign-In Detected for User:", user.email);
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.location = user.location;
        token.bio = user.bio;
        token.role = user.role;
        token.is_verified = user.is_verified;
        token.created_at = user.created_at;
        token.name = user.name;
        token.picture = user.image;
        token.interests = user.interests;
      }
      
      // Handle session update
      if (trigger === "update" && updatedSession) {
        console.log(">>> [AUTH] Session Update Requested:", updatedSession);
        // Sync token with updated session data
        if (updatedSession.user?.email) token.email = updatedSession.user.email;
        if (updatedSession.user?.name) token.name = updatedSession.user.name;
        if (updatedSession.user?.image !== undefined) token.picture = updatedSession.user.image;
        if (updatedSession.user?.username) token.username = updatedSession.user.username;
        if (updatedSession.user?.bio !== undefined) token.bio = updatedSession.user.bio;
        if (updatedSession.user?.location !== undefined) token.location = updatedSession.user.location;
        if (updatedSession.user?.role) token.role = updatedSession.user.role;
        if (updatedSession.user?.is_verified !== undefined) token.is_verified = updatedSession.user.is_verified;
        if (updatedSession.user?.interests) token.interests = updatedSession.user.interests;
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log(">>> [AUTH] Session Callback Triggered | User:", token?.email);
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.location = token.location;
        session.user.bio = token.bio;
        session.user.role = token.role;
        session.user.is_verified = token.is_verified;
        session.user.created_at = token.created_at;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.interests = token.interests || [];
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
