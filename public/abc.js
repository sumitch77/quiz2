let btn = document.getElementById('btn');
let name1 = document.getElementById('name');
let phone = document.getElementById('phone');
let email = document.getElementById('email');
let message = document.getElementById('message');
let code = document.getElementById('code');
let verbtn = document.getElementById('verbtn');
  

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
   
  } catch (err) {
    console.log('Fetch error:', err);
  }
});

verbtn.addEventListener('click', async () => {
   try {
    const response = await fetch('/verify2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({code: code.value })
    });
    const data = await response.json();
    message.innerText = data.message;
    } catch (err) {
    console.log('Fetch error:', err);
  }
});