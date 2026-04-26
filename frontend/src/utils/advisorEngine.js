const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are Merlin the Sage, an AI financial advisor in an 8-bit RPG financial literacy game.
A young adventurer comes to you for a personalized financial plan.
You will receive their Monthly Salary, Fixed Expenses, and Location.
You must analyze their situation and provide:
1. A clear breakdown of what amount they should put into investments vs savings.
2. Concrete numerical projections: Calculate compound interest and show future value of their investments after 5, 10, and 20 years (assuming 12% returns).
3. "Financial freedom" calculations: Estimate how many years until they can retire or be financially independent based on their savings rate.
4. Advice on how to invest their money, including risks and details of specific investment opportunities suitable for them.
5. Advice on taxes, deductions they can claim, and how to maximize their income while paying the least tax legally.

Keep your tone wise, slightly comedic, and magical, but ensure the financial advice is accurate, practical, and realistic for the Indian context (using Rupees ₹, referring to Indian tax laws like 80C, ELSS, SIPs, etc.).

Return ONLY valid JSON with this exact structure:
{
  "budget_plan": {
    "savings_amount": number,
    "investments_amount": number,
    "needs_amount": number,
    "wants_amount": number,
    "merlin_comment": "string (A magical comment about their budget)"
  },
  "projections": {
    "year_5": "string (e.g. ₹X)",
    "year_10": "string (e.g. ₹Y)",
    "year_20": "string (e.g. ₹Z)",
    "financial_freedom_years": number,
    "merlin_comment": "string (A magical comment about their future wealth)"
  },
  "tax_advice": {
    "recommended_regime": "string (Old vs New)",
    "tips": ["string", "string"],
    "merlin_comment": "string (A magical comment about taxes)"
  },
  "investment_advice": [
    {
      "name": "string (e.g. Index Fund SIP)",
      "allocation_percent": number,
      "risk_level": "string",
      "details": "string (Explanation of why and how)"
    }
  ],
  "final_words": "string (Merlin's concluding wise words)"
}
`;

export async function generateAdvisorPlan({ salary, expenses, location }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey === 'Put_Your_Key_Here') {
    console.warn('No Groq API key found, using fallback advisor plan');
    return getFallbackPlan({ salary, expenses, location });
  }

  const userPrompt = `I earn ₹${salary} per month. My fixed expenses are ₹${expenses} per month. I live in ${location}. What should I do with my money, Merlin? Calculate my future wealth!`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 3000,
        }),
      });

      if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
      const data = await res.json();
      const plan = JSON.parse(data.choices[0].message.content);

      if (!plan.budget_plan || !plan.projections || !plan.tax_advice || !plan.investment_advice) {
        throw new Error('Invalid plan structure');
      }
      return plan;
    } catch (err) {
      console.error(`Advisor generation attempt ${attempt + 1} failed:`, err);
      if (attempt === 1) return getFallbackPlan({ salary, expenses, location });
    }
  }
  return getFallbackPlan({ salary, expenses, location });
}

export async function askFollowUpQuestion(history, newQuestion) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey === 'Put_Your_Key_Here') {
    return "Ah, my crystal ball is cloudy (API key missing)! But worry not, keep saving consistently and your wealth shall multiply.";
  }

  const messages = [
    { role: 'system', content: "You are Merlin the Sage, an AI financial advisor. The user is asking a follow-up question about their financial plan. Provide a concise, magical, and mathematically accurate answer (with numbers if relevant) in plain text." },
    ...history,
    { role: 'user', content: newQuestion }
  ];

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error('Follow-up generation failed:', err);
    return "My magic flickered. Ask me again, young one!";
  }
}

function getFallbackPlan({ salary, expenses, location }) {
  const remaining = salary - expenses;
  const investments = Math.floor(remaining * 0.6);
  const savings = Math.floor(remaining * 0.2);
  const wants = remaining - investments - savings;

  // Rough estimation for fallback
  const monthlyInv = investments;
  const y5 = Math.round(monthlyInv * 12 * 5 * 1.35); // Very rough 12% compound
  const y10 = Math.round(monthlyInv * 12 * 10 * 1.8);
  const y20 = Math.round(monthlyInv * 12 * 20 * 3.5);

  return {
    budget_plan: {
      savings_amount: savings,
      investments_amount: investments,
      needs_amount: expenses,
      wants_amount: wants,
      merlin_comment: "By my starry hat! Let's put your gold to work so it multiplies like rabbits in a magic hat!"
    },
    projections: {
      year_5: `₹${y5.toLocaleString()}`,
      year_10: `₹${y10.toLocaleString()}`,
      year_20: `₹${y20.toLocaleString()}`,
      financial_freedom_years: 18,
      merlin_comment: "Ah! The magic of compounding! Time is the greatest alchemist of them all."
    },
    tax_advice: {
      recommended_regime: "New Tax Regime",
      tips: [
        "If choosing Old Regime, use Section 80C to invest up to ₹1.5L.",
        "Don't forget Section 80D for health insurance premiums!"
      ],
      merlin_comment: "The Tax Goblins are ruthless, but with these spells, you shall keep your hard-earned treasure safe!"
    },
    investment_advice: [
      {
        "name": "Equity Index Mutual Funds (SIP)",
        "allocation_percent": 60,
        "risk_level": "Moderate to High",
        "details": "A magic potion for long-term growth. Volatile in the short term, but powerful over 5+ years."
      },
      {
        "name": "Fixed Deposits / Liquid Funds",
        "allocation_percent": 40,
        "risk_level": "Low",
        "details": "Your emergency shield. Safe, steady, but won't beat the inflation dragon by much."
      }
    ],
    final_words: `Remember, young adventurer from ${location || 'the realm'}, consistency is the greatest magic of all!`
  };
}
