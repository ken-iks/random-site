import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { users } from "../db/schema";

const testClient = createClient({
    url: ":memory:"
});
const testDb = drizzle({ client: testClient });
// inject our test DB as the db used in the class
jest.doMock("../db/index.ts", () => ({
    db: testDb
}))

// have to import user AFTER we do the mock
import User from "./User";

//NOTE: order matters!
const mockAttemptCreateUserInput = ["testuser123", "Test bio", "TestPass1!", "Test"] as const;
const mockAttemptCreateUserOutput = {
    userName: "testuser123",
    firstName: "Test",
    bio: "Test bio",
    profilePicPath: "/Users/bigkenz/personal-blog/public/defaultpic.jpg",
    hashedPassword: "7a9634629d83a076f9befe4df75330ae346612b93c3aaadcdc74f417edd6e5f3",
    role: "regular"
}

/**
 * Tests clarify that we can successfully create an account and login to a 
 * created account. It confirms that we cannot repeat usernames and that 
 * we cannot login if the password is incorrect.
 */
describe("User tests", ()=> {
    beforeAll(async () => {
        await migrate(testDb, { migrationsFolder: "./drizzle" });
    })
    beforeEach(async () => {
        await testDb.delete(users);
    })

    it("regular user creation", async () => {
        const user = await User.attemptCreateUser(...mockAttemptCreateUserInput);
        expect(user).toMatchObject(mockAttemptCreateUserOutput)
    })
    it("double create should throw", async () => {
        const user = await User.attemptCreateUser(...mockAttemptCreateUserInput);
        await expect(
            User.attemptCreateUser(...mockAttemptCreateUserInput)
        ).rejects.toThrow()
    })
    it("login after creation", async () => {
        const user = await User.attemptCreateUser(...mockAttemptCreateUserInput);
        const tryLogin = await User.attemptLogin("testuser123", "TestPass1!")
        expect(user).toMatchObject(tryLogin)
    })
    it("login bad password should throw", async () => {
        const user = await User.attemptCreateUser(...mockAttemptCreateUserInput);
        await expect(User.attemptLogin("testuser123", "TestPass0!")).rejects.toThrow()
    })
})