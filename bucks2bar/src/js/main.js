document.addEventListener('DOMContentLoaded', function () {
    function getMonthlyData() {
        const months = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];

        const income = [];
        const expenses = [];

        months.forEach(month => {
            const incomeValue = parseFloat(document.getElementById(`${month}-income`).value) || 0;
            const expensesValue = parseFloat(document.getElementById(`${month}-expenses`).value) || 0;
            income.push(incomeValue);
            expenses.push(expensesValue);
        });

        return { income, expenses };
    }

    const ctx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            datasets: [{
                label: 'Income',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }, {
                label: 'Expenses',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }]
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

    // Add event listener for Chart tab shown
    document.getElementById('chart-tab').addEventListener('shown.bs.tab', function () {
        const data = getMonthlyData();
        barChart.data.datasets[0].data = data.income;
        barChart.data.datasets[1].data = data.expenses;
        barChart.update();
    });
});