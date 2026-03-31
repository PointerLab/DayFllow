import { apiPost } from "@/api/client";

export const createRazorpayOrder = (plan: "starter" | "enterprise") =>
  apiPost("/accounts/payments/razorpay/create-order/", { plan });

export const verifyRazorpayPayment = (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => apiPost("/accounts/payments/razorpay/verify/", payload);
