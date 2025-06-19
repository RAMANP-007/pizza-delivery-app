import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { createRazorpayOrder, verifyPayment, getRazorpayKey } from '../services/paymentService';
import './Checkout.css';

const Checkout = () => {
    const { cart, dispatch } = useContext(CartContext);
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const { address, city, postalCode, country } = shippingAddress;

    const onChange = (e) => setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

    const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const checkoutHandler = async (e) => {
        e.preventDefault();
        try {
            const order = await createOrder({
                orderItems: cart.items,
                shippingAddress,
                paymentMethod: 'Razorpay',
                totalPrice: total,
            });

            const { key } = await getRazorpayKey();

            const razorpayOrder = await createRazorpayOrder(order._id);

            const options = {
                key,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'Pizza-Delivery',
                description: 'Order Payment',
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    await verifyPayment({
                        order_id: response.razorpay_order_id,
                        payment_id: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        orderId: order._id,
                    });
                    alert('Payment successful!');
                    dispatch({ type: 'CLEAR_CART' });
                    navigate('/order-success');
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                },
                theme: {
                    color: '#f44336',
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error(error);
            alert('An error occurred during checkout.');
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-layout">
                <div className="shipping-address">
                    <h3>Shipping Address</h3>
                                        <form onSubmit={checkoutHandler} className="address-form">
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input id="address" type="text" name="address" value={address} onChange={onChange} placeholder="123 Pizza Lane" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input id="city" type="text" name="city" value={city} onChange={onChange} placeholder="Pizzaville" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="postalCode">Postal Code</label>
                            <input id="postalCode" type="text" name="postalCode" value={postalCode} onChange={onChange} placeholder="12345" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input id="country" type="text" name="country" value={country} onChange={onChange} placeholder="Pizzaland" required />
                        </div>
                        <button type="submit" className="btn-pay">Pay with Razorpay</button>
                    </form>
                </div>
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    {cart.items.map((item) => (
                        <div key={item.pizza} className="summary-item">
                            <span>{item.name} ({item.varient}) x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <hr />
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
