import React from 'react';
import OrderList from 'src/views/orders/OrderList';

export default function Orders() {
    return (
        <div>
            <h4 className="font-bold">Your Orders</h4>

            <OrderList />
        </div>
    );
}
