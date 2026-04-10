const btn = document.querySelector('#buy-btn');


async function makeOrder(amount, keyId) {
    try {
        const res = await axios({
            method: 'post',
            data: { amount },
            url: `/order`,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (!res.data.success) {
            alert("Error creating order: " + (res.data.msg || "Unknown error"));
            return;
        }

        if (res.data.simulate) {
            alert("SIMULATION MODE ACTIVE: " + res.data.msg);
            console.log("Simulation order created:", res.data.order);

            // Bypass Razorpay modal and call verification directly
            const response = await axios.post('/payment-verify', {
                simulate: true,
                razorpay_order_id: res.data.order.id
            });

            if (response.data.success) {
                window.location.replace('/user/cart?payment=success');
            }
            return;
        }

        console.log("Order created:", res.data);

        const options = {
            "key": keyId,
            "amount": res.data.order.amount,
            "currency": "INR",
            "name": "Zest Corp",
            "description": "Purchase Transaction",
            "image": "https://example.com/your_logo",
            "order_id": res.data.order.id,
            "handler": function (response) {
                // Instead of simple callback, we can handle verification via axios
                axios.post('/payment-verify', response)
                    .then(res => {
                        if (res.data.success) {
                            window.location.replace('/user/cart?payment=success');
                        }
                    })
                    .catch(err => {
                        alert("Payment verification failed");
                    });
            },
            "prefill": {
                "name": "",
                "email": "",
                "contact": ""
            },
            "notes": {
                "address": "Zest Corporate Office"
            },
            "theme": {
                "color": "#0d6efd"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    }
    catch (e) {
        console.error("Payment Script Error:", e);
        alert("Payment Error: " + (e.response?.data?.msg || e.message));
    }

}
