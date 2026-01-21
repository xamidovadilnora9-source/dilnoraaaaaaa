const groupsContainer = document.getElementById('groups');
let barChart, pieChart, lineChart;

for (const groupName in groups) {
    const table = document.createElement('table');
    table.innerHTML = `<caption><strong>${groupName}</strong></caption>`;

    const headerRow = document.createElement('tr');
    let headerHTML = `<th>Студент</th>`;
    daysOfWeek.forEach(day => headerHTML += `<th>${day}</th>`);
    headerRow.innerHTML = headerHTML;
    table.appendChild(headerRow);

    groups[groupName].forEach(student => {
        const row = document.createElement('tr');
        let rowHTML = `<td>${student}</td>`;
        daysOfWeek.forEach(day => {
            rowHTML += `<td><input type="checkbox" data-group="${groupName}" data-student="${student}" data-day="${day}"></td>`;
        });
        row.innerHTML = rowHTML;
        table.appendChild(row);
    });

    groupsContainer.appendChild(table);
}


// ---------------- FUNCTIONS ----------------

function getGroupAttendance() {
    const data = {};
    for (const group in groups) data[group] = 0;

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) data[cb.dataset.group]++;
    });

    return data;
}

function getWeeklyAttendance() {
    const weeklyData = {};
    daysOfWeek.forEach(day => weeklyData[day] = 0);

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        if (cb.checked) {
            const day = cb.dataset.day;
            weeklyData[day]++;
        }
    });

    return weeklyData;
}

function drawCharts() {
    const groupData = getGroupAttendance();
    const groupLabels = Object.keys(groupData);
    const groupValues = Object.values(groupData);

    const weeklyData = getWeeklyAttendance();
    const weekLabels = Object.keys(weeklyData);
    const weekValues = Object.values(weeklyData);

    // BAR
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (barChart) {
        barChart.data.datasets[0].data = groupValues;
        barChart.update();
    } else {
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: groupLabels,
                datasets: [{
                    label: 'Присутствовал студент',
                    data: groupValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Посещаемость по группам' }
                },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // PIE
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) {
        pieChart.data.datasets[0].data = groupValues;
        pieChart.update();
    } else {
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: groupLabels,
                datasets: [{
                    data: groupValues,
                    backgroundColor: ['orange', 'green', 'yellow']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Доля посещаемости групп' }
                }
            }
        });
    }


    // LINE
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    if (lineChart) {
        lineChart.data.datasets[0].data = weekValues;
        lineChart.update();
    } else {
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: weekLabels,
                datasets: [{
                    label: 'Посещаемость по дням',
                    data: weekValues,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Посещаемость по дням недели' }
                },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', drawCharts);
});

drawCharts();
