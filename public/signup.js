let name1 = document.getElementById('name1');
let phone = document.getElementById('phone');
let email = document.getElementById('email');
let password = document.getElementById('password');
let confirmpass = document.getElementById('confirmpass');
let code = document.getElementById('code');
let sendcode = document.getElementById('sendcode');
let verbtn = document.getElementById('verbtn');
let signupbtn = document.getElementById('signupbtn');
let message = document.getElementById('message');
let newemail;


 sendcode.addEventListener('click', async (event) => {
  event.preventDefault();  
   newemail= email.value;
  
  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1: name1.value, phone: phone.value, email: newemail, password: password.value, confirmpass: confirmpass.value })
    });
    const data = await response.json();
    message.innerText =data.message;
   
  } catch (err) {
    console.log('Fetch error:', err);
  }
});

verbtn.addEventListener('click', async () => {
  newemail= email.value;
   try {
    const response = await fetch('/verify2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1: name1.value, phone: phone.value, code: code.value, email: newemail, password: password.value })
    });
    const data = await response.json();
    message.innerText = data.message;
    } catch (err) {
    console.log('Fetch error:', err);
  }
});

signupbtn.addEventListener('click', async (e) => {
  newemail= email.value;
e.preventDefault();
    try {
        const response = await fetch('/signupco', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name1: name1.value, phone: phone.value, email: email.value, password: password.value, confirmpass: confirmpass.value })
        });
        const data = await response.json();
        message.innerText = data.message;
        if (data.success) {
            name1.value = '';
            phone.value = '';
            email.value = '';
            password.value = '';
            confirmpass.value = '';
            code.value = '';
            window.location.href = '/';
        }

    } catch (err) {
        console.log('Fetch error:', err);
    }
});