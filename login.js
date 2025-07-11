document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const error = document.getElementById('loginError');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      // Şu anki kullanıcı bilgisi
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Notification sistemine bilgi gönder (bildirimi bir kez göstermek için)
      localStorage.setItem('loggedInUser', user.email);
      localStorage.setItem('loginNotificationShown', 'false');

      // Aktivite logu (SADECE BİR KERE EKLE ve tam ISO string kullan)
      let activityLogs = JSON.parse(localStorage.getItem('activityLogs')) || [];
      activityLogs.unshift({
        user: user.email,
        type: "login",          // MUTLAKA type ekle
        action: "Logged in",
        date: new Date().toISOString()  // tam ISO tarih formatı
      });
      localStorage.setItem('activityLogs', JSON.stringify(activityLogs));

      // Yönlendirme
      window.location.href = 'admin.html';
    } else {
      error.style.color = 'red';
      error.textContent = "Invalid email or password.";
    }
  });
});
