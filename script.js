const screen = document.getElementById("screen");
const historyEl = document.getElementById("history");

let current = "0";
let history = "";
let operator = null;
let resetNext = false;

function updateScreen() {
  screen.textContent = current;
  historyEl.textContent = history;
}

function inputNumber(num) {
  if (resetNext) {
    current = num;
    resetNext = false;
  } else {
    current = current === "0" ? num : current + num;
  }
  updateScreen();
}

function inputOperator(op) {
  if (operator !== null) calculate();
  history = current + " " + op;
  operator = op;
  resetNext = true;
  updateScreen();
}

function calculate() {
  if (operator === null) return;
  let expression = history + " " + current;
  try {
    current = String(eval(expression.replace("÷", "/").replace("×", "*")));
  } catch {
    current = "Erro";
  }
  operator = null;
  history = "";
  updateScreen();
}

document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.num) inputNumber(btn.dataset.num);
    else if (btn.dataset.op) inputOperator(btn.dataset.op);
    else if (btn.dataset.action === "clear") {
      current = "0"; history = ""; operator = null;
      updateScreen();
    } else if (btn.dataset.action === "backspace") {
      current = current.slice(0, -1) || "0";
      updateScreen();
    } else if (btn.dataset.action === "toggle-sign") {
      current = String(parseFloat(current) * -1);
      updateScreen();
    } else if (btn.dataset.action === "equals") {
      calculate();
    }
  });
});

updateScreen();
