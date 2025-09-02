import { db } from "./index";
import { users, posts } from "./schema";
import { eq } from "drizzle-orm";
export type NewUser = typeof users.$inferInsert
export type ExistingUser = typeof users.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type ExistingPost = typeof posts.$inferSelect

export default class InteractiveDBQueries {
    dbClient: typeof db;
    public constructor(database: typeof db) {
        this.dbClient = database;
    }

    /**
     * Gets the user with the corresponding user name. As primary key, should never 
     * need to query the db for both username and password. For login, get the corresponding
     * user and then check password in memory
     */
    async getUserByName(name: string): Promise<ExistingUser | undefined >{
        const queryResult = await this.dbClient.selectDistinct().from(users).where(eq(users.userName, name));
        if (queryResult.length === 1) {
            return queryResult.at(0);
        }
        return undefined;
    }

    /**
     * Add a new user to the DB which has already been checked for valid credentials
     * It makes one last check to ensure a user with this name does already not exist
     */
    async addNewUser(user: NewUser): Promise<ExistingUser | undefined> {
        if (!(await this.getUserByName(user.userName))) {
            return (await this.dbClient.insert(users).values(user).returning()).at(0);
        }
        return undefined
    }
}