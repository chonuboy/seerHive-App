import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export default NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
//   callbacks: {
//     async jwt(token, user, account) {
//       // Persist the user ID to the token right after signin
//       if (account.provider === "google") {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session(session, token) {
//       // Send properties to the client, like an access token from a provider.
//       session.user.id = token.id;
//       return session;
//     },
//   },
});
