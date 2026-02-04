const equationEl = document.getElementById("equation");
const resultEl = document.getElementById("result");
const keypad = document.querySelector(".keypad");

const calculatorState = {
  currentValue: "0",
  previousValue: null,
  operator: null,
  awaitingNextValue: false,
};

const formatDisplayValue = (value) => {
  if (value === "") return "0";
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return Number.isInteger(number)
    ? number.toString()
    : number.toLocaleString("en-US", { maximumFractionDigits: 8 });
};

const updateDisplay = () => {
  const equationParts = [];
  if (calculatorState.previousValue !== null) {
    equationParts.push(calculatorState.previousValue);
  }
  if (calculatorState.operator) {
    equationParts.push(calculatorState.operator);
  }
  if (calculatorState.awaitingNextValue) {
    equationEl.textContent = equationParts.join(" ");
  } else {
    equationEl.textContent = equationParts.concat(calculatorState.currentValue).join(" ");
  }

  resultEl.textContent = formatDisplayValue(calculatorState.currentValue);
};

const resetCalculator = () => {
  calculatorState.currentValue = "0";
  calculatorState.previousValue = null;
  calculatorState.operator = null;
  calculatorState.awaitingNextValue = false;
  updateDisplay();
};

const handleDigit = (digit) => {
  if (calculatorState.awaitingNextValue) {
    calculatorState.currentValue = digit;
    calculatorState.awaitingNextValue = false;
  } else {
    calculatorState.currentValue =
      calculatorState.currentValue === "0"
        ? digit
        : calculatorState.currentValue + digit;
  }
  updateDisplay();
};

const handleDecimal = () => {
  if (calculatorState.awaitingNextValue) {
    calculatorState.currentValue = "0.";
    calculatorState.awaitingNextValue = false;
    updateDisplay();
    return;
  }
  if (!calculatorState.currentValue.includes(".")) {
    calculatorState.currentValue += ".";
    updateDisplay();
  }
};

const compute = (firstValue, secondValue, operator) => {
  const first = Number(firstValue);
  const second = Number(secondValue);
  if (Number.isNaN(first) || Number.isNaN(second)) return secondValue;

  switch (operator) {
    case "+":
      return (first + second).toString();
    case "-":
      return (first - second).toString();
    case "*":
      return (first * second).toString();
    case "/":
      return second === 0 ? "Error" : (first / second).toString();
    default:
      return secondValue;
  }
};

const handleOperator = (nextOperator) => {
  const { currentValue, previousValue, operator, awaitingNextValue } = calculatorState;

  if (operator && awaitingNextValue) {
    calculatorState.operator = nextOperator;
    updateDisplay();
    return;
  }

  if (previousValue === null) {
    calculatorState.previousValue = currentValue;
  } else if (operator) {
    const computed = compute(previousValue, currentValue, operator);
    calculatorState.previousValue = computed;
    calculatorState.currentValue = computed;
  }

  calculatorState.operator = nextOperator;
  calculatorState.awaitingNextValue = true;
  updateDisplay();
};

const handlePercent = () => {
  const value = Number(calculatorState.currentValue);
  if (Number.isNaN(value)) return;
  calculatorState.currentValue = (value / 100).toString();
  updateDisplay();
};

const handleToggleSign = () => {
  if (calculatorState.currentValue === "0") return;
  if (calculatorState.currentValue.startsWith("-")) {
    calculatorState.currentValue = calculatorState.currentValue.slice(1);
  } else {
    calculatorState.currentValue = `-${calculatorState.currentValue}`;
  }
  updateDisplay();
};

const handleEquals = () => {
  if (!calculatorState.operator || calculatorState.awaitingNextValue) return;
  const computed = compute(
    calculatorState.previousValue,
    calculatorState.currentValue,
    calculatorState.operator
  );
  calculatorState.currentValue = computed;
  calculatorState.previousValue = null;
  calculatorState.operator = null;
  calculatorState.awaitingNextValue = false;
  updateDisplay();
};

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case "digit":
      handleDigit(value);
      break;
    case "decimal":
      handleDecimal();
      break;
    case "operator":
      handleOperator(value);
      break;
    case "clear":
      resetCalculator();
      break;
    case "percent":
      handlePercent();
      break;
    case "toggle-sign":
      handleToggleSign();
      break;
    case "equals":
      handleEquals();
      break;
    default:
      break;
  }
});

updateDisplay();
