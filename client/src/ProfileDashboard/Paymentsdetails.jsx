import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";

const Paymentsdetails = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // Fetch payment details
  useEffect(() => {
    const fetchPayments = async () => {
      const email = currentUser.email;
      try {
        const response = await axios.post(
          "api/payment/getallpaymentsdetailsbyemail",
          { email }
        );
        setPayments(response.data.payments);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch payment details.");
        setLoading(false);
      }
    };
    fetchPayments();
  }, [currentUser.email]);

  // Generate PDF for a specific payment
  const handleDownloadPDF = (payment) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Payment Invoice", 20, 20);

    // Add content
    doc.setFontSize(14);
    doc.text(`User Email: ${currentUser.email}`, 20, 40);
    doc.text(`Purchase Description: ${payment.listingname || "N/A"}`, 20, 50);
    doc.text(`Product Type: ${payment.listingtype || "N/A"}`, 20, 60);
    doc.text(`Order ID: ${payment.razorpay_order_id || "N/A"}`, 20, 70);
    doc.text(
      `Purchase Date: ${
        payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"
      }`,
      20,
      80
    );

    // Safely handle amount
    const amount = payment.amount !== undefined ? payment.amount : 0;
    doc.text(`Total Amount: ₹${amount.toFixed(2)}`, 20, 90);

    // Dummy content
    doc.text("Thank you for your purchase! .", 20, 110);

    // Open in a new tab
    doc.output("dataurlnewwindow");
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Purchases</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>PURCHASE DESCRIPTION</th>
            <th style={styles.th}>PRODUCT TYPE</th>
            <th style={styles.th}>ORDER ID</th>
            <th style={styles.th}>PURCHASE DATE</th>
            <th style={styles.th}>INVOICE</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id} style={styles.tr}>
              <td style={styles.td}>{payment.listingname}</td>
              <td style={styles.td}>{payment.listingtype}</td>
              <td style={styles.td}>{payment.razorpay_order_id}</td>
              <td style={styles.td}>
                {payment.date
                  ? new Date(payment.date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td style={styles.td}>
                <button
                  style={styles.button}
                  onClick={() => handleDownloadPDF(payment)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "40px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "14px",
    border: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    textAlign: "center",
    fontSize: "14px",
    border: "1px solid #ddd",
  },
  tr: {
    transition: "background-color 0.3s ease",
  },
  button: {
    padding: "8px 16px",
    fontSize: "14px",
    color: "#007bff",
    backgroundColor: "transparent",
    border: "1px solid #007bff",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#333",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
  },
};

export default Paymentsdetails;
