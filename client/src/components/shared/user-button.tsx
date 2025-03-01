// import { useCurrentUser } from "@/hooks/use-current-user";
// import { Button } from "../ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import Link from "next/link";
// import { Icons } from "./icons";
// import { logout } from "@/lib/api";
// import { useRouter } from "next/navigation";


// export function UserButton() {
//     const router = useRouter();
//     const { user } = useCurrentUser();
//     const profilePicUrl = user?.profilePicture
//     console.log(user);
    

//     function googleSignIn(): void {
//         const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/['"]+/g, ""); // Remove any unexpected quotes
//         if (!apiUrl) {
//             console.error("API URL is not defined");
//             return;
//         }
    
//         const redirectUrl = `${apiUrl}/auth/google`;
//         console.log("Redirecting to:", redirectUrl);
//         window.location.href = redirectUrl;
//     }
    

//     const handleLogout = async () => {
//         await logout();
//         window.location.reload();
//         setInterval(() => router.push("/"), 1000);
//     };

//     return (
//         <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
//             {user ? (
//                 <>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="size-8 rounded-full">
//                                 <Avatar className="size-8">
//                                     <AvatarImage src={profilePicUrl || "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp"} />
//                                     <AvatarFallback>
//                                         {user?.displayName?.charAt(0) || ""}
//                                     </AvatarFallback>
//                                 </Avatar>
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="w-56" forceMount>
//                             <DropdownMenuItem className="flex flex-col items-start">
//                                 <div className="text-sm font-medium">{user?.displayName}</div>
//                                 <div className="text-sm text-muted-foreground">
//                                     {user?.email}
//                                 </div>
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem asChild>
//                                 <Link href={"/dashboard"}>
//                                     <Icons.dashboard className="mr-2 size-4" />
//                                     <span>Dashboard</span>
//                                 </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem asChild>
//                                 <Link href={"/dashboard/settings"}>
//                                     <Icons.settings className="mr-2 size-4" />
//                                     <span>Settings</span>
//                                 </Link>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem onClick={handleLogout}>
//                                 <Icons.logout className="mr-2 size-4" />
//                                 <span>Logout</span>
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </>
//             ) : (
//                 <>
//                     <Button onClick={googleSignIn}>
//                         Sign in
//                     </Button>
//                 </>
//             )}
//         </div>
//     );
// }

import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Icons } from "./icons";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

export function UserButton() {
    const router = useRouter();
    const { user } = useCurrentUser();

    // Check if the user object is available
    if (!user) {
        return (
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <Button onClick={googleSignIn}>Sign in</Button>
            </div>
        );
    }

    // Destructure user and assign default fallback values
    const { profilePicture, displayName, email } = user;
    const profilePicUrl = user[5]  // fallback URL
    

    function googleSignIn(): void {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/['"]+/g, ""); // Remove any unexpected quotes
        if (!apiUrl) {
            console.error("API URL is not defined");
            return;
        }

        const redirectUrl = `${apiUrl}/auth/google`;
        console.log("Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
    }

    const handleLogout = async () => {
        await logout();
        window.location.reload();
        setInterval(() => router.push("/"), 1000);
    };

    return (
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 rounded-full">
                        <Avatar className="size-8">
                            {/* <AvatarImage src={profilePicUrl} alt={displayName || "User Avatar"} />
                             */}
                             <img src={profilePicUrl} alt={displayName || "Ur Avatar"} width={40} height={40} />

                            <AvatarFallback>
                                {displayName?.charAt(0) || ""}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" forceMount>
                    <DropdownMenuItem className="flex flex-col items-start">
                        <div className="text-sm font-medium">{displayName}</div>
                        <div className="text-sm text-muted-foreground">{email}</div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={"/dashboard"}>
                            <Icons.dashboard className="mr-2 size-4" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"/dashboard/settings"}>
                            <Icons.settings className="mr-2 size-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        <Icons.logout className="mr-2 size-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
