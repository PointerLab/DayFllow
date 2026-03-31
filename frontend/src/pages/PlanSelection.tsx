import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

type Plan = {
  id: "starter" | "enterprise" | "custom";
  name: string;
  price: string;
  description: string;
  featureNote: string;
  cta: string;
  highlight?: boolean;
};

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

  const handlePlanAction = (planId: Plan["id"]) => {
    navigate("/signup", { state: { selectedPlan: planId } });
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
                onClick={() => handlePlanAction(plan.id)}
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-orchid-dark"
                    : "bg-deep-purple text-white hover:bg-deep-purple/90"
                }`}
              >
                {plan.cta}
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
