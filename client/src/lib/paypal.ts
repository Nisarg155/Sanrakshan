
const  createOrder = async (orderID: any, setOrderID: any ) => {
    const res = await fetch("http://localhost:5000/create-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setOrderID(data.orderID);
    return data.orderID;
};

const onApprove = async (data:any) => {
    const res = await fetch("http://localhost:5000/capture-paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
    });

    const response = await res.json();
    alert(`Payment Successful! Transaction ID: ${response.id}`);
};


export { createOrder, onApprove };