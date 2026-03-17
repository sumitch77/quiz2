let btn = document.getElementById('btn');
let name1 = document.getElementById('name');
let phone = document.getElementById('phone');
let email = document.getElementById('email');
let message = document.getElementById('message');
let code = document.getElementById('code');
let verbtn = document.getElementById('verbtn');
let codeValue;  

 btn.addEventListener('click', async (event) => {
  event.preventDefault();  
  
  try {
    const response = await fetch('/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1: name1.value, phone: phone.value, email: email.value })
    });
    const data = await response.json();
    message.innerText = data.message;
    codeValue = data.code; 
    setTimeout(() => {
      codeValue = null;
    }, 5 * 60 * 1000); 
   
  } catch (err) {
    console.log('Fetch error:', err);
  }
});

verbtn.addEventListener('click', () => {
  
  if (code.value === `${codeValue}`) {
    message.innerText = 'Verification successful!';
  } else {
    message.innerText = 'Verification failed. Please try again.';
  }
});