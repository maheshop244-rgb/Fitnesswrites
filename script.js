// ===== FOOD DATABASE =====
const foodCalories = {
  rice: 130, biryani: 180, noodles: 220,
  roti: 120, dosa: 150, idli: 60,
  egg: 70, banana: 100, apple: 95,
  chicken: 250, fish: 200,
  milk: 60, juice: 50
};

let foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];
let weightLog = JSON.parse(localStorage.getItem("weightLog")) || [];

// ===== AUTO DETECT FUNCTION =====
function parseFoodInput(input) {
  input = input.toLowerCase();

  let qty = 1;
  let unit = "piece";
  let food = input;

  // Detect grams
  let gMatch = input.match(/(\d+)\s*g/);
  if (gMatch) {
    qty = Number(gMatch[1]);
    unit = "g";
    food = input.replace(gMatch[0], "").trim();
  }

  // Detect ml
  let mlMatch = input.match(/(\d+)\s*ml/);
  if (mlMatch) {
    qty = Number(mlMatch[1]);
    unit = "ml";
    food = input.replace(mlMatch[0], "").trim();
  }

  // Detect pieces (numbers)
  let numMatch = input.match(/^(\d+)/);
  if (numMatch && unit === "piece") {
    qty = Number(numMatch[1]);
    food = input.replace(numMatch[0], "").trim();
  }

  return { food, qty, unit };
}

// ===== GUESS =====
function guessCalories(food) {
  if (foodCalories[food]) return foodCalories[food];

  if (food.includes("fried")) return 300;
  if (food.includes("rice")) return 180;
  if (food.includes("chicken")) return 250;

  return 180;
}

// ===== CALCULATE =====
function calculateCalories(food, qty, unit) {
  let base = guessCalories(food);

  if (unit === "g") return (base / 100) * qty;
  if (unit === "ml") return (base / 100) * qty;
  if (unit === "piece") return base * qty;

  return base;
}

// ===== ADD FOOD =====
function addFood() {
  let input = document.getElementById("food").value;
  if (!input) return;

  let parsed = parseFoodInput(input);

  let calories = calculateCalories(parsed.food, parsed.qty, parsed.unit);

  foodLog.push({
    food: parsed.food,
    quantity: parsed.qty,
    unit: parsed.unit,
    calories: Math.round(calories),
    date: new Date().toLocaleDateString()
  });

  document.getElementById("food").value = "";

  save();
  render();
}

// ===== SAVE =====
function save() {
  localStorage.setItem("foodLog", JSON.stringify(foodLog));
  localStorage.setItem("weightLog", JSON.stringify(weightLog));
}

// ===== WEIGHT =====
function addWeight() {
  let w = document.getElementById("weight").value;
  if (!w) return;

  weightLog.push({
    weight: Number(w),
    date: new Date().toLocaleDateString()
  });

  document.getElementById("weight").value = "";

  save();
  render();
}

// ===== RENDER =====
function render() {
  let total = foodLog.reduce((a,b)=>a+b.calories,0);
  document.getElementById("totalCalories").innerText = "Calories: " + total;

  let latest = weightLog.length ? weightLog[weightLog.length-1].weight : "-";
  document.getElementById("latestWeight").innerText = "Weight: " + latest;

  document.getElementById("foodLog").innerHTML =
    foodLog.map(i=>`${i.date} - ${i.food} (${i.quantity}${i.unit}) = ${i.calories} kcal`).join("<br>");

  document.getElementById("weightLog").innerHTML =
    weightLog.map(i=>`${i.date} - ${i.weight} kg`).join("<br>");
}

// ===== CLEAR =====
function clearAll() {
  localStorage.clear();
  foodLog=[]; weightLog=[];
  render();
}

render();