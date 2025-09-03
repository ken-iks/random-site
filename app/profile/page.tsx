'use client'

import { useAuth } from "@/context/StateContext";
export default function Profile() {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    //TODO: limit the scope of the client component by passing the auth
    //      status to the prop for login/logout. Would need the logout/login buttons
    //      to be client componets also and then interact seemlessly with the server
    //      components. (ken-iks)
    if (isLoggedIn) {
        return (
            <div>
                HAPPY WRITING! (soon)
            </div>
        )
    } else {
        return (
            <div>
                NOT LOGGED IN (yet)
            </div>
        )
    }
}