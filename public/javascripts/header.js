document.addEventListener("DOMContentLoaded", function () {
    // Load header HTML into the placeholder
    fetch("header.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("header-placeholder").innerHTML = data;
  
        // Check login status and display username if logged in
        const username = localStorage.getItem('username');
        const authSection = document.getElementById('auth-section');
  
        if (username) {
          // User is logged in, display username and logout button
          authSection.innerHTML = `
            <span class="username">${username}</span>
            <a href="#" id="logout-btn" class="logout">로그아웃</a>
            <i class="far fa-user-circle large"></i>
          `;
  
          // Add event listener to logout button
          document.getElementById('logout-btn').addEventListener('click', function (e) {
            e.preventDefault();
            // Remove token and username from localStorage
            localStorage.removeItem('username');
            localStorage.removeItem('authToken');
            alert('로그아웃 성공!');
            window.location.href = 'login.html'; // Redirect to login page
          });
        }
      })
      .catch(error => console.error('Error loading header:', error));
  });
  