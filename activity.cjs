function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();

  if (date > now) return 'Just now';

  const diff = (now - date) / 1000; // saniye

  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' minute(s) ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hour(s) ago';
  if (diff < 172800) return 'Yesterday';
  return date.toLocaleDateString();
}

function renderLogs(filter = 'all') {
  const activityLogs = JSON.parse(localStorage.getItem('activityLogs')) || [];
  let filteredLogs = activityLogs;

  if (filter !== 'all') {
    filteredLogs = activityLogs.filter(log => log.type === filter);
  }

  logList.innerHTML = '';

  if (filteredLogs.length === 0) {
    logList.innerHTML = '<p>No activity yet.</p>';
    return;
  }

  filteredLogs.forEach(log => {
    const iconMap = {
      login: '🔐',
      update: '✏️',
      delete: '🗑️'
    };
    const icon = iconMap[log.type] || 'ℹ️';

    const div = document.createElement('div');
    div.className = `log-entry ${log.type}`;

    div.innerHTML = `
      <span class="icon">${icon}</span>
      <div class="details">
        <p>${log.action} by <strong>${log.user}</strong>.</p>
        <span class="timestamp">${timeAgo(log.date)}</span>
      </div>
    `;
    logList.appendChild(div);
  });
}
