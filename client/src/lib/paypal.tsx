import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalPage() {
    const [orderID, setOrderID] = useState("");

    const createOrder = async () => {
        const response = await fetch("/api/paypal/create-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: "10.00" }),
        });
        const data = await response.json();
        return data.paymentID;
    };

    const onApprove = async (data:any) => {
        const response = await fetch("/api/paypal/execute-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentID: data.orderID, payerID: data.payerID }),
        });

        const result = await response.json();
        if (result.success) {
            alert("Payment Successful!");
        } else {
            alert("Payment Failed!");
        }
    };

    return (
        <div>
            <h1>Pay with PayPal</h1>
    <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
);
}
