import "dotenv/config";
import { db } from "./src/infrastructure/persistence/prisma/client.js";

async function main() {
    console.log("Connecting to db...");
    try {
        console.log("Trying to query...");
        const builder = db.orm.public.users.create({
            name: "test",
            email: "test@example.com",
            password_hash: "123",
            role: "CUSTOMER",
            status: "ACTIVE",
            email_verified: false,
            phone_verified: false,
            // @ts-ignore
            created_at: Temporal.Now.instant(),
            // @ts-ignore
            updated_at: Temporal.Now.instant()
        });
        console.log("Awaiting builder...");
        try {
            const result = await Promise.race([
                builder,
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
            ]);
            console.log("Result:", result);
        } catch (err) {
            console.error("DB Execution error:", err);
        }
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

main();
