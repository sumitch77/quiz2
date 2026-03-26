
let password = document.getElementById('password');
let email = document.getElementById('email');
let message = document.getElementById('message');
let verbtn = document.getElementById('verbtn');
  

 verbtn.addEventListener('click', async (event) => {
  event.preventDefault();  
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, email: email.value })
    });
    const data = await response.json();
    message.innerText = data.message;
    if (data.success) {
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }

   
  } catch (err) {
    console.log('Fetch error:', err);
  }
});
