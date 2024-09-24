document.addEventListener('DOMContentLoaded', function () {
    loadExpensesFromLocalStorage();

    // Navbar toggle for mobile
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    navbarToggle.addEventListener('click', function () {
        navbarMenu.classList.toggle('active');
    });
});

document.getElementById('add-expense-btn').addEventListener('click', function () {
    const name = document.getElementById('expense-name').value.trim();
    const amount = document.getElementById('expense-amount').value.trim();

    if (name && amount && parseFloat(amount) > 0) {
        const expense = {
            id: Date.now(),
            name,
            amount: parseFloat(amount)
        };
        addExpenseToDOM(expense);
        addExpenseToLocalStorage(expense);
        updateTotalAmount();
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
    } else {
        alert('Please enter valid details');
    }
});

document.getElementById('clear-expenses-btn').addEventListener('click', clearAllExpenses);

function addExpenseToDOM(expense) {
    const expenseList = document.getElementById('expense-list');

    const expenseItem = document.createElement('li');
    expenseItem.setAttribute('data-id', expense.id);

    expenseItem.innerHTML = `
        ${expense.name} - $${expense.amount.toFixed(2)}
        <button class="delete-btn">Delete</button>
    `;

    expenseItem.querySelector('.delete-btn').addEventListener('click', function () {
        removeExpense(expense.id);
    });

    expenseList.appendChild(expenseItem);
}

function addExpenseToLocalStorage(expense) {
    const expenses = getExpensesFromLocalStorage();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function loadExpensesFromLocalStorage() {
    const expenses = getExpensesFromLocalStorage();
    expenses.forEach(expense => addExpenseToDOM(expense));
    updateTotalAmount();
}

function getExpensesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

function updateTotalAmount() {
    const expenses = getExpensesFromLocalStorage();
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

function removeExpense(id) {
    const expenses = getExpensesFromLocalStorage();
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    const expenseItem = document.querySelector(`[data-id="${id}"]`);
    if (expenseItem) {
        expenseItem.remove();
    }

    updateTotalAmount();
}

function clearAllExpenses() {
    localStorage.removeItem('expenses');
    document.getElementById('expense-list').innerHTML = '';
    updateTotalAmount();
}
