class User {
    private userName: string;
    private hashedPassword: string;
    private firstName: string;
    private lastName?: string;

    private constructor(
        uniqueUsername: string,
        strongPassword: string,
        firstName: string,
        maybeLastName?: string
    ) {
        this.userName = uniqueUsername;
        this.firstName = firstName;
        this.hashedPassword = strongPassword;
        this.lastName = maybeLastName;
    }


    
}