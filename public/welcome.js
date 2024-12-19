// Gets username from the login form
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

if (username) {
  const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

  const hours = new Date().getHours();
  let greeting = "Welcome";

  if (hours < 12) {
    greeting = "Good Morning";
  } 
  else if (hours < 18) {
    greeting = "Good Afternoon";
  } 
  else {
    greeting = "Good Evening";
  }

  // Displays the greeting, username
  document.getElementById('user-display-name').textContent = `${greeting}, ${capitalizedUsername}!`;
} else {
  console.error("Username parameter is missing in the URL.");
}

document.getElementById('back-to-login-button').addEventListener('click', () => {
  window.location.href = 'login.html'; // Redirects back to the login page
});
