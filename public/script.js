const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const createAccountSection = document.getElementById('create-account-section');
const createAccountLink = document.getElementById('create-account-link');
const backToLoginLink = document.getElementById('back-to-login-link');

// Account creation transition
createAccountLink.addEventListener('click', () => {
  loginSection.classList.add('hidden');
  createAccountSection.classList.remove('hidden');
});

// Return to Login transition
backToLoginLink.addEventListener('click', () => {
  createAccountSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
});

// Handles login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const usernameOrEmail = document.getElementById('usernameOrEmail').value; // Gets the username/email
    const password = document.getElementById('password').value; // Get the password

    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameOrEmail, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = `welcome.html?username=${data.username}`;
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong! Please try again later.');
      });
  });

// Handles account creation
const createAccountForm = document.getElementById('create-account-form');
createAccountForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('new-username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('new-password').value;

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Account created! You can now log in.');

        // Goes back to login form after account creation
        createAccountSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
      } 
      else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong! Please try again later.');
    });
});