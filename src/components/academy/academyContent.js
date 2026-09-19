export const ACADEMY_CATEGORIES = [
  { id: "start", title: "Start Here", description: "Understand the evaluation before placing a trade." },
  { id: "trader", title: "ACG Trader", description: "Learn the terminal and order workflow." },
  { id: "risk", title: "Risk Management", description: "Protect the account and control exposure." },
  { id: "basics", title: "Trading Basics", description: "Core market mechanics in plain language." },
  { id: "playbook", title: "Challenge Playbook", description: "Practical habits for evaluation accounts." },
];

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });
const s = (heading, body, example = null) => ({ heading, body, example });

export const ACADEMY_LESSONS = [
  {
    id: "how-acg-funded-works", category: "start", title: "How ACG Funded Works", duration: 3,
    summary: "Free trial, evaluation phases and the path to a funded account.",
    sections: [
      s("The journey", "ACG Funded gives you rule-based simulated trading accounts. A free trial lets you experience the platform first. Paid evaluations measure whether you can reach the profit objective while remaining inside the account risk limits."),
      s("Phases", "A 1-Step evaluation has one evaluation phase. A 2-Step evaluation has two. The dashboard always shows the rules and objective for the phase you are currently trading."),
      s("Your source of truth", "Use the dashboard objective and risk panels as the source of truth for your account. Rules can differ between challenge configurations.")
    ],
    quiz: [
      q("What is the purpose of the free trial?", ["Guarantee a payout", "Experience the platform and evaluation flow", "Remove all risk limits"], 1, "The free trial is for experiencing ACG Trader and the evaluation workflow before buying."),
      q("Where should you check the rules for your active account?", ["Dashboard", "A social post", "Another trader's account"], 0, "The dashboard reflects the rules attached to your account.")
    ]
  },
  {
    id: "understanding-your-challenge", category: "start", title: "Understanding Your Challenge", duration: 3,
    summary: "Read the objectives before you begin.",
    sections: [
      s("Four numbers matter", "Before trading, identify the profit target, daily loss limit, maximum loss limit and minimum trading days for the current phase."),
      s("Rules are account-specific", "Do not assume a rule from another challenge applies to yours. Your selected configuration is what matters."),
      s("Plan before execution", "Decide how much of the available loss buffer you are willing to use on one idea before opening the trade.")
    ],
    quiz: [
      q("Which value is phase-specific?", ["Profit target", "Your email address", "The ACG Trader logo"], 0, "Profit targets can change by evaluation phase."),
      q("What should happen before the first trade?", ["Ignore the rules", "Read the active account objectives", "Increase lot size"], 1, "Knowing the current rules is part of basic risk preparation.")
    ]
  },
  {
    id: "profit-targets", category: "start", title: "Profit Targets", duration: 2,
    summary: "Understand what progress toward a phase target means.",
    sections: [
      s("Target amount", "A percentage target translates into a monetary objective based on starting account size.", "$100,000 account × 8% target = $8,000."),
      s("Progress is not permission to over-risk", "Being close to a target does not change the loss limits. The remaining objective and remaining risk buffer are separate numbers."),
      s("Phase completion", "ACG Funded evaluates the applicable target together with any other requirements such as minimum trading days.")
    ],
    quiz: [
      q("An 8% target on $100,000 equals:", ["$800", "$8,000", "$80,000"], 1, "8% of $100,000 is $8,000."),
      q("Does being close to target remove drawdown rules?", ["Yes", "No", "Only on crypto"], 1, "Risk rules remain in force until the account state changes.")
    ]
  },
  {
    id: "daily-loss", category: "risk", title: "Understanding Daily Loss", duration: 4,
    summary: "Know how the daily buffer protects the account.",
    sections: [
      s("What it is", "The daily loss rule limits how much account value may be lost within the applicable risk day. Your dashboard shows the current usage and remaining buffer."),
      s("Open P&L matters", "A floating loss can reduce equity even before a position is closed. Watch equity and the dashboard risk buffer, not only realized balance."),
      s("Leave room", "Using nearly all of a daily limit leaves little room for spread, normal price movement or another losing position.", "$5,000 daily limit with $4,000 already used leaves only $1,000 of buffer.")
    ],
    quiz: [
      q("What can reduce equity before a trade is closed?", ["Floating loss", "Changing chart timeframe", "Opening the Academy"], 0, "Open-position P&L affects equity."),
      q("If most of the daily loss buffer is already used, the safer response is to:", ["Increase exposure", "Reduce or stop new exposure", "Ignore equity"], 1, "Preserving remaining buffer reduces the chance of a rule breach.")
    ]
  },
  {
    id: "maximum-loss", category: "risk", title: "Maximum Loss", duration: 3,
    summary: "Understand the account-wide loss boundary.",
    sections: [
      s("Different from daily loss", "Maximum loss is the broader account loss boundary. It is not reset simply because a new trading day begins."),
      s("Track the remaining distance", "The useful number is not only the limit itself, but how much room remains between current account state and the maximum-loss boundary."),
      s("Protect the account", "When the remaining buffer becomes small, reducing total exposure is more important than trying to recover quickly.")
    ],
    quiz: [
      q("Does maximum loss normally reset every trading day?", ["Yes", "No", "Only after a winning trade"], 1, "Maximum loss is an account-level boundary rather than a daily reset."),
      q("A shrinking maximum-loss buffer should generally lead to:", ["More leverage", "Lower exposure", "More simultaneous trades"], 1, "Lower exposure protects the remaining account buffer.")
    ]
  },
  {
    id: "account-breaches", category: "start", title: "Account Breaches", duration: 3,
    summary: "What happens when a hard evaluation rule is broken.",
    sections: [
      s("Hard limits", "When a hard risk rule is breached, the account can be locked or disabled according to its configured evaluation policy."),
      s("Do not rely on manual reaction time", "Fast markets can move through a remaining buffer quickly. Position sizing should account for this before execution."),
      s("Use the dashboard", "The dashboard risk section is designed to show how close the account is to the current limits.")
    ],
    quiz: [
      q("What is the best time to manage breach risk?", ["Before opening exposure", "After the account is breached", "Only after a payout"], 0, "Risk should be defined before the position is opened."),
      q("Where is remaining risk buffer shown?", ["Dashboard", "Browser history", "Email signature"], 0, "The dashboard provides the active account risk state.")
    ]
  },
  {
    id: "acg-trader-overview", category: "trader", title: "ACG Trader Overview", duration: 3,
    summary: "Find the chart, watchlist, execution and position areas.",
    sections: [
      s("Chart first", "The chart is the central workspace. Instrument, timeframe and market state are shown around it."),
      s("Execution controls", "Buy and Sell use the current executable bid/ask. The lot-size control determines requested volume."),
      s("Positions and history", "Open positions, pending orders and trade history are available from the terminal workspace.")
    ],
    quiz: [
      q("What determines the size of a manual market order?", ["Lot size", "Chart color", "Watchlist order"], 0, "The lot-size control determines requested volume."),
      q("Where do you review open exposure?", ["Positions", "Academy progress", "Login form"], 0, "Open positions are shown in the positions area.")
    ]
  },
  {
    id: "opening-your-first-trade", category: "trader", title: "Opening Your First Trade", duration: 4,
    summary: "A simple pre-trade execution checklist.",
    sections: [
      s("Select the instrument", "Confirm the symbol, live bid/ask and that the market is available for execution."),
      s("Choose volume", "Set lot size deliberately. Check how that exposure fits within your account risk plan."),
      s("Execute", "Buy opens long exposure; Sell opens short exposure. A market order is filled using the current executable quote, which may differ slightly from the displayed price.")
    ],
    quiz: [
      q("Before pressing Buy or Sell, confirm:", ["Symbol, quote and volume", "Only the chart color", "Only your balance"], 0, "Those three checks prevent common execution mistakes."),
      q("A market order is filled at:", ["A guaranteed historical price", "The executable market quote", "Yesterday's close"], 1, "Market execution uses the executable quote available to the server.")
    ]
  },
  {
    id: "market-vs-pending-orders", category: "trader", title: "Market vs Pending Orders", duration: 4,
    summary: "Choose between immediate and conditional execution.",
    sections: [
      s("Market order", "A market order requests immediate execution at the current executable price."),
      s("Limit order", "A limit order waits for a specified price intended to improve the entry relative to current market price."),
      s("Stop order", "A stop order activates when price reaches a trigger level, commonly used for breakout-style entries.")
    ],
    quiz: [
      q("Which order requests immediate execution?", ["Market", "Limit", "Stop"], 0, "Market orders execute against the current market."),
      q("Which order waits for a trigger before activating?", ["Market", "Stop", "Close"], 1, "Stop orders activate when the stop trigger is reached.")
    ]
  },
  {
    id: "stop-loss-take-profit", category: "trader", title: "Stop Loss & Take Profit", duration: 4,
    summary: "Define exit levels before emotion takes over.",
    sections: [
      s("Stop loss", "A stop loss defines a price at which the platform should close exposure to limit further loss, subject to executable market conditions."),
      s("Take profit", "A take-profit level requests closure when the favorable price level is reached."),
      s("Risk first", "Choose the stop based on the trade plan, then choose position size that keeps the monetary risk acceptable—not the other way around.")
    ],
    quiz: [
      q("What should come first in a risk-based plan?", ["A random lot size", "The invalidation/stop level", "A profit screenshot"], 1, "Define the trade invalidation point before sizing exposure."),
      q("Does a stop loss make market gaps impossible?", ["Yes", "No"], 1, "Execution still depends on available market prices.")
    ]
  },
  {
    id: "lot-sizes", category: "risk", title: "Lot Sizes", duration: 4,
    summary: "Understand why volume changes P&L sensitivity.",
    sections: [
      s("Volume controls sensitivity", "For the same price movement, a larger position produces a larger profit or loss."),
      s("Instrument contracts differ", "One lot does not represent the same underlying exposure for every asset. Contract size and instrument specifications matter."),
      s("Use smaller steps", "When uncertain, reducing size gives the account more room for normal market movement and multiple independent ideas.")
    ],
    quiz: [
      q("If price movement is identical, a larger position usually creates:", ["Smaller P&L movement", "Larger P&L movement", "No difference"], 1, "Greater exposure increases P&L sensitivity."),
      q("Is one lot economically identical across every instrument?", ["Yes", "No"], 1, "Contract specifications differ by instrument.")
    ]
  },
  {
    id: "balance-vs-equity", category: "risk", title: "Balance vs Equity", duration: 3,
    summary: "Why open positions make these two numbers different.",
    sections: [
      s("Balance", "Balance reflects realized account value after completed transactions."),
      s("Equity", "Equity includes the current effect of open-position P&L."),
      s("Risk watches equity", "When open positions are losing, equity can be below balance. That difference matters for drawdown awareness.")
    ],
    quiz: [
      q("Which value reflects floating P&L?", ["Equity", "Email", "Account code"], 0, "Equity includes open-position P&L."),
      q("Can equity be below balance while positions are open?", ["Yes", "No"], 0, "Floating losses can make equity lower than balance.")
    ]
  },
  {
    id: "margin-and-leverage", category: "risk", title: "Margin & Leverage", duration: 4,
    summary: "Understand used margin, free margin and leverage.",
    sections: [
      s("Margin", "Margin is account capacity reserved to support open exposure. It is not the same thing as maximum possible loss."),
      s("Free margin", "Free margin is the remaining capacity after used margin and current equity are considered."),
      s("Leverage", "Leverage allows larger notional exposure relative to account capital. It increases how much market exposure can be controlled; it does not reduce the underlying trading risk.")
    ],
    quiz: [
      q("What does free margin represent?", ["Remaining account capacity for margin", "Guaranteed profit", "Daily target"], 0, "Free margin is the capacity remaining after current margin usage."),
      q("Does higher leverage make price risk disappear?", ["Yes", "No"], 1, "Leverage changes capital requirements, not market-price risk.")
    ]
  },
  {
    id: "risk-per-trade", category: "risk", title: "Risk Per Trade", duration: 4,
    summary: "Translate a percentage risk budget into money.",
    sections: [
      s("Start with money", "A percentage risk budget can be translated into a monetary amount before sizing the position.", "$100,000 account × 0.5% = $500 planned risk."),
      s("Compare to account buffer", "The planned loss should be considered alongside daily and maximum loss remaining."),
      s("Avoid recovery sizing", "Increasing risk simply because the previous trade lost can rapidly consume the evaluation buffer.")
    ],
    quiz: [
      q("0.5% of $100,000 is:", ["$50", "$500", "$5,000"], 1, "0.5% equals $500."),
      q("After a losing trade, automatically increasing risk is:", ["A required rule", "A recovery-sizing behavior that can consume buffer quickly", "Risk-free"], 1, "Risk should be planned independently of the desire to recover losses.")
    ]
  },
  {
    id: "long-short-bid-ask", category: "basics", title: "Long, Short, Bid & Ask", duration: 3,
    summary: "The mechanics behind Buy and Sell.",
    sections: [
      s("Long and short", "A long position benefits when the market rises relative to entry; a short position benefits when it falls relative to entry."),
      s("Bid and ask", "The bid is the executable sell-side quote and the ask is the executable buy-side quote."),
      s("Spread", "The difference between ask and bid is the spread, an immediate execution cost to consider.")
    ],
    quiz: [
      q("A Buy market order normally executes against the:", ["Ask", "Bid"], 0, "Buying uses the ask side of the market."),
      q("The difference between bid and ask is called:", ["Margin", "Spread", "Target"], 1, "The bid/ask difference is the spread.")
    ]
  },
  {
    id: "candles-trend-volatility", category: "basics", title: "Candles, Trend & Volatility", duration: 4,
    summary: "Read basic price behavior without overcomplication.",
    sections: [
      s("Candles", "A candle summarizes open, high, low and close for a timeframe."),
      s("Trend", "Trend describes the broader direction of price over the period being observed. Different timeframes can show different structures."),
      s("Volatility", "Volatility describes the size and speed of price movement. Higher volatility can increase both opportunity and loss speed.")
    ],
    quiz: [
      q("A candle contains:", ["Open, high, low and close", "Only volume", "Only profit"], 0, "OHLC values define the candle."),
      q("Higher volatility can make losses develop:", ["More slowly in every case", "More quickly", "Impossible"], 1, "Larger/faster moves can consume risk buffer faster.")
    ]
  },
  {
    id: "market-sessions-news", category: "basics", title: "Sessions & News Risk", duration: 3,
    summary: "Know when market conditions can change quickly.",
    sections: [
      s("Sessions", "Liquidity and volatility can vary by market session and instrument."),
      s("Economic events", "High-impact economic releases can create rapid price moves and wider spreads."),
      s("Check restrictions", "Use the ACG Funded Calendar and your account rules to understand any applicable trading restrictions before major events.")
    ],
    quiz: [
      q("High-impact news can cause:", ["Rapid moves and wider spreads", "Guaranteed profits", "No price changes"], 0, "News can materially change liquidity and volatility."),
      q("Where should you check applicable event restrictions?", ["ACG Funded Calendar and account rules", "Random forum posts", "A different firm's rules"], 0, "Use the information tied to your ACG Funded account.")
    ]
  },
  {
    id: "managing-losing-days", category: "playbook", title: "Managing Losing Days", duration: 4,
    summary: "Protect the account when execution is not going your way.",
    sections: [
      s("Losses change the available buffer", "After losses, the account has less room before its risk limits. The next decision should reflect that reduced buffer."),
      s("Avoid escalation", "More trades and larger size can turn an ordinary losing session into a rule breach."),
      s("Define a personal stop", "A personal daily stop can be stricter than the hard account limit, leaving room for uncertainty and execution costs.")
    ],
    quiz: [
      q("After multiple losses, available risk buffer is generally:", ["Larger", "Smaller", "Unchanged in every case"], 1, "Losses consume part of the available buffer."),
      q("A personal stop can be:", ["Stricter than the hard account limit", "Only larger than the hard limit", "Ignored"], 0, "Stopping before the hard boundary leaves a safety margin.")
    ]
  },
  {
    id: "protecting-near-target", category: "playbook", title: "Protecting a Challenge Near Target", duration: 4,
    summary: "Avoid turning strong progress into unnecessary risk.",
    sections: [
      s("Separate objective from risk", "The final part of a profit target is still subject to the same loss limits."),
      s("Reduce unnecessary exposure", "When little target remains, you may not need the same exposure that was used earlier in the phase."),
      s("Meet every requirement", "A profit target alone may not complete a phase if minimum trading-day or other requirements are still outstanding.")
    ],
    quiz: [
      q("Near the target, drawdown rules:", ["Still apply", "Disappear", "Only apply to forex"], 0, "Risk rules continue to apply."),
      q("Can reaching the profit number be insufficient by itself?", ["Yes", "No"], 0, "Other account requirements can still matter.")
    ]
  }
];

export const ACADEMY_LESSON_MAP = Object.fromEntries(ACADEMY_LESSONS.map(lesson => [lesson.id, lesson]));
export const academyCategory = id => ACADEMY_CATEGORIES.find(category => category.id === id) || ACADEMY_CATEGORIES[0];
