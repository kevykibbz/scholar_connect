import NextAuth from "next-auth/next";    
import { authOptions } from "./options";


// Correct the handler export using explicit type assertions
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
