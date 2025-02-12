"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems: { name: string; href: string }[] = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pricing", href: "/pricing" },
    { name: "Privacy Policy", href: "/privacy" },
];

export function Header() {
    function googleSignIn() : Promise<void>   {
       return new Promise((resolve)=> {
           window.location.href = "http://localhost:8000/auth/google";
           resolve();
       })
    }
    const pathname = usePathname();
    const user = true;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo and Navigation */}
                <div className="flex items-center space-x-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 text-lg font-semibold">
                        Logo
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                href={item.href}
                                key={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    pathname === item.href ? "text-foreground/80" : "text-foreground/40"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <Button
                    onClick={googleSignIn}
                    >Get Started</Button>
                </div>
            </div>
        </header>
    );
}
