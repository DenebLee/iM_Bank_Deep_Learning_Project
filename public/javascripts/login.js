document.addEventListener("DOMContentLoaded", function () {
    // Process login form submission
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    if (loginForm) { // Only run if the login form is present on the page
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Log the login attempt
            console.log(`로그인 시도 중 - 아이디: ${username}, 비밀번호: ${password}`);

            // Prepare the login data
            const loginData = {
                username: username,
                password: password
            };

            // Send login request to the API
            fetch('http://10.100.1.57:8000/accounts/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                console.log('로그인 응답 상태 코드:', response.status);
                return response.json();
            }) // Parse JSON response
            .then(data => {
                console.log('로그인 응답 데이터:', data);

                // Handle login response
                if (data.access) {
                    // 로그인 성공: access 토큰을 저장
                    console.log('로그인 성공:', data.access);
                    localStorage.setItem('authToken', data.access);  // Store access token
                    localStorage.setItem('username', username);       // Store username

                    alert('로그인 성공!');
                    window.location.href = '../../../../Desktop/Deep_Project/Test/public/index.html';  // Redirect to homepage
                } else {
                    console.log('로그인 실패:', data.message);
                    loginMessage.textContent = '로그인 실패. 아이디 또는 비밀번호를 확인해주세요.';
                }
            })
            .catch(error => {
                console.error('로그인 중 오류 발생:', error);
                loginMessage.textContent = '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.';
            });
        });
    }
});
