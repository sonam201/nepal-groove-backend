const axios = require("axios");

const khaltiPayment = {
  path: "/api/v2/khalti/verify",
  method: "post",
  handler: async (req, res) => {
    const { token, amount } = req.body; // Extract payment details from request body

    console.log("token", token, amount);
    try {
      // Send the payment verification request using the Khalti API
      const response = await axios.post(
        "https://khalti.com/api/v2/payment/verify/",
        {
          token,
          amount,
        },
        {
          headers: {
            Authorization:
              "Key test_secret_key_c99e37dcaddb4a6397edfb85d58feb67", // Replace with your Khalti API keys
          },
        }
      );

      console.log(response);
      console.log("data", response.data);
      // If the payment is successful, complete the order and send a success response to the frontend

      // TODO: Complete the order and send a success response to the frontend
      res.status(200).json({
        success: true,
        message: "Payment successful",
      });
    } catch (error) {
      // Handle any errors that occur during payment verification
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = khaltiPayment;
