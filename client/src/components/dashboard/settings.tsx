import {useCurrentUser} from "@/hooks/use-current-user";
import {useSubscription} from "@/hooks/use-subscription";
import {api} from "@/lib/api";
// import stripePromise from "@/lib/stripe";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Check} from "lucide-react";
import {Separator} from "../ui/separator";
import {Button} from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import PaymentStatusDialog from "@/components/shared/paymentsatusdialogue";

export default function Settings() {
    const {
        subscriptionStatus,

    } = useSubscription();
    const {user} = useCurrentUser();
    const [dialogOpen, setDialogOpen] = useState(false);
    const isActive = subscriptionStatus ? subscriptionStatus.status === "active" : false;

    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);

    const Success = "/success.png";
    const Failure = "/failure.png";

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
// Then in the PayPalButtons config:
    const createOrder = async () => {
        const res = await createOrderMutation.mutateAsync();
        return res.orderId;
    };


    if (!user) {
        return null;
    }


    return (
        <div className="container mx-auto py-10">
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={user.displayName}
                                id="name"
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={user.email}
                                id="email"
                                readOnly
                                className="bg-gray-100"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your account is managed through Google. If you want to change your
                            email, please contact us.
                        </p>
                    </CardContent>
                </Card>

                {isActive ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Premium</CardTitle>
                            <CardDescription>Your membership details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="flex items-center gap-1 rounded-md bg-green-600/10 p-1 pr-2 text-xs font-medium text-green-600">
                                        <div className="m-0.5 rounded-full bg-green-600/10 p-[3px]">
                                            <Check size={16} className="text-foreground"/>
                                        </div>
                                        Active membership
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Lifetime membership granted
                                    </p>
                                </div>
                            </div>
                            <Separator/>
                            <div className="space-y-2">
                                <p>
                                    Thank you for your support. Enjoy the benefits of premium.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-primary border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Get unlimted access forever</CardTitle>
                            <CardDescription>
                                Upgrade to premium and enjoy unlimited access to all features
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <Check size={16} className="text-foreground"/>
                                    <p>Unlimited access to all features</p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={16} className="text-foreground"/>
                                    <p>Unlimited access to all features</p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={16} className="text-foreground"/>
                                    <p>Unlimited access to all features</p>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full"
                                    >Purchase Lifetime Membership</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Complete Payment</DialogTitle>
                                        <DialogDescription>
                                            Confirm your upgrade to the <strong>Premium</strong> plan.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <PayPalScriptProvider
                                        options={{clientId: "AW-iR0h5bySXlIhsss-V29i3DEnU8rr2JcygPvwP8jiZRBaputpEok0YIhBPjBCoy2ISeWdlYmSsDnzR"}}>
                                        <PayPalButtons createOrder={createOrder} onApprove={onApprove}/>
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
                )}
            </div>
        </div>
    );
}