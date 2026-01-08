import { Check } from 'lucide-react';
import React from 'react'

const PricingSection = () => {
 const plans = [
  {
    name: "Basico",
    price: "$50.000",
    period: "por mes",
    features: [
      "Ver citas ilimitadas",
      "Recordatorios por email",
    ],
    highlighted: false,
  },
  {
    name: "Recomendado",
    price: "$90.000",
    period: "por mes",
    features: [
      "Ver citas ilimitadas",
      "Recordatorios por email",
      "Gestionar clientes",
      "Soporte prioritario",
      "Acceso al sistema de gestion",
      "Tarjetas de fidelidad",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$150.000",
    period: "por mes",
    features: [
      "Ver citas ilimitadas",
      "Recordatorios por email",
      "Gestionar clientes",
      "Soporte 24/7",
      "Acceso al sistema de gestion",
      "Tarjetas de fidelidad",
      "IA"
    ],
    highlighted: false,
  },
];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-14">
          Pricing Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transition-transform duration-300
                ${
                  plan.highlighted
                    ? "bg-blue-700 text-white scale-105"
                    : "bg-white text-blue-900"
                }`}
            >
              <h3 className="text-2xl font-semibold mb-4">
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <p
                  className={`text-sm ${
                    plan.highlighted
                      ? "text-blue-200"
                      : "text-blue-500"
                  }`}
                >
                  {plan.period}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`text-sm ${
                      plan.highlighted
                        ? "text-blue-100"
                        : "text-gray-600"
                    }`}
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-auto w-full py-3 rounded-full font-semibold transition-colors cursor-pointer
                  ${
                    plan.highlighted
                      ? "bg-white text-blue-700 hover:bg-blue-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection