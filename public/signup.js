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

function startCountdown(unlockTime) {
     verbtn.disabled = true;

    const timer = setInterval(() => {
        const now = Date.now();
        const distance = unlockTime - now;
        const seconds = Math.ceil(distance / 1000);

        if (distance <= 0) {
           
            clearInterval(timer);
            verbtn.disabled = false;
            verbtn.innerText = 'Resend';
            message.innerText = '';
            localStorage.removeItem('resendUnlock');
        } else {
            message.innerText =`Please wait ${seconds} seconds before trying again.`;
        }
          }, 1000);
}


 sendcode.addEventListener('click', async (event) => {

  event.preventDefault(); 
   newemail= email.value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1: name1.value, phone: phone.value, email: newemail, password: password.value, confirmpass: confirmpass.value })
    });
       if(response.status===429){
        const data = await response.json();
        message.innerText = data.message;
        let unlockTime;
          if(data.total === 600){
        unlockTime = Date.now() + 600000; 
        }
         if(data.total === 60){
         unlockTime = Date.now() + 60000; 
        }
         if(data.total === 5){
         unlockTime = Date.now() + 5000; 
        }
        localStorage.setItem('resendUnlock', unlockTime);
         startCountdown(unlockTime);
        return;
    }
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
        return;
    }
    const data = await response.json();
    message.innerHTML =data.message;
    if(data.success){
      localStorage.setItem('codesend','true'); 
      localStorage.removeItem('resendUnlock');      
    sendcode.innerText='Resend';
      
    }
   
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
       if(response.status===429){
        const data = await response.json();
        message.innerText = data.message;
        const unlockTime = Date.now() + 5000; 
        
        localStorage.setItem('resendUnlock', unlockTime);
         startCountdown(unlockTime);
        
        return;
       }
    
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
        return;
    }
    const data = await response.json();
    localStorage.removeItem('codesend');
    message.innerText = data.message;
    localStorage.removeItem('resendUnlock');
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
           if(response.status===429){
        const data = await response.json();
        message.innerText = data.message;
        const unlockTime = Date.now() + 5000; 
        
        localStorage.setItem('resendUnlock', unlockTime);
         startCountdown(unlockTime);
        return;
       
    }
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
        return;
    }
        const data = await response.json();
        message.innerHTML = data.message + (data.link ? `<a href="${data.link}">${' ' + data.actionText}</a>` : '');
        if (data.success) {
            name1.value = '';
            phone.value = '';
            email.value = '';
            password.value = '';
            confirmpass.value = '';
            code.value = '';
            localStorage.removeItem('resendUnlock')
            window.location.href = '/';
        }

    } catch (err) {
        console.log('Fetch error:', err);
    }
});