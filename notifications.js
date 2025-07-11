document.addEventListener('DOMContentLoaded', () => {
  const notifList = document.getElementById('notif-list');
  const clearBtn = document.getElementById('clear-notifications');

  function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }

  // Bildirimleri localStorage'a kaydet
  function saveNotifications(notifications) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  // localStorage'dan bildirimi al
  function loadNotifications() {
    const data = JSON.parse(localStorage.getItem('notifications')) || [];
    return data.map(n => ({
      ...n,
      date: new Date(n.date)
    }));
  }

  // İlk yüklenenler
  let notifications = loadNotifications();

  function renderNotifications() {
    notifList.innerHTML = '';
    if (notifications.length === 0) {
      notifList.innerHTML = '<li class="notif info">No notifications yet.</li>';
      return;
    }
    notifications.forEach(notif => {
      const timeText = timeAgo(notif.date);
      const li = document.createElement('li');
      li.className = `notif ${notif.type}`;
      li.innerHTML = `
        ${notif.message}
        <span class="timestamp">${timeText}</span>
      `;
      notifList.appendChild(li);
    });
  }

  function userLoggedIn(username) {
    const alreadyShown = localStorage.getItem('loginNotificationShown') === 'true';
    if (!alreadyShown) {
      notifications.unshift({
        message: `👤 ${username} logged in.`,
        date: new Date(),
        type: "info"
      });
      localStorage.setItem('loginNotificationShown', 'true');
      saveNotifications(notifications);
    }
  }

  clearBtn.addEventListener('click', () => {
    notifications = [];
    saveNotifications(notifications);
    renderNotifications();
  });

  // Tema
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark-mode', savedTheme === 'dark');

  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    userLoggedIn(loggedInUser);
  }

  renderNotifications();
});
