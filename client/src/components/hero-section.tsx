import {cn} from "@/lib/utils";
import {
    ArrowRight,
    FileSearch,
    Globe,
    Scale,
    ShieldCheck,
    Sparkles,
    ShieldAlert,
    ScrollText,
    FastForward
} from "lucide-react";
import Link from "next/link";
import {Button, buttonVariants} from "./ui/button";
import {Card, CardContent} from "./ui/card";
import {useRouter} from "next/navigation";


const features = [
    {
        title: "AI-powered Analysis",
        description:
            "Utilize advanced AI to analyze privacy policies with speed and accuracy.",
        icon: FileSearch,
    },
    {
        title: "Risk Identification",
        description: "Detect potential privacy risks and compliance gaps in policies.",
        icon: ShieldAlert,
    },
    {
        title: "Policy Transparency",
        description: "Break down complex legal jargon into clear, understandable insights.",
        icon: ScrollText,
    },
    {
        title: "Regulatory Compliance",
        description: "Ensure privacy policies align with global data protection regulations.",
        icon: Scale,
    },
    {
        title: "User Data Protection",
        description: "Identify how user data is collected, shared, and retained for better security.",
        icon: ShieldCheck,
    },
    {
        title: "Efficient Review Process",
        description: "Get detailed privacy policy assessments in minutes, not hours.",
        icon: FastForward,
    },
];

export function HeroSection() {
    const router = useRouter();
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80">
            <div className="container px-4 md:px-6 flex flex-col items-center max-w-6xl mx-auto">
            <Button
  onClick={() => router.push("/privacy-policy")}
  className="self-end mb-4"
  variant="ghost"
>
  View Privacy Policy
</Button>

                <Link
                    href={"/dashboard"}
                    className={cn(
                        buttonVariants({variant: "outline", size: "sm"}),
                        "px-4 py-2 mb-4 rounded-full hidden md:flex"
                    )}
                >
          <span className="mr-3 hidden md:block">
            <Sparkles className="size-3.5"/>
          </span>
                    Introducing Simple Metrics for you
                </Link>
                <div className="text-center mb-12 w-full">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                        Protect Your Privacy
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                        Harness the power of AI to analyze privacy policies, extract key insights, and ensure
                        transparency—empowering you with the information you need.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="inline-flex items-center justify-center text-lg"
                            size={"lg"}
                        >
                            Get Started
                            <ArrowRight className="ml-2 size-5"/>
                        </Button>
                        <Button
                            className="inline-flex items-center justify-center text-lg"
                            size={"lg"}
                            variant={"outline"}
                        >
                            Learn More
                            <Globe className="ml-2 size-5"/>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
                        {features.map((feature) => (
                            <Card key={feature.title} className="h-full">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div
                                        className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <feature.icon className="text-primary"/>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
