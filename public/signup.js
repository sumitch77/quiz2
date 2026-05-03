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
let warn = document.querySelector('#warn');
const fileInput = document.getElementById('fileInput');
const avatarImg = document.getElementById('avatarImg');
const placeholder = document.getElementById('placeholder');
const overlay = document.getElementById('overlay');
const filename = document.getElementById('filename');
const tick = document.getElementById('tick');
   
fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
 
    const reader = new FileReader();
    reader.onload = function (e) {
      avatarImg.src = e.target.result;
      avatarImg.style.display = 'block';
      placeholder.style.display = 'none';
      overlay.classList.add('visible');
 
      const name = file.name.length > 26 ? file.name.slice(0, 24) + '…' : file.name;
      filename.textContent = name;
      filename.classList.add('show');
 
      tick.classList.add('show');
    };
    reader.readAsDataURL(file);
  });


 let filesend;
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
        warn.innerText = message.innerText;
        warn.style.display= 'block';
        setTimeout(()=>{
          warn.innerText = '';
        warn.style.display= 'none';
        },5000)
        return;
    }
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
        warn.innerText = message.innerText;
        warn.style.display= 'block';
         setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
        return;
    }
    const data = await response.json();
    message.innerHTML =data.message;
    warn.innerText = message.innerText;
        warn.style.display= 'block';
     setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
    if(data.success){
           
    sendcode.innerText='Resend';
      
    }
   
  } catch (err) {
    message.innerText='Unable to connect to server';
    warn.innerText = message.innerText;
        warn.style.display= 'block';
        setTimeout(()=>{
          message.innerText='';
          warn.innerText = message.innerText;
        warn.style.display= 'none';
        },5000)
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
        warn.innerText = message.innerText;
        warn.style.display= 'block';
        setTimeout(()=>{
          warn.innerText = message.innerText;
        warn.style.display= 'none';
        },5000)
       }
    
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
        warn.innerText = message.innerText;
        warn.style.display= 'block';
         setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
        return;
    }
    const data = await response.json();
    message.innerText = data.message;
    warn.innerText = message.innerText;
        warn.style.display= 'block';
     setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
    } catch (err) {
    message.innerText='Unable to connect to server';
    warn.innerText = message.innerText;
        warn.style.display= 'block';
     setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
  }
});

signupbtn.addEventListener('click', async (e) => {
    e.preventDefault();

  newemail= email.value;
  filesend = fileInput.files[0];
      const formData = new FormData();
    formData.append('filesend', filesend);        // file
    formData.append('name1', name1.value);
    formData.append('phone', phone.value);
    formData.append('email', newemail);
    formData.append('password', password.value);
    formData.append('confirmpass', confirmpass.value);
    try {
        const response = await fetch('/signupco', {
            method: 'POST',
            body: formData
        });
           if(response.status===429){
        const data = await response.json();
        message.innerText = data.message;
        warn.innerText = message.innerText;
        warn.style.display= 'block';
        setTimeout(()=>{
          warn.innerText = '';
        warn.style.display= 'none';
        },5000)
       
        return;
       
    }
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
        warn.innerText = message.innerText;
        warn.style.display= 'block';
         setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
        return;
    }
        const data = await response.json();
        message.innerHTML = data.message + (data.link ? `<a href="${data.link}">${' ' + data.actionText}</a>` : '');
        warn.innerText = message.innerText;
        warn.style.display= 'block';
         setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
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
        message.innerText='Unable to connect to server';
        warn.innerText = message.innerText;
        warn.style.display= 'block';
         setTimeout(()=>{
    message.innerText='';
    warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
    }
});