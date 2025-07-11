document.addEventListener('DOMContentLoaded', () => {
  // Tema kontrolü (dark-mode)
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Varsayılan örnek loglar
  const defaultLogs = [
    { user: "Admin01", action: "Updated settings", date: "2025-07-04" },
    { user: "JohnDoe", action: "Logged in", date: "2025-07-04" },
    { user: "Guest007", action: "Viewed report", date: "2025-07-03" },
    { user: "Admin01", action: "Added user", date: "2025-07-03" },
    { user: "Jane99", action: "Logged out", date: "2025-07-02" }
  ];

  // localStorage'dan logları al
  const logs = JSON.parse(localStorage.getItem('activityLogs')) || defaultLogs;

  // Top Users hesapla
  const userCounts = {};
  logs.forEach(log => {
    userCounts[log.user] = (userCounts[log.user] || 0) + 1;
  });

  const sortedUsers = Object.entries(userCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([user]) => user);

  document.querySelector('.card:nth-child(1) p').textContent = sortedUsers.slice(0, 3).join(', ');

  // Toplam login sayısını hesapla
  const loginCount = logs.filter(l => l.action === 'Logged in').length;
  document.querySelector('.card:nth-child(2) p').textContent = `${loginCount} this month`;

  // Uptime sabit
  document.querySelector('.card:nth-child(3) p').textContent = "99.97%";

  // Aktivite tablosunu doldur
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  logs.forEach(log => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${log.user}</td>
      <td>${log.action}</td>
      <td>${log.date}</td>
    `;
    tbody.appendChild(row);
  });

  // Raporları sıfırlama butonu (isteğe bağlı)
  const resetButton = document.createElement('button');
  resetButton.textContent = '🗑 Clear Logs';
  resetButton.id = 'reset-reports';
  resetButton.style.cssText = 'margin-top:20px; display:block;';
  document.querySelector('.reports-container').appendChild(resetButton);

  resetButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all logs?")) {
      localStorage.removeItem('activityLogs');
      location.reload();
    }
  });
});
