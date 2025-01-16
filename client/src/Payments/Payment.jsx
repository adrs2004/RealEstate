import React from "react";

const Payment = () => {
  const amount = 100 * 100; // Razorpay accepts amount in paise (multiply by 100)
  const currency = "INR";
  const receiptId = "qwsaq1";

  const paymentHandler = async (e) => {
    e.preventDefault();

    // Check if Razorpay SDK is loaded
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const response = await fetch("/api/payment/createorder", {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency,
          receipt: receiptId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const order = await response.json();
      console.log(order);

      var options = {
        key: "rzp_test_1nbToCIUafcIWo", // Replace with your Razorpay Key ID
        amount: order.amount, // Amount in paise
        currency: order.currency,
        name: "Aastha", // Your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, // Order ID from backend
        handler: async function (response) {
          const body = { ...response };
          const validateRes = await fetch("/api/payment/validateorder", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const jsonRes = await validateRes.json();
          console.log(jsonRes);
          if (jsonRes.msg) {
            // toast.success(jsonRes.msg);
          }
        },
        prefill: {
          name: "Aastha", // Customer's name
          email: "aastha@gmail.com",
          contact: "9701844506", // Customer's phone number
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });

      rzp1.open();
    } catch (err) {
      console.error("Error during payment initialization:", err);
    }
  };

  return (
    <div
      className="App"
      style={{
        height: "100vh",
      }}
    >
      <button onClick={paymentHandler}>PAY NOW</button>
    </div>
  );
};

export default Payment;
