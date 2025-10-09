// success code :
import React from 'react';
import { createOrder } from '../api/orderService'; // Ensure correct path

const handlePay = async () => {
    const totalPrice = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const orderData = {
        orderId: 'order123', // You might want to generate this dynamically
        menuItems: selectedItems,
        totalPrice: totalPrice,
    };

    try {
        await createOrder(orderData);
        // Navigate to the next screen or show success message
    } catch (error) {
        // Handle error (e.g., show error message)
    }


    return (
        <div>
            <h2>Order Summary</h2>
            {/* Render the selected items */}
            {selectedItems.map((item, index) => (
                <div key={index}>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                </div>
            ))}
            <div>Total: ₩{totalPrice.toLocaleString()}</div>
            <button onClick={handlePay}>Pay</button>
        </div>
    );
};

export default OrderSummary;