"use client";

import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";
import {useCurrentUser} from "@/hooks/use-current-user";



export default function Home() {
    const {user} = useCurrentUser()

    return (
        <>
            <HeroSection />
            {
                user?.isPremium ? null : <PricingSection />
            }

        </>
    );
}
