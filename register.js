document.addEventListener('DOMContentLoaded', function () {
  const registerForm = document.getElementById('registerForm');
  const error = document.getElementById('registerError');

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (password !== confirm) {
      error.style.color = 'red';
      error.textContent = "Passwords do not match.";
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(user => user.email === email)) {
      error.style.color = 'red';
      error.textContent = "Email is already registered.";
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    // Aktivite logu ekle
    let activityLogs = JSON.parse(localStorage.getItem('activityLogs')) || [];
    activityLogs.unshift({
      user: email,
      action: "Registered account",
      date: new Date().toISOString().slice(0, 10)
    });
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));

    error.style.color = 'green';
    error.textContent = "Registration successful! Redirecting to login...";
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  });
});
