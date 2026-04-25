const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a creative story writer for an 8-bit RPG financial literacy game set in India.
You write fun, engaging stories with a comedic touch for young first-time earners.

Two characters exist:
1. The main character (you give them an Indian name) - a young person navigating financial decisions
2. Merlin the Sage - a wise old wizard who reacts to choices. He praises correct answers warmly and scolds wrong ones in a funny, dramatic way.

RULES:
- Create 4-6 decision moments based on story complexity
- Each decision has exactly 4 options: 1 correct, 3 wrong
- Use realistic Indian Rupee amounts
- Merlin's reactions must be educational AND entertaining
- For correct choices: Merlin praises and explains why the other 3 were bad
- For wrong choices: Merlin dramatically scolds (sometimes comedically) and explains the right choice
- Story should have a clear beginning, decision moments, and an ending
- The ending changes based on how many correct decisions the player made

Return ONLY valid JSON with this structure:
{
  "title": "string",
  "topic": "budgeting or taxing or investment",
  "character_name": "string",
  "segments": [
    {
      "type": "narration or decision",
      "text": "story text shown to player",
      "choices": [
        {
          "text": "option text",
          "is_correct": true or false,
          "merlin_reaction": "what merlin says",
          "explanation": "educational explanation"
        }
      ]
    }
  ],
  "good_ending": "ending text if player did well",
  "bad_ending": "ending text if player did poorly"
}

For narration segments, choices should be an empty array.
For decision segments, choices must have exactly 4 items with exactly 1 correct.`;

function getTopicPrompt(topic) {
  const prompts = {
    budgeting: 'Write a story about a young Indian person learning to manage their monthly budget. Include scenarios about saving vs spending, needs vs wants, and emergency funds.',
    taxing: 'Write a story about a young Indian person who just got their first job and needs to understand taxes. Include scenarios about tax filing, deductions under 80C, TDS, and tax-saving instruments.',
    investment: 'Write a story about a young Indian person starting their investment journey. Include scenarios about mutual funds vs FDs, SIPs, risk assessment, and avoiding scams.',
  };
  return prompts[topic] || prompts.budgeting;
}

export async function generateStory(topic) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    console.warn('No Groq API key found, using fallback story');
    return getFallbackStory(topic);
  }

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
            { role: 'user', content: getTopicPrompt(topic) },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.8,
          max_tokens: 4000,
        }),
      });

      if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
      const data = await res.json();
      const story = JSON.parse(data.choices[0].message.content);

      if (!story.segments || !story.title) throw new Error('Invalid story structure');
      story.topic = topic;
      return story;
    } catch (err) {
      console.error(`Story generation attempt ${attempt + 1} failed:`, err);
      if (attempt === 1) return getFallbackStory(topic);
    }
  }
  return getFallbackStory(topic);
}

export function getFallbackStory(topic) {
  return FALLBACK_STORIES[topic] || FALLBACK_STORIES.budgeting;
}

const FALLBACK_STORIES = {
  budgeting: {
    title: "Ravi's Budget Blunders",
    topic: "budgeting",
    character_name: "Ravi",
    segments: [
      { type: "narration", text: "Meet Ravi, a 22-year-old who just got his first job at a tech startup in Bangalore. His monthly salary is ₹30,000. He's excited, but his wallet is about to go on a wild ride!", choices: [] },
      { type: "narration", text: "It's Ravi's first weekend with a salary. His mom has cooked delicious rajma chawal at home, but his friends are calling him to celebrate at a fancy restaurant.", choices: [] },
      { type: "decision", text: "Ravi's phone buzzes — his friends want to go to a restaurant where the bill will be around ₹1,500 per person. Mom's rajma chawal is waiting at home. What should Ravi do?",
        choices: [
          { text: "Eat mom's rajma chawal and save the money", is_correct: true, merlin_reaction: "Excellent choice, young one! Your mother's food is not just delicious — it's FREE! The other options would have you burning money faster than a dragon burns villages!", explanation: "Home-cooked food saves ₹1,500. Over a month of weekends, that's ₹6,000 saved — 20% of your salary!" },
          { text: "Go to the restaurant — YOLO, it's celebration time!", is_correct: false, merlin_reaction: "YOLO?! More like YOBO — You Only go Broke Once! ₹1,500 for ONE meal when free food awaits? My beard is tingling with disappointment!", explanation: "Eating out frequently is the #1 budget killer for young earners." },
          { text: "Order ₹800 worth of pizza instead", is_correct: false, merlin_reaction: "Pizza over free rajma chawal?! That's ₹800 of pure foolishness! Even my owl familiar knows better!", explanation: "Ordering in is slightly cheaper than dining out, but still wasteful when home food is available." },
          { text: "Go to the restaurant AND order extra for takeaway", is_correct: false, merlin_reaction: "Oh my stars! Not only did you go, but you ordered EXTRA?! Your wallet is crying louder than a banshee!", explanation: "This is the worst option — doubling down on unnecessary spending." }
        ]
      },
      { type: "narration", text: "A week later, Ravi's phone screen cracks after it falls off his desk. The repair shop quotes ₹4,000 for a screen replacement.", choices: [] },
      { type: "decision", text: "Ravi needs his phone fixed. The repair costs ₹4,000. He has ₹22,000 left this month. What should he do?",
        choices: [
          { text: "Get it repaired at an authorized center for ₹4,000 — it's a necessary expense", is_correct: true, merlin_reaction: "Wise decision! A phone is a necessity in today's world, and authorized repairs last longer. You chose the path of wisdom!", explanation: "Phone repair is a genuine need. Authorized repairs cost more but come with warranty and quality assurance." },
          { text: "Buy a brand new phone for ₹15,000 on EMI", is_correct: false, merlin_reaction: "A NEW PHONE?! For a cracked screen?! EMIs are the chains that bind foolish spenders! You'd pay ₹15,000 + interest when ₹4,000 fixes the problem!", explanation: "EMIs for wants (not needs) create a debt cycle. The repair is 73% cheaper." },
          { text: "Use the phone with the cracked screen to save money", is_correct: false, merlin_reaction: "Penny wise, pound foolish! A cracked screen gets worse over time and could cut your fingers. Some savings aren't worth the risk!", explanation: "Delaying necessary repairs often costs more in the long run." },
          { text: "Get it fixed at a roadside shop for ₹1,500", is_correct: false, merlin_reaction: "Cheap repairs break again in weeks! You'll end up paying ₹1,500 three times — that's ₹4,500! My crystal ball sees regret in your future!", explanation: "Low-quality repairs often fail quickly, costing more over time." }
        ]
      },
      { type: "narration", text: "Month-end is approaching. Ravi has ₹18,000 left and his coaching class fee of ₹5,000 is due. His friends invite him to a weekend trip to Coorg costing ₹7,000.", choices: [] },
      { type: "decision", text: "Ravi has ₹18,000 left. Coaching fee: ₹5,000 (due in 3 days). Friends' Coorg trip: ₹7,000. Monthly essentials still needed: ₹4,000. What should Ravi prioritize?",
        choices: [
          { text: "Pay coaching fee first, budget ₹4,000 for essentials, save the rest", is_correct: true, merlin_reaction: "NOW you're thinking like a financial wizard! Priorities first, fun later. You'll have ₹9,000 saved — that's an emergency fund starting!", explanation: "The 50/30/20 rule: 50% needs, 30% wants, 20% savings. Coaching is a need, the trip is a want." },
          { text: "Go on the trip — coaching can wait one month", is_correct: false, merlin_reaction: "Coaching can WAIT?! Your future can't wait, young fool! Late fees, missed classes, and a lighter wallet — a triple curse upon your finances!", explanation: "Delaying education payments often incurs late fees and you miss valuable learning time." },
          { text: "Go on the trip AND pay coaching — worry about essentials later", is_correct: false, merlin_reaction: "₹12,000 gone in a flash! You'll have ₹6,000 for the whole month! Have you heard of a thing called FOOD?!", explanation: "Spending on wants before securing all needs is a recipe for financial stress." },
          { text: "Skip both and save everything", is_correct: false, merlin_reaction: "Saving is good, but skipping coaching? That's like skipping shield training before fighting a dragon! Education is an INVESTMENT, not an expense!", explanation: "Being too frugal with necessary expenses (education) hurts long-term financial growth." }
        ]
      },
      { type: "narration", text: "It's the last day of the month. Ravi checks his expenses and realizes he needs a system to track his spending going forward.", choices: [] },
      { type: "decision", text: "Ravi wants to start tracking his finances. What approach should he take?",
        choices: [
          { text: "Use a free budgeting app and set up the 50/30/20 rule", is_correct: true, merlin_reaction: "MAGNIFICENT! The 50/30/20 rule is ancient wisdom — well, modern wisdom, but I'm ancient so it counts! 50% needs, 30% wants, 20% savings. You shall prosper!", explanation: "Free budgeting apps + the 50/30/20 rule is the gold standard for beginners." },
          { text: "Buy a premium finance app subscription for ₹500/month", is_correct: false, merlin_reaction: "Paying ₹500/month to track money? That's like paying a dragon to guard your gold — and the dragon eats some! Free apps exist!", explanation: "Many free apps offer the same features. Paying for budgeting is ironic." },
          { text: "Just keep a mental note of expenses", is_correct: false, merlin_reaction: "Mental notes?! I'm 900 years old and even I write things down! Your brain is not a ledger, young one!", explanation: "Studies show people who track expenses spend 15-20% less than those who don't." },
          { text: "Don't bother — next month will be different", is_correct: false, merlin_reaction: "Ah yes, the classic 'next month' spell — it never works! Every wizard knows: what you don't track, you can't control!", explanation: "Without tracking, the same spending patterns repeat. Awareness is the first step to change." }
        ]
      }
    ],
    good_ending: "Ravi finished the month with money saved and a budget plan in place! Merlin nods approvingly: 'You have the makings of a true Financial Wizard, young Ravi. Your future self will thank you!'",
    bad_ending: "Ravi ended the month broke and stressed. Merlin sighs heavily: 'Fear not, young Ravi. Even the greatest wizards failed before they succeeded. But please... listen to me next time! My beard can't take much more stress!'"
  },
  taxing: {
    title: "Priya's Tax Troubles",
    topic: "taxing",
    character_name: "Priya",
    segments: [
      { type: "narration", text: "Meet Priya, a 23-year-old software developer in Pune earning ₹6,00,000 per year. It's February and tax season is approaching. She has NO idea what to do!", choices: [] },
      { type: "decision", text: "Priya notices TDS (Tax Deducted at Source) being cut from her salary every month. Her colleague says she can 'save tax' by investing. What should Priya do first?",
        choices: [
          { text: "Learn about Section 80C deductions and plan investments before March 31", is_correct: true, merlin_reaction: "Brilliant! Section 80C is the most powerful tax-saving spell in the land! Up to ₹1.5 lakh deduction! The others would have left you scrambling or overpaying!", explanation: "Section 80C allows deductions up to ₹1.5L through ELSS, PPF, EPF, and more." },
          { text: "Ignore it — the company handles taxes automatically", is_correct: false, merlin_reaction: "The company deducts tax, they don't OPTIMIZE it! That's like letting a troll guard your treasure — technically guarding, practically terrible!", explanation: "TDS is the maximum estimated tax. With proper deductions, you can significantly reduce your tax and get a refund." },
          { text: "Ask a friend who 'knows someone' who can help avoid tax completely", is_correct: false, merlin_reaction: "Tax AVOIDANCE is legal. Tax EVASION is a CRIME! Your friend's 'someone' sounds like they live in a dungeon — and that's where YOU'LL end up!", explanation: "Tax evasion carries penalties of 100-300% of tax amount plus potential imprisonment." },
          { text: "Wait until the last week of March to figure it out", is_correct: false, merlin_reaction: "Last-minute tax planning is like fighting a dragon with a toothpick! You'll make rushed, bad investments just to save tax!", explanation: "Rushing investments in March leads to poor choices. Plan early for optimal returns AND tax savings." }
        ]
      },
      { type: "narration", text: "Priya learns she can save up to ₹1.5 lakh under Section 80C. Her EPF already covers ₹50,000. She needs to invest ₹1,00,000 more to max out the deduction.", choices: [] },
      { type: "decision", text: "Priya has ₹1,00,000 to invest under Section 80C. Which option should she choose?",
        choices: [
          { text: "Invest in ELSS mutual funds — 3-year lock-in with market-linked returns", is_correct: true, merlin_reaction: "The wisdom of the ages! ELSS has the shortest lock-in (3 years) among 80C options AND gives market-linked returns averaging 12-15%! The other options are either locked too long or give poor returns!", explanation: "ELSS: 3-year lock-in, ~12-15% returns. PPF: 15 years lock-in. FD: 5 years, ~6-7% returns." },
          { text: "Put it all in a 5-year Tax-Saving Fixed Deposit", is_correct: false, merlin_reaction: "5 years locked at 6-7%?! Inflation is 6%! Your money is basically doing push-ups but going nowhere! ELSS gives better returns with less lock-in!", explanation: "Tax-saving FDs give returns barely above inflation. ELSS historically outperforms over 3+ years." },
          { text: "Buy a life insurance policy that the office agent is pushing", is_correct: false, merlin_reaction: "Those insurance-cum-investment plans are the WORST financial products ever created! They give 4-5% returns! Even my 900-year-old tortoise moves faster than those returns!", explanation: "Endowment/money-back policies give 4-5% returns. Keep insurance and investment separate." },
          { text: "Don't invest — just pay the extra tax", is_correct: false, merlin_reaction: "PAY EXTRA TAX?! That's like voluntarily giving your gold to a goblin! You're in the 20% bracket — that's ₹20,000 you could SAVE!", explanation: "At 20% tax bracket, ₹1L deduction saves ₹20,000 + cess. That's free money!" }
        ]
      },
      { type: "narration", text: "Tax filing deadline is approaching. Priya needs to file her ITR (Income Tax Return).", choices: [] },
      { type: "decision", text: "It's July and Priya needs to file her ITR. How should she do it?",
        choices: [
          { text: "File online through the Income Tax e-filing portal using ITR-1", is_correct: true, merlin_reaction: "Perfect! The e-filing portal is free, official, and gets you your refund fastest! ITR-1 is the right form for salaried individuals. A true wizard files their own returns!", explanation: "Self-filing through incometax.gov.in is free. ITR-1 (Sahaj) is for salaried individuals with income up to ₹50L." },
          { text: "Pay a CA ₹5,000 to file — it's worth the peace of mind", is_correct: false, merlin_reaction: "₹5,000 for a simple ITR-1?! A CA is needed for complex returns, not straightforward salary income! That money could buy 50 cups of chai!", explanation: "For simple salary income, self-filing takes 15-20 minutes. CAs are useful for business income or complex situations." },
          { text: "Skip filing — TDS is already deducted so it's done", is_correct: false, merlin_reaction: "NOT FILING IS ILLEGAL if your income exceeds ₹2.5L! Penalty of ₹5,000 under Section 234F! My wand is trembling with rage!", explanation: "Filing ITR is mandatory above ₹2.5L income. Late filing penalty: ₹5,000. Plus you miss potential refunds." },
          { text: "Use a random third-party app that charges ₹200", is_correct: false, merlin_reaction: "Random apps handling your PAN, Aadhaar, and salary details?! That's like giving your house keys to a stranger! Data privacy matters!", explanation: "Only use the official portal or well-known, trusted platforms. Your financial data is sensitive." }
        ]
      },
      { type: "decision", text: "Priya discovers she also pays ₹25,000/year for health insurance and ₹15,000/year rent for a PG. Can she save more tax?",
        choices: [
          { text: "Claim Section 80D deduction for health insurance premium", is_correct: true, merlin_reaction: "Yes! Section 80D allows up to ₹25,000 deduction for health insurance! That's BEYOND the 80C limit! You just found a hidden treasure chest, young one!", explanation: "80D is separate from 80C. ₹25,000 for self, additional ₹25,000 for parents' health insurance." },
          { text: "Claim HRA exemption for PG rent", is_correct: false, merlin_reaction: "HRA exemption needs rent receipts and your landlord's PAN if rent exceeds ₹1L/year. For ₹15,000/year PG, the exemption is minimal and not the BEST option here!", explanation: "While HRA is claimable, the health insurance deduction gives a bigger immediate benefit." },
          { text: "She can't save any more tax — 80C is the only option", is_correct: false, merlin_reaction: "80C is NOT the only spell in the tax-saving grimoire! There's 80D, 80E, 80G, HRA, and more! Open your eyes, young wizard!", explanation: "Multiple sections exist beyond 80C: 80D (health), 80E (education loan), 80G (donations), etc." },
          { text: "Show fake rent receipts to claim bigger HRA", is_correct: false, merlin_reaction: "FAKE RECEIPTS?! That's TAX FRAUD! The Income Tax department has AI systems that catch this! Enjoy your trip to tax jail!", explanation: "Fake receipts = tax fraud. IT department cross-references receipts with landlord PAN and bank statements." }
        ]
      }
    ],
    good_ending: "Priya saved ₹45,000 in taxes this year through smart planning! Merlin beams: 'You've mastered the ancient art of tax-saving! Remember — a rupee saved in tax is a rupee earned twice!'",
    bad_ending: "Priya overpaid taxes and missed deductions worth ₹45,000. Merlin shakes his head: 'The tax scrolls were right there, young one. Next year, start planning in April, not March!'"
  },
  investment: {
    title: "Arjun's Investment Adventure",
    topic: "investment",
    character_name: "Arjun",
    segments: [
      { type: "narration", text: "Meet Arjun, a 24-year-old marketing executive in Mumbai earning ₹35,000/month. He's managed to save ₹50,000 and wants to start investing. But the world of finance is full of traps!", choices: [] },
      { type: "decision", text: "Arjun has ₹50,000 saved. His friend tells him about a 'guaranteed' crypto scheme that promises 50% returns in 3 months. A colleague suggests starting a SIP. What should Arjun do?",
        choices: [
          { text: "Start a SIP in an index fund with ₹5,000/month", is_correct: true, merlin_reaction: "BRILLIANT! SIPs are the most powerful wealth-building spell for beginners! ₹5,000/month at 12% for 20 years = ₹50 LAKHS! The crypto scheme is a SCAM waiting to happen!", explanation: "SIPs average out market volatility (rupee cost averaging). Index funds give market returns (~12% historically) with low fees." },
          { text: "Put ₹50,000 in the crypto scheme — 50% returns sounds amazing!", is_correct: false, merlin_reaction: "GUARANTEED 50% returns?! Even I, with 900 years of magic, can't guarantee that! If someone promises guaranteed high returns, RUN! It's a PONZI scheme!", explanation: "Any scheme promising guaranteed returns above 10-12% is likely fraudulent. SEBI-registered products never guarantee returns." },
          { text: "Keep everything in a savings account — at least it's safe", is_correct: false, merlin_reaction: "Safe?! Your savings account gives 3-4% while inflation eats 6%! Your money is SHRINKING every year! That's not saving, that's slow financial death!", explanation: "Inflation-adjusted returns of savings accounts are NEGATIVE. Money must be invested to grow." },
          { text: "Put everything in one stock that's been going up", is_correct: false, merlin_reaction: "All eggs in one basket?! One bad earnings report and POOF — your ₹50,000 becomes ₹25,000! Diversification is the shield of the wise!", explanation: "Single-stock concentration risk is extremely high. Mutual funds provide built-in diversification." }
        ]
      },
      { type: "narration", text: "Arjun starts his SIP journey. Three months later, the market crashes 15% and his investment shows a loss of ₹2,000.", choices: [] },
      { type: "decision", text: "Arjun's SIP investment is showing -₹2,000 loss after a market crash. His uncle says 'market is gambling, withdraw now!' What should Arjun do?",
        choices: [
          { text: "Continue the SIP — crashes mean you're buying more units at lower prices", is_correct: true, merlin_reaction: "The WISDOM of a true financial warrior! When markets fall, your SIP buys MORE units at CHEAPER prices! It's like a discount sale for your future wealth!", explanation: "SIPs benefit from crashes through rupee cost averaging. Historical data shows markets always recover over 5+ year periods." },
          { text: "Stop the SIP and withdraw everything", is_correct: false, merlin_reaction: "SELLING during a crash?! That's buying high and selling low — the OPPOSITE of what smart investors do! You just turned a temporary dip into a permanent loss!", explanation: "Selling during a crash locks in losses. Markets historically recover within 1-2 years." },
          { text: "Stop SIP but don't withdraw — wait for recovery", is_correct: false, merlin_reaction: "Stopping the SIP means you MISS buying cheap units during the dip! You're throwing away the best part of the SIP magic — buying low!", explanation: "Pausing SIPs during dips means you miss the best buying opportunities." },
          { text: "Panic and move everything to fixed deposit", is_correct: false, merlin_reaction: "From equity to FD during a crash?! You just traded a temporary storm for permanently slow growth! FDs barely beat inflation!", explanation: "Moving to FDs locks in losses AND reduces future growth potential. Stay calm and continue." }
        ]
      },
      { type: "narration", text: "Six months in, Arjun's investments have recovered. He now has ₹80,000 in savings and wants to plan for bigger goals.", choices: [] },
      { type: "decision", text: "Arjun wants to invest ₹80,000 wisely. He's 24, has no emergency fund, and wants to buy a bike in 2 years. How should he allocate?",
        choices: [
          { text: "₹30K emergency fund (liquid fund), ₹30K in SIP, ₹20K in short-term debt fund for bike", is_correct: true, merlin_reaction: "A perfectly balanced portfolio! Emergency fund FIRST, then growth investments, then goal-based saving! You've learned well, young apprentice!", explanation: "Emergency fund (3-6 months expenses) is priority #1. SIP for long-term growth. Debt funds for short-term goals (1-3 years)." },
          { text: "Put all ₹80,000 in stocks for maximum returns", is_correct: false, merlin_reaction: "No emergency fund + all in stocks = DISASTER recipe! What if you lose your job AND the market crashes?! You'd have to sell at a loss for survival!", explanation: "Without an emergency fund, you're forced to liquidate investments at bad times." },
          { text: "₹80,000 in a fixed deposit for the bike", is_correct: false, merlin_reaction: "ALL of it for a BIKE?! No emergency fund, no long-term investments? A bike depreciates! Your financial health is more important than two wheels!", explanation: "Goal-based investing means allocating for multiple priorities, not just one want." },
          { text: "₹80,000 in crypto — it could 10x by the time he needs the bike", is_correct: false, merlin_reaction: "CRYPTO for a 2-year goal?! Crypto dropped 80% in 2022! Your bike fund could become a bicycle fund — or a WALKING fund! Never use volatile assets for short-term goals!", explanation: "Volatile assets (crypto, small-cap stocks) are unsuitable for short-term goals. Use debt funds or FDs for 1-3 year goals." }
        ]
      },
      { type: "decision", text: "A friend offers Arjun a 'tip' on a penny stock that's about to go '100x'. Should Arjun invest ₹10,000?",
        choices: [
          { text: "Ignore the tip — stick to researched, diversified investments", is_correct: true, merlin_reaction: "THE MARK OF A TRUE WIZARD! Stock tips are the fool's gold of investing! If someone REALLY knew a stock would go 100x, they wouldn't be sharing it with friends!", explanation: "Penny stocks are highly manipulated. 'Tips' often come from pump-and-dump schemes where early investors profit at your expense." },
          { text: "Invest ₹10,000 — if it works, amazing; if not, lesson learned", is_correct: false, merlin_reaction: "₹10,000 is NOT play money for a young earner! That's 2 months of SIP investments! 'Lessons' shouldn't cost this much when FREE knowledge exists!", explanation: "₹10,000 in SIP at 12% for 20 years would become ₹96,000. That's the real cost of this 'lesson'." },
          { text: "Research the penny stock and then decide", is_correct: false, merlin_reaction: "You can't properly research a penny stock — they have no reliable financials! It's like trying to read a book with invisible ink! The game is rigged!", explanation: "Penny stocks have poor disclosure, low liquidity, and are easily manipulated. Even research can't save you." },
          { text: "Invest ₹50,000 — go big or go home!", is_correct: false, merlin_reaction: "₹50,000 on a PENNY STOCK TIP?! I need to sit down... my heart can't take this! That's your ENTIRE emergency fund gone on a RUMOR!", explanation: "Concentrating large amounts in speculative penny stocks is pure gambling, not investing." }
        ]
      }
    ],
    good_ending: "Arjun's portfolio grows steadily. After 2 years, his SIP is worth ₹1.5 lakhs and he has a solid emergency fund. Merlin smiles: 'Patience and discipline — the true spells of wealth creation. You are ready, young wizard!'",
    bad_ending: "Arjun lost money chasing tips and has no emergency fund. Merlin sighs: 'The path to wealth is boring, young one. No shortcuts, no magic — just consistent SIPs and patience. Try again!'"
  }
};
