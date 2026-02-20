let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;
let income = Number(localStorage.getItem("income")) || 0;
let chart;

// Save data to local storage
function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("budget", budget);
    localStorage.setItem("income", income);
}

// Set Income
function setIncome() {
    income = Number(document.getElementById("incomeInput").value);
    saveData();
    updateUI();
}

// Set Budget
function setBudget() {
    budget = Number(document.getElementById("budgetInput").value);
    saveData();
    updateUI();
}

// Add Expense
function addExpense() {
    let desc = document.getElementById("desc").value;
    let category = document.getElementById("category").value;
    let amount = Number(document.getElementById("amount").value);
    let date = document.getElementById("date").value;

    if (!date) {
        alert("Please fill all fields!");
        return;
    }

    let month = date.slice(0, 7);

    

    expenses.push({ desc, category, amount, month });

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";

    saveData();
    updateUI();
}

// Delete Expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveData();
    updateUI();
}

// Clear All Data
function clearAll() {
    if (confirm("Are you sure you want to delete all data?")) {
        expenses = [];
        budget = 0;
        income = 0;
        localStorage.clear();
        updateUI();
    }
}

// Download CSV File
function downloadPDF() {
    let csv = "Description,Category,Amount\n";

    expenses.forEach(e => {
        csv += `${e.desc},${e.category},${e.amount}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ExpenseReport.csv";
    link.click();
}

// Update UI
function updateUI() {
    let total = expenses.reduce((sum, e) => sum + e.amount, 0);
    let remaining = budget - total;
    let balance = income - total;

    document.getElementById("totalExpense").innerText = "₹" + total;
    document.getElementById("budgetDisplay").innerText = "₹" + budget;
    document.getElementById("remainingAmount").innerText = "₹" + remaining;
    document.getElementById("balanceAmount").innerText = "₹" + balance;

    // Budget Progress
    let percent = budget ? (total / budget) * 100 : 0;
    let progressBar = document.getElementById("progressBar");
    let warning = document.getElementById("warning");

    if (progressBar) {
        progressBar.style.width = percent + "%";

        if (percent >= 100) {
            progressBar.style.background = "red";
            if (warning) warning.innerText = "⚠ Budget Exceeded!";
        } else if (percent >= 80) {
            progressBar.style.background = "orange";
            if (warning) warning.innerText = "⚠ 80% Budget Used!";
        } else {
            progressBar.style.background = "#4caf50";
            if (warning) warning.innerText = "";
        }
    }

    // Update Expense List
    let list = document.getElementById("expenseList");
    if (list) {
        list.innerHTML = "";

        expenses.forEach((e, index) => {
            list.innerHTML += `
                <li>
                    ${e.desc} - ₹${e.amount} (${e.category})
                    <button onclick="deleteExpense(${index})">Delete</button>
                </li>
            `;
        });
    }

    updateChart();
}

// Update Chart
function updateChart() {
    let ctx = document.getElementById("expenseChart");
    if (!ctx) return;

    let categoryTotals = {};

    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "#ff6b6b",
                    "#4ecdc4",
                    "#f7b731",
                    "#5f27cd",
                    "#20bf6b"
                ]
            }]
        }
    });
}

// Dark Mode Toggle
function toggleMode() {
    document.body.classList.toggle("dark");
}

// Load UI on page start
updateUI();