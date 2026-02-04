const symbols = [
  { icon: "🍀", weight: 2, payout: 30 },
  { icon: "⭐", weight: 3, payout: 20 },
  { icon: "🍒", weight: 5, payout: 12 },
  { icon: "🔔", weight: 7, payout: 8 },
  { icon: "🍋", weight: 9, payout: 5 },
  { icon: "🍇", weight: 10, payout: 4 }
];

const balanceEl = document.getElementById("balance");
const wageredEl = document.getElementById("wagered");
const profitEl = document.getElementById("profit");
const reels = [
  document.getElementById("reel-1"),
  document.getElementById("reel-2"),
  document.getElementById("reel-3")
];
const resultEl = document.getElementById("result");
const betInput = document.getElementById("bet");
const depositInput = document.getElementById("deposit");
const depositButton = document.getElementById("deposit-btn");
const spinButton = document.getElementById("spin");
const spinsEl = document.getElementById("spins");
const biggestWinEl = document.getElementById("biggest-win");
const lastWinEl = document.getElementById("last-win");
const historyEl = document.getElementById("history");

let balance = 0;
let totalWagered = 0;
let totalWon = 0;
let spins = 0;
let biggestWin = 0;

const weightedPool = symbols.flatMap((symbol) =>
  Array(symbol.weight).fill(symbol)
);

const formatCash = (value) => `$${value.toLocaleString()}`;

const updateStats = () => {
  balanceEl.textContent = formatCash(balance);
  wageredEl.textContent = formatCash(totalWagered);
  profitEl.textContent = formatCash(totalWon - totalWagered);
  spinsEl.textContent = spins.toString();
  biggestWinEl.textContent = formatCash(biggestWin);
};

const addHistory = (text, isWin) => {
  const item = document.createElement("li");
  item.textContent = text;
  item.style.color = isWin ? "#9fffd1" : "#ffb5c6";
  historyEl.prepend(item);
  while (historyEl.children.length > 8) {
    historyEl.removeChild(historyEl.lastChild);
  }
};

const getRandomSymbol = () => {
  const choice = weightedPool[Math.floor(Math.random() * weightedPool.length)];
  return choice;
};

const evaluateSpin = (spinResult, bet) => {
  const icons = spinResult.map((symbol) => symbol.icon);
  const uniqueIcons = new Set(icons);

  if (uniqueIcons.size === 1) {
    const payout = spinResult[0].payout * bet;
    return {
      win: payout,
      message: `Jackpot! ${icons.join(" ")} pays ${spinResult[0].payout}×.`
    };
  }

  if (uniqueIcons.size === 2) {
    const payout = bet * 2;
    return {
      win: payout,
      message: `Nice pair! ${icons.join(" ")} pays 2×.`
    };
  }

  return { win: 0, message: `No match. ${icons.join(" ")}` };
};

const spin = () => {
  const bet = Number.parseInt(betInput.value, 10);
  if (!Number.isFinite(bet) || bet <= 0) {
    resultEl.textContent = "Enter a valid bet amount.";
    return;
  }

  if (balance < bet) {
    resultEl.textContent = "Not enough credits. Load more to continue.";
    return;
  }

  balance -= bet;
  totalWagered += bet;

  const spinResult = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
  spinResult.forEach((symbol, index) => {
    reels[index].textContent = symbol.icon;
  });

  const outcome = evaluateSpin(spinResult, bet);
  spins += 1;

  if (outcome.win > 0) {
    balance += outcome.win;
    totalWon += outcome.win;
    biggestWin = Math.max(biggestWin, outcome.win);
    lastWinEl.textContent = formatCash(outcome.win);
    resultEl.textContent = outcome.message + ` You won ${formatCash(outcome.win)}.`;
    addHistory(`Win ${formatCash(outcome.win)} · ${spinResult.map((s) => s.icon).join(" ")}`, true);
  } else {
    lastWinEl.textContent = formatCash(0);
    resultEl.textContent = outcome.message + " Better luck next spin.";
    addHistory(`Loss ${formatCash(bet)} · ${spinResult.map((s) => s.icon).join(" ")}`, false);
  }

  updateStats();
};

const loadCredits = () => {
  const deposit = Number.parseInt(depositInput.value, 10);
  if (!Number.isFinite(deposit) || deposit <= 0) {
    resultEl.textContent = "Enter a valid credit amount to load.";
    return;
  }
  balance += deposit;
  resultEl.textContent = `Loaded ${formatCash(deposit)} in virtual credits.`;
  updateStats();
};

spinButton.addEventListener("click", spin);
spinButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    spin();
  }
});

depositButton.addEventListener("click", loadCredits);

depositInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadCredits();
  }
});

updateStats();
