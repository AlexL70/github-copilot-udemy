
import { USERNAME_REGEX } from './regex.js';
document.addEventListener('DOMContentLoaded', () => {

    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    // Fetch dummy data and update input fields
    fetch('http://localhost:3000/dummy-data')
        .then(res => res.json())
        .then(data => {
            months.forEach((month, i) => {
                const incomeInput = document.getElementById(`${month}-income`);
                const expensesInput = document.getElementById(`${month}-expenses`);
                if (incomeInput) incomeInput.value = data.income[i];
                if (expensesInput) expensesInput.value = data.expenses[i];
            });
            // If chart is already initialized, update chart data
            if (barChart) {
                barChart.data.datasets[0].data = data.income;
                barChart.data.datasets[1].data = data.expenses;
                barChart.update();
            }
        });

    const getMonthlyData = () => {
        const income = [];
        const expenses = [];
        months.forEach(month => {
            const incomeValue = parseFloat(document.getElementById(`${month}-income`)?.value) || 0;
            const expensesValue = parseFloat(document.getElementById(`${month}-expenses`)?.value) || 0;
            income.push(incomeValue);
            expenses.push(expensesValue);
        });
        return { income, expenses };
    };

    /**
     * Handles username input field changes and validates the username format.
     * Updates the border color of the input field based on validation result.
     * 
     * @param {Event} e - The input event object
     * @param {HTMLInputElement} e.target - The username input element that triggered the event
     */
    function usernameInputCallback(e) {
        const username = e.target.value;
        console.log(`Username changed to: ${username}`);
        e.target.style.borderColor = USERNAME_REGEX.test(username) ? 'green' : 'red';
    }
    const usernameInput = document.getElementById('username');
    usernameInput?.addEventListener('input', usernameInputCallback);

    const ctx = document.getElementById('barChart')?.getContext('2d');
    const barChart = ctx && new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            datasets: [
                {
                    label: 'Income',
                    data: Array(12).fill(0),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                },
                {
                    label: 'Expenses',
                    data: Array(12).fill(0),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    document.getElementById('chart-tab')?.addEventListener('shown.bs.tab', () => {
        if (!barChart) return;
        const data = getMonthlyData();
        barChart.data.datasets[0].data = data.income;
        barChart.data.datasets[1].data = data.expenses;
        barChart.update();
    });

    document.getElementById('downloadBtn')?.addEventListener('click', () => {
        if (!barChart) return;
        const link = document.createElement('a');
        link.href = barChart.toBase64Image();
        link.download = 'bucks2bar-chart.png';
        link.click();
    });

    // Call sending email endpoint
    document.getElementById('sendEmailBtn')?.addEventListener('click', () => {
        const email = document.getElementById('userEmail').value;
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        if (!barChart) return;
        const chartImage = barChart.toBase64Image();

        fetch('http://localhost:3000/send-chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, chartImage })
        })
            // if response is ok, alert success, if body contains "message" field, alert it.
            // otherwise alert failure
            .then(res => {
                if (res.ok) {
                    alert('Chart sent!');
                } else {
                    return res.json().then(data => {
                        alert(data.message || 'Failed to send chart.');
                    });
                }
            })
            .catch(err => alert('Error: ' + err));
    });
});