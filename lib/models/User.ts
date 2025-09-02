import sha256 from "js-sha256";
import InteractiveDBQueries from "../db/common-queries";
import { NewUser, ExistingUser } from "../db/common-queries";
import { db } from "../db";
import { Buffer } from "buffer";
import { writeFile } from "fs/promises";
import { join } from "path";

export default class User {
    private static PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/
    private static database = new InteractiveDBQueries(db);

    private userName: string;
    private hashedPassword: string;
    private firstName: string;
    private lastName: string | null;
    private bio: string;
    private profilePicPath: string;
    private role: 'regular' | 'admin';

    /**
     * Private constructror will make a call to the DB based on username input
     * This ensures that user has finished being written to the DB before we return success
     */
    private constructor(resolvedUser: ExistingUser) {
        this.userName = resolvedUser.userName;
        this.firstName = resolvedUser.firstName;
        this.lastName = resolvedUser.lastName;
        // if user didnt set a pic then the path is the 'defaultpic' path
        this.profilePicPath = !(resolvedUser.profilePicPath?.includes("profilepics")) ? join(process.cwd(), resolvedUser.profilePicPath!) : resolvedUser.profilePicPath!
        this.bio = resolvedUser.bio;
        this.role = resolvedUser.role!;
        this.hashedPassword = resolvedUser.hashedPassword;
    }

    /** Get unique user based on username  */
    public static async getUser(uniqueUsername: string): Promise<User | undefined> {
        const user = await this.database.getUserByName(uniqueUsername);
        return user ? new User(user) : undefined;
    }

    /**
     * Returns User object if successfull
     * User name must be unique within the database.
     * Password must contain a an uppercase and a special character
     */
    public static async attemptCreateUser(
        username: string,
        bio: string,
        password: string,
        firstName: string,
        profilePic?: Buffer,
        lastName?: string
    ): Promise<User> {
        if (
            username.length < 3 ||
            (await this.database.getUserByName(username))
        ) {
            throw new Error("Username must be unique and must have more than 3 characters");
        }
        
        if (
            password.length < 6 ||
            !this.PASSWORD_REGEX.test(password)
        ) {
            throw new Error("Password must be at least 6 characters and must contain an unppercase and a special character!")
        }

        // Valid User, start creating user object
        const profilePicUrl = profilePic ? join(process.cwd(), 'public', 'profilepics', `${username}.jpg`) : undefined
        if (profilePicUrl) {
            // profile != undefined => profilePic != undefined... safe assertion
            await writeFile(profilePicUrl, profilePic!)
        }

        const userObject: NewUser = {
            firstName: firstName,
            lastName: lastName,
            bio: bio,
            profilePicPath: profilePicUrl,
            userName: username,
            hashedPassword: sha256.sha256(password),
            role: username === "ken" ? "admin" : "regular"
        }

        const createdUser = await this.database.addNewUser(userObject);
        if (createdUser) {
            const userFromDB = await this.getUser(createdUser.userName);
            if (userFromDB) {
                return userFromDB;
            }
        }
        throw new Error("Unable to create user! Try again later. This indicates a product bug")
    }

    /**
     * Returns User if succesfull, if not, will throw with appropriate error message
     */
    public static async attemptLogin(
        username: string,
        password: string
    ): Promise<User> {
        const maybeUser = await this.getUser(username)
        if (maybeUser) {
            if (maybeUser.hashedPassword === sha256.sha256(password)) {
                return maybeUser
            } else {
                throw new Error("Incorrect password! Try again");
            }
        } else {
            throw new Error("Account with this username not found");
        }
    }
    
}