document.addEventListener('DOMContentLoaded', function () {
  const userGrid = document.querySelector('.user-grid');
  const searchInput = document.querySelector('.search-bar');
  let users = JSON.parse(localStorage.getItem('users')) || [];

  function addActivityLog(userEmail, type, action) {
    let activityLogs = JSON.parse(localStorage.getItem('activityLogs')) || [];
    activityLogs.unshift({
      user: userEmail,
      type: type,      // 'update' veya 'delete'
      action: action,
      date: new Date().toISOString()
    });
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
  }

  function renderUsers(filter = '') {
    userGrid.innerHTML = '';

    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredUsers.length === 0) {
      userGrid.innerHTML = `<p>No users found.</p>`;
      return;
    }

    filteredUsers.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';

      card.innerHTML = `
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <div class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;

      // Sil butonuna işlev
      card.querySelector('.delete').addEventListener('click', () => {
        if (confirm(`Delete user "${user.name}"?`)) {
          users = users.filter(u => u.email !== user.email);
          localStorage.setItem('users', JSON.stringify(users));

          // Log ekle: delete işlemi
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (currentUser) {
            addActivityLog(
              currentUser.email,
              'delete',
              `Deleted user "${user.email}"`
            );
          }

          renderUsers(searchInput.value); // filtreyi koru
        }
      });

      // Edit butonuna işlev
      card.querySelector('.edit').addEventListener('click', () => {
        const newName = prompt("Enter new name:", user.name);
        if (newName && newName.trim() !== '') {
          const oldName = user.name;
          user.name = newName.trim();
          localStorage.setItem('users', JSON.stringify(users));

          // Log ekle: update işlemi
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (currentUser) {
            addActivityLog(
              currentUser.email,
              'update',
              `Updated user "${user.email}" name from "${oldName}" to "${newName.trim()}"`
            );
          }

          renderUsers(searchInput.value);
        }
      });

      userGrid.appendChild(card);
    });
  }

  // Sayfa yüklendiğinde kullanıcıları göster
  renderUsers();

  // Arama kutusu
  searchInput.addEventListener('input', function () {
    renderUsers(this.value);
  });
});
