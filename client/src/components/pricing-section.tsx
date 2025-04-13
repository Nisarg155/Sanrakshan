'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import PaymentStatusDialog from "@/components/shared/paymentsatusdialogue"

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import {useMutation} from "@tanstack/react-query";
import {api} from "@/lib/api";

export function PricingSection() {
    return (
        <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-background/80">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center">
                Choose the plan that&apos;s right for you
            </h2>
            <p className="text-lg text-muted-foreground mt-4 text-center max-w-3xl mx-auto">
                Select the perfect plan for your needs. Upgrade anytime to unlock
                premium features and support.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <PricingCard
                    title="Basic"
                    description="For comprehensive contract analysis"
                    price="Free"
                    period="/lifetime"
                    features={FEATURES}
                    buttonText="Upgrade"
                />
                <PricingCard
                    title="Premium"
                    description="For comprehensive contract analysis"
                    price="$100"
                    highlight
                    period="/lifetime"
                    features={FEATURES}
                    buttonText="Upgrade"
                />
            </div>
        </div>
    );
}

const FEATURES = [
    "Advanced Privacy Policy Analysis",
    "Unlimited Policy Reviews",
    "AI-powered Insights on Privacy Policies",
    "10+ Privacy Risks with Severity Levels",
    "10+ Compliance Issues with Impact Levels",
    "Comprehensive Policy Summary",
    "Improvement recommendations",
    "Key clauses identification",
    "User Data Handling Insights",
    "Policy Duration & Updates Analysis",
    "Third-party Data Sharing Summary",
    "Data Retention & Deletion Policies Breakdown",
    "Compensation structure breakdown",
    "Security & Encryption Policy Evaluation",
    "User Control & Consent Mechanisms Overview",
];

interface PricingCardProps {
    title: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    highlight?: boolean;
}

function PricingCard({
                         title,
                         description,
                         price,
                         features,
                         period,
                         highlight,
                     }: PricingCardProps) {
    const { user } = useCurrentUser();
    const [dialogOpen, setDialogOpen] = useState(false);


    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post("/payments/create-order");
            return res.data;
        },
    });

    const captureOrderMutation = useMutation({
        mutationFn: async (data: { orderID: string; userId: string }) => {
            const res = await api.post("/payments/capture-order", data);
            return res.data;
        },
    });

// Then in the PayPalButtons config:
    const createOrder = async () => {
        const res = await createOrderMutation.mutateAsync();
        return res.orderId;
    };


    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);

    const Success = "/success.png";
    const Failure = "/failure.png";

    // const onApprove = async (data: any) => {
    //     if (!user) return;
    //
    //     const details = await captureOrderMutation.mutateAsync({
    //         orderID: data.orderID,
    //         userId: user._id,
    //     });
    //
    //
    //     setDialogOpen(false);
    // };

    const onApprove = async (data: any) => {
        if (!user) return;

        try {
            const details = await captureOrderMutation.mutateAsync({
                orderID: data.orderID,
                userId: user._id,
            });

            setPaymentSuccess(true);
            setStatusDialogOpen(true);
            setDialogOpen(false);
        } catch (error) {
            setPaymentSuccess(false);
            setStatusDialogOpen(true);
        }
    };

    return (
        <Card
            className={`flex flex-col ${
                highlight ? "border-primary shadow-lg" : ""
            } relative overflow-hidden transition-all duration-300`}
        >
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-5xl font-extrabold mb-6">
                    {price}
                    <span className="text-base font-normal text-muted-foreground">
                        {period}
                    </span>
                </p>
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li className="flex items-center gap-2" key={index}>
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">{title === "Premium" ? "Upgrade" : "Free"}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Complete Payment</DialogTitle>
                            <DialogDescription>
                                Confirm your upgrade to the <strong>{title}</strong> plan.
                            </DialogDescription>
                        </DialogHeader>
                        <PayPalScriptProvider options={{ clientId: "AW-iR0h5bySXlIhsss-V29i3DEnU8rr2JcygPvwP8jiZRBaputpEok0YIhBPjBCoy2ISeWdlYmSsDnzR" }}>
                            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
                        </PayPalScriptProvider>
                    </DialogContent>
                </Dialog>
                <PaymentStatusDialog
                    open={statusDialogOpen}
                    onClose={() => setStatusDialogOpen(false)}
                    isSuccess={paymentSuccess === true}
                    imageSrc={paymentSuccess ? Success : Failure}
                />
            </CardFooter>
        </Card>
    );
}
