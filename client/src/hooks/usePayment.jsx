import { useState } from "react";
import image from "../pages/Images/imge.jpg";

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = async ({
    amount,
    currency = "INR",
    receiptId,
    prefill,
  }) => {
    setLoading(true);
    setError(null);

    if (!window.Razorpay) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch("/api/payment/createorder", {
        method: "POST",
        body: JSON.stringify({ amount, currency, receipt: receiptId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order. Check the server.");
      }

      const order = await response.json();
      if (!order.id) {
        throw new Error("Order creation failed. Missing order ID.");
      }

      return new Promise((resolve, reject) => {
        const options = {
          key: "rzp_test_1nbToCIUafcIWo", // Replace with your Razorpay Key ID
          amount: order.amount, // Amount in paise
          currency: order.currency,
          name: "Real Estate",
          description: "Payment for Listing",
          image: image, // Optional logo URL
          order_id: order.id,
          handler: async function (paymentResponse) {
            try {
              const validateRes = await fetch("/api/payment/validateorder", {
                method: "POST",
                body: JSON.stringify({ paymentResponse, prefill }),
                headers: { "Content-Type": "application/json" },
              });

              if (!validateRes.ok) {
                throw new Error("Payment validation failed on the server.");
              }

              const validationResponse = await validateRes.json();
              if (!validationResponse.success) {
                throw new Error(
                  validationResponse.message || "Payment validation failed."
                );
              }

              resolve(true); // Payment validation success
            } catch (err) {
              setError(err.message);
              reject(err); // Payment validation failed
            }
          },
          prefill: prefill || {
            name: "Customer Name",
            email: "customer@example.com",
            contact: "1234567890",
          },
          theme: { color: "#3399cc" },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          setError(response.error.description || "Payment failed.");
          reject(new Error(response.error.description || "Payment failed."));
        });

        rzp1.open();
      });
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
};

export default usePayment;
