"use client";

import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";



export default function Home() {
    // const {user} = useCurrentUser()

    return (
        <>
            <HeroSection />
            {
                // user?.isPremium ? null : <PricingSection />
            }
            <PricingSection></PricingSection>

        </>
    );
}
