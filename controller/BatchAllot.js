import { User } from "../model/user.model.js"; // Import the User model
import { errorResponse, successResponse } from "../utils/response.js";

const {
  PAYTM_MID,
  PAYTM_WEBSITE,
  PAYTM_INDUSTRY_TYPE_ID,
  PAYTM_CALLBACK_URL,
  PAYTM_MERCHANT_KEY,
} = process.env;

export const BatchAllotController = async (req, res) => {
  const { email, batch, timeSlot, amount } = req.body;
  let availableSeats = 101;

  try {
    // Find student by email
    const student = await User.findOne({ email: email });
    if (!student) {
      return errorResponse(res, "Student not found", "", 404);
    }
    if (student.paymentStatus === "completed") {
      return errorResponse(
        res,
        "Seat already booked and payment completed",
        "",
        400
      );
    }

    if (availableSeats <= 0) {
      return errorResponse(res, "No seats available", "", 400);
    }

    student.batch = batch;
    student.timeSlot = timeSlot;

    if (!amount) {
      return errorResponse(res, "Please Enter amount", "", 404);
    }
    // Generate Paytm payment request parameters
    const paytmParams = {
      MID: PAYTM_MID,
      WEBSITE: PAYTM_WEBSITE,
      INDUSTRY_TYPE_ID: PAYTM_INDUSTRY_TYPE_ID,
      CHANNEL_ID: "WEB",
      ORDER_ID: `ORDER_${Date.now()}`,
      CUST_ID: student._id.toString(),
      TXN_AMOUNT: amount, // Accepting the amount from req.body
      CALLBACK_URL: `${PAYTM_CALLBACK_URL}`,
      EMAIL: student.email,
      MOBILE_NO: student.phone,
    };

    // Generate the checksum
    const checksum = await PaytmChecksum.generateSignature(
      paytmParams,
      PAYTM_MERCHANT_KEY
    );

    // Add the checksum to the request
    paytmParams.CHECKSUMHASH = checksum;

    // Save the student with the initiated payment status
    student.paymentStatus = "pending";
    await student.save();

    // Send Paytm payment initiation response
    res.status(202).json({
      paytmParams,
      message:
        "Payment initiated, complete the payment to confirm seat allotment",
    });
  } catch (error) {
    return errorResponse(res, "Error booking seat", error.message);
  }
};

// Function to handle payment verification
export const verifyPaymentController = async (req, res) => {
  const { studentId, orderId, txnId, txnAmount } = req.body;

  try {
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const paytmParams = {
      MID: PAYTM_MID,
      ORDERID: orderId,
    };

    const checksum = await PaytmChecksum.generateSignature(
      paytmParams,
      PAYTM_MERCHANT_KEY
    );

    paytmParams.CHECKSUMHASH = checksum;

    // Make an HTTPS request to verify the payment
    const post_data = JSON.stringify(paytmParams);

    const options = {
      hostname: "securegw.paytm.in",
      port: 443,
      path: "/order/status",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": post_data.length,
      },
    };

    const post_req = https.request(options, (post_res) => {
      let response = "";

      post_res.on("data", (chunk) => {
        response += chunk;
      });

      post_res.on("end", async () => {
        const result = JSON.parse(response);

        if (result.STATUS === "TXN_SUCCESS" && result.TXNAMOUNT === txnAmount) {
          student.paymentStatus = true;

          // Seat allotment logic
          if (availableSeats > 0) {
            student.seatNo = 102 - availableSeats; // Assign seat number
            availableSeats--;
            await student.save();
            res.json({
              message: "Seat allotted successfully",
              seatNo: student.seatNo,
            });
          } else {
            res.status(400).json({ message: "No seats available" });
          }
        } else {
          res.status(400).json({ message: "Payment verification failed" });
        }
      });
    });

    post_req.write(post_data);
    post_req.end();
  } catch (error) {
    return errorResponse(res, "Error verifying payment", error.message);
  }
};
