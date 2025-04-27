// // components/PayPalButton.tsx
// import {PayPalButtons} from "@paypal/react-paypal-js";

// interface PayPalButtonProps {
//     userId: string; // Pass userId if you want to update user on capture
// }


// export default function PayPalButton({userId}: PayPalButtonProps) {
//     const createOrder = async () => {
//         console.log("Hello paypal");
        
//         const res = await fetch("http://localhost:4000/payments/create-order", {
//             method: "POST",
//         });
//         const data = await res.json();
//         return data.orderId;
//     };

//     const onApprove = async (data: any) => {
//         const res = await fetch("http://localhost:4000/payments/capture-order", {
//             method: "POST",
//             headers: {"Content-Type": "application/json"},
//             body: JSON.stringify({orderID: data.orderID, userId}),
//         });

//         const details = await res.json();
//         alert(`Transaction completed by ${details.payer.name.given_name}`);
//     };

//     return (
//         <div>
//             <h1>Pay with PayPal</h1>
//             <PayPalButtons createOrder={createOrder} onApprove={onApprove}/>
//         </div>
//     );
// }

