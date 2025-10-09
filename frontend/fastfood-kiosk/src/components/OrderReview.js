// success code :
import React, { useState } from 'react';
import { createOrder } from '../utils/api'; // Adjust the path based on your folder structure
import { useNavigate } from 'react-router-dom';

const OrderReview = ({ selectedItems }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setIsLoading(true);
    setError(null);

    // Prepare order data
    const orderData = {
      orderId: `order_${new Date().getTime()}`, // Example order ID, you might want to generate it differently
      menuItems: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: selectedItems.reduce((total, item) => total + item.quantity * item.price, 0)
    };

    try {
      const orderResponse = await createOrder(orderData);
      console.log('Order successful:', orderResponse);

      // Navigate to the store/package selection page after order creation
      navigate('/store-package-selection');
    } catch (error) {
      setError('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Order Review</h2>
      {selectedItems.map((item, index) => (
        <div key={index}>
          <span>{item.name} x {item.quantity}</span>
          <span> - ₩{(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}
      <div>
        <strong>Total: ₩{selectedItems.reduce((total, item) => total + item.quantity * item.price, 0).toLocaleString()}</strong>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handlePay} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Pay'}
      </button>
    </div>
  );
};

export default OrderReview;