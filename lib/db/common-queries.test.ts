import InteractiveDBQueries from "./common-queries";
import { NewUser, ExistingUser } from "./common-queries";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";
import { users, posts } from "./schema";

const testClient = createClient({
    url: ":memory:"
});
const testDb = drizzle({ client: testClient });
const testDbRunner = new InteractiveDBQueries(testDb);


const mockNewUser: NewUser = {
    firstName: "John",
    lastName: "Doe",
    bio: "Software developer who loves coding",
    profilePicPath: "/public/profilepics/johndoe.jpg",
    userName: "johndoe",
    hashedPassword: "hashedpassword123"
};

const mockExistingUser: ExistingUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    bio: "Software developer who loves coding",
    profilePicPath: "/public/profilepics/johndoe.jpg",
    userName: "johndoe",
    hashedPassword: "hashedpassword123",
    role: "regular"
};

/**
 * These tests confirm that, given a NewUser input, we successfully
 * create user objects that can be retrieved from the db.
 * 
 * The tests assume that new user objects are well formed. Only validation
 * is for existence within DB and also for retrieval of non existant users
 */
describe("Creating account", () => {
    beforeAll(async () => {
        await migrate(testDb, { migrationsFolder: "./drizzle" })
    })
    beforeEach(async () => {
        await testDb.delete(users)
    })
    it("regular user creation", async () => {
        const user = await testDbRunner.addNewUser(mockNewUser);
        expect(user).toBeDefined();
        if (user) {
            expect(user).toMatchObject(mockExistingUser)
            console.log(JSON.stringify(user))
        }
    })
    it("cant double create", async () => {
        const user1 = await testDbRunner.addNewUser(mockNewUser);
        const user1Copy = await testDbRunner.addNewUser(mockNewUser); 
        expect(user1).toBeDefined();
        expect(user1Copy).toBeUndefined();
    })
    it("getting a non existant user", async () => {
        const maybeUser = await testDbRunner.getUserByName("john");
        expect(maybeUser).toBeUndefined();
    })
})