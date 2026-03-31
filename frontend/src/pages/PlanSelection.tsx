import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/api/payment";

type Plan = {
  id: "starter" | "enterprise" | "custom";
  name: string;
  price: string;
  description: string;
  featureNote: string;
  cta: string;
  highlight?: boolean;
};

type RazorpayOrderResponse = {
  key_id: string;
  plan: "starter" | "enterprise";
  amount: number;
  currency: string;
  order_id: string;
};

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const coreFeatures = [
  "Attendance tracking and reports",
  "Leave request and approval workflow",
  "Employee profile and directory management",
  "Admin and employee dashboards",
  "Role-based access (Admin and Employee)",
  "Company setup with departments and employment types",
  "Performance and productivity insights",
];

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Rs 499 / month",
    description: "Best for small teams starting with Dayflow.",
    featureNote: "Minimum limits on users and reports.",
    cta: "Choose Starter",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Rs 1499 / month",
    description: "For growing teams that need more capacity.",
    featureNote: "Medium limits with faster support.",
    cta: "Choose Enterprise",
    highlight: true,
  },
  {
    id: "custom",
    name: "Custom",
    price: "Custom pricing",
    description: "Tailored plan for advanced business needs.",
    featureNote: "All features with custom limits and onboarding support.",
    cta: "Customize Plan",
  },
];

const PlanSelection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlanId, setLoadingPlanId] = React.useState<Plan["id"] | null>(null);

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePaidPlan = async (planId: "starter" | "enterprise") => {
    setLoadingPlanId(planId);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const order = (await createRazorpayOrder(planId)) as RazorpayOrderResponse;
      if (!order?.order_id || !order?.key_id) {
        throw new Error("Payment order could not be created.");
      }

      const razorpay = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Dayflow",
        description:
          planId === "starter"
            ? "Starter Subscription - Rs 499"
            : "Enterprise Subscription - Rs 1499",
        order_id: order.order_id,
        theme: { color: "#DD88CF" },
        modal: {
          ondismiss: () => {
            setLoadingPlanId(null);
            toast({
              title: "Payment canceled",
              description: "You can choose a plan again anytime.",
            });
          },
        },
        handler: async (paymentResponse) => {
          try {
            await verifyRazorpayPayment(paymentResponse);
            toast({
              title: "Payment successful",
              description: "Continue signup to finish onboarding.",
            });
            navigate("/signup", {
              state: {
                selectedPlan: planId,
                paymentStatus: "paid",
                paymentId: paymentResponse.razorpay_payment_id,
                orderId: paymentResponse.razorpay_order_id,
              },
            });
          } catch (error) {
            toast({
              title: "Verification failed",
              description:
                error instanceof Error
                  ? error.message
                  : "Unable to verify payment. Please try again.",
              variant: "destructive",
            });
          } finally {
            setLoadingPlanId(null);
          }
        },
      });

      razorpay.open();
    } catch (error) {
      setLoadingPlanId(null);
      toast({
        title: "Payment unavailable",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while starting payment.",
        variant: "destructive",
      });
    }
  };

  const handlePlanAction = async (planId: Plan["id"]) => {
    if (planId === "custom") {
      navigate("/signup", {
        state: {
          selectedPlan: planId,
          paymentStatus: "contact-sales",
        },
      });
      return;
    }

    await handlePaidPlan(planId);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          {/* <p className="inline-flex items-center gap-2 rounded-full bg-lavender px-4 py-2 text-sm font-semibold text-foreground">
            <Sparkles size={16} />
            Choose Your Subscription Plan
          </p> */}
          <h1 className="mt-5 text-3xl font-bold text-foreground md:text-5xl">
            Pick a plan after Get Started
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            Every plan includes Dayflow core features. Choose by team size and support level.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-medium ${
                plan.highlight
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                {plan.highlight ? (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Popular
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-3xl font-extrabold text-foreground">{plan.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-5 rounded-xl bg-lavender px-3 py-2 text-sm font-medium text-foreground">
                {plan.featureNote}
              </div>

              <ul className="mt-6 space-y-3">
                {coreFeatures.map((feature) => (
                  <li key={`${plan.id}-${feature}`} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => void handlePlanAction(plan.id)}
                disabled={loadingPlanId === plan.id}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-orchid-dark"
                    : "bg-deep-purple text-white hover:bg-deep-purple/90"
                } disabled:cursor-not-allowed disabled:opacity-70`}
              >
                {loadingPlanId === plan.id ? "Opening payment..." : plan.cta}
                {loadingPlanId === plan.id ? null : <ArrowRight size={16} />}
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
