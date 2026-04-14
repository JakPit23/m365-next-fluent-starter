import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {PrismaClient} from "../prisma/generated/prisma/client";
import {PrismaBetterSqlite3} from "@prisma/adapter-better-sqlite3"
import "dotenv/config";
export const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({url: "file:./dev.db"}),
});
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite"
    }),
    socialProviders: {
        microsoft: {
            clientId: process.env["ENTRA_CLIENT_ID"]!,
            clientSecret: process.env["ENTRA_CLIENT_SECRET"]!,
            tenantId: process.env["ENTRA_TENANT_ID"]!,
            authority: `https://login.microsoftonline.com/`,
            scope: ["openid", "profile", "email", "User.Read", "User.Read.All", "offline_access"],

        }
    }

});