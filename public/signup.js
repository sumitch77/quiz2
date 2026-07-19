let name1 = document.getElementById('name1');
let phone = document.getElementById('phone');
let email = document.getElementById('email');
let password = document.getElementById('password');
let confirmpass = document.getElementById('confirmpass');
let code = document.getElementById('code');
let sendcode = document.getElementById('sendcode');
let verbtn = document.getElementById('verbtn');
let signupbtn = document.getElementById('signup');

let ername = document.querySelector('#username-error');
let erphone = document.querySelector('#phone-error');
let eremail = document.querySelector('#email-error');
let erpass = document.querySelector('#pass-error');
let erconpass = document.querySelector('#conpass-error');
let ercode = document.querySelector('#code-error');

let eyetoggle = document.querySelector('#eyetoggle');
let eyetoggle2 = document.querySelector('#eyetoggle2');
let message = document.getElementById('message');
let message2 = document.getElementById('message2');
let message3 = document.getElementById('message3');

let newemail;
let warn = document.querySelector('#warn');

let mainlogin = document.querySelector('#mainlogin');
let mainsignup = document.querySelector('#mainsignup');
let msignup = document.querySelector('#msignup');
let mlogin = document.querySelector('#mlogin');
let email2 = document.querySelector('#email2');
let pass2 = document.querySelector('#pass2');
let finallogin = document.querySelector('#finallogin');
let message4 = document.querySelector('#message4');
let gotologin = document.querySelector('#gotologin');
let gotosignup = document.querySelector('#gotosignup');
let agreement = document.querySelector('#agreement');
let Gsignup = document.querySelector('#Gsignup');
let Glogin = document.querySelector('#Glogin');

Gsignup.addEventListener('click' , (e)=>{
window.location.href = '/auth/google';
});
Glogin.addEventListener('click' , (e)=>{
window.location.href = '/auth/google';
});

function toggleForms(showSignup) {
  if (!mainlogin || !mainsignup || !msignup || !mlogin) return;

  mainlogin.classList.toggle('hidden', showSignup);
  mainsignup.classList.toggle('hidden', !showSignup);

  msignup.classList.toggle('bg-[#1967d3]', showSignup);
  msignup.classList.toggle('text-white', showSignup);
  msignup.classList.toggle('bg-transparent', !showSignup);
  msignup.classList.toggle('text-[#9a9a9a]', !showSignup);

  mlogin.classList.toggle('bg-[#1967d3]', !showSignup);
  mlogin.classList.toggle('text-white', !showSignup);
  mlogin.classList.toggle('bg-transparent', showSignup);
  mlogin.classList.toggle('text-[#9a9a9a]', showSignup);
}

msignup?.addEventListener('click', () => toggleForms(true));
mlogin?.addEventListener('click', () => toggleForms(false));
gotosignup?.addEventListener('click', () => toggleForms(true));
gotologin?.addEventListener('click', () => toggleForms(false));

toggleForms(true);
// const fileInput = document.getElementById('fileInput');
// const avatarImg = document.getElementById('avatarImg');
// const placeholder = document.getElementById('placeholder');
// const overlay = document.getElementById('overlay');
// const filename = document.getElementById('filename');
// const tick = document.getElementById('tick');
   
// fileInput.addEventListener('change', function () {
//     const file = this.files[0];
//     if (!file) return;
 
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       avatarImg.src = e.target.result;
//       avatarImg.style.display = 'block';
//       placeholder.style.display = 'none';
//       overlay.classList.add('visible');
 
//       const name = file.name.length > 26 ? file.name.slice(0, 24) + '…' : file.name;
//       filename.textContent = name;
//       filename.classList.add('show');
 
//       tick.classList.add('show');
//     };
//     reader.readAsDataURL(file);
//   });



function lockButton(button) {
  const originalClasses = button.className;
  button.dataset.originalClasses = originalClasses;

  button.disabled = true;

  button.classList.add(
    'opacity-70',
    'cursor-not-allowed',

    'pointer-events-none',
    'bg-gray-400',
    'text-gray-100'
  );

button.classList.remove(
    'bg-blue-600',
    'hover:bg-blue-700',
    'bg-green-600',
    'hover:bg-green-700',
    'bg-indigo-600',
    'hover:bg-indigo-700',
    'bg-red-600',
    'hover:bg-red-700',
    'text-white'
  );

  setTimeout(() => {
    button.disabled = false;

    button.classList.remove(
      'opacity-70',
      'cursor-not-allowed',
      'pointer-events-none',
      'bg-gray-400',
      'text-gray-100'
    );

    button.className = button.dataset.originalClasses;
  }, 4000);
}

finallogin.addEventListener('click',async()=>{
  lockButton(finallogin);

 
   try {
        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({email:email2 , password:pass2})
        });
           if(response.status===429){
        const data = await response.json();
         if(!data.success){
        message4.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.replace('bg-green-600' , 'bg-red-600');


    }
          message4.innerText = data.message;
        message4.classList.remove('hidden');
        message4.classList.replace('text-green-600' , 'text-red-600');
// $1.innerText = message4.innerText;
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
// $1.innerText = '';
          message4.innerText="";
         message4.classList.add('hidden');
        message4.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
        },5000)
       
        return;
       
    }
    if(response.status===400){
        const data = await response.json();
        message4.innerText = data.message;
        message4.classList.remove('hidden');
        message4.classList.replace('text-green-600' , 'text-red-600');
// $1.innerText = message4.innerText;
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
// $1.innerText = '';
          message4.innerText="";
         message4.classList.add('hidden');
        message4.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
    },5000);
        return;
    }
        const data = await response.json();
        message4.innerHTML = data.message + (data.link ? `<a href="${data.link}">${' ' + data.actionText}</a>` : '');
// $1.innerText = message4.innerText;
                 message4.classList.remove('hidden');
        // message.classList.replace('text-green-600' , 'bg-red-600');
// $1.classList.remove('hidden');
        // warn.classList.replace('bg-red-600' , 'bg-green-600');
     setTimeout(()=>{
    message4.innerText='';
// $1.innerText = message4.innerText;
// $1.classList.add('hidden');
        message4.classList.add('hidden');

    },5000);
        if (data.success) {
            email2.value = '';
            pass2.value = '';
            
            window.location.href = '/';
        }

    } catch (err) {
        message4.innerText='Unable to connect to server';
// $1.innerText = message4.innerText;
       message4.classList.remove('hidden');
        message4.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
          message4.innerText='';
// $1.innerText = message4.innerText;
          message4.classList.add('hidden');
        message4.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
    },5000);
    }

});


 sendcode.addEventListener('click', async (event) => {

  event.preventDefault(); 
  lockButton(sendcode);
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
        message.classList.remove('hidden');
        message.classList.replace('text-green-600' , 'text-red-600');
// $1.innerText = message.innerText;
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
// $1.innerText = '';
          message.innerText="";
         message.classList.add('hidden');
        message.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
        },5000)
        return;
    }
    if(response.status===400){
        const data = await response.json();
        message.innerText = data.message;
// $1.innerText = message.innerText;
       message.classList.remove('hidden');
        message.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
         setTimeout(()=>{
    message.innerText='';
// $1.innerText = message.innerText;
       message.classList.add('hidden');
        message.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
    },5000);
        return;
    }
    const data = await response.json();
    message.innerHTML =data.message;
// $1.innerText = message.innerText;
     message.classList.remove('hidden');
        // message.classList.replace('text-green-600' , 'bg-red-600');
// $1.classList.remove('hidden');
        // warn.classList.replace('bg-red-600' , 'bg-green-600');
     setTimeout(()=>{
    message.innerText='';
// $1.innerText = message.innerText;
// $1.classList.add('hidden');
        message.classList.add('hidden');
        // warn.classList.replace( 'text-green-500','text-red-500');

    },5000);
    if(data.success){
           
    sendcode.innerText='Resend';
      
    }
   
  } catch (err) {
    message.innerText='Unable to connect to server';
// $1.innerText = message.innerText;
       message.classList.remove('hidden');
        message.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
          message.innerText='';
// $1.innerText = message.innerText;
          message.classList.add('hidden');
        message.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
        },5000)
  }
});

verbtn.addEventListener('click', async () => {
  newemail= email.value;
  lockButton(verbtn);
   try {
    const response = await fetch('/verify2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1: name1.value, phone: phone.value, code: code.value, email: newemail, password: password.value })
    });
       if(response.status===429){
        const data = await response.json();
        message2.innerText = data.message;
       message2.classList.remove('hidden');
        message2.classList.replace('text-green-600' , 'text-red-600');
// $1.innerText = message2.innerText;
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
// $1.innerText = '';
          message2.innerText="";
         message2.classList.add('hidden');
        message2.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
        },5000)
       }
    
    if(response.status===400){
        const data = await response.json();
        message2.innerText = data.message;
// $1.innerText = message2.innerText;
       message2.classList.remove('hidden');
        message2.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
         setTimeout(()=>{
    message2.innerText='';
// $1.innerText = message2.innerText;
       message2.classList.add('hidden');
        message2.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
    },5000);
        return;
    }
    const data = await response.json();
    message2.innerText = data.message;
    if(!data.success){
        message2.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.replace('bg-green-600' , 'bg-red-600');


    }
// $1.innerText = message2.innerText;
     message2.classList.remove('hidden');
// $1.classList.remove('hidden');
     setTimeout(()=>{
    message2.innerText='';
// $1.innerText = message2.innerText;
// $1.classList.add('hidden');
        message2.classList.add('hidden');
    },5000);
    } catch (err) {
    message2.innerText='Unable to connect to server';
// $1.innerText = message2.innerText;
       message2.classList.remove('hidden');
        message2.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
          message2.innerText='';
// $1.innerText = message2.innerText;
          message2.classList.add('hidden');
        message2.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
    },5000);
  }
});

signupbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    lockButton(signupbtn);
if(!agreement.checked){
    message3.innerText = "Please check Privacy policy and Terms of Use";
        message3.classList.remove('hidden');
        message3.classList.replace('text-green-600' , 'text-red-600');
// $1.innerText = message3.innerText;
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
// $1.innerText = '';
          message3.innerText="";
         message3.classList.add('hidden');
        message3.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
        
        },5000)
        return       

}
  newemail= email.value;
    const payload = {
        name1: name1.value,
        phone: phone.value,
        email: newemail,
        password: password.value,
        confirmpass: confirmpass.value,
        agreement: agreement.checked
    };
    try {
        const response = await fetch('/signupco', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
           if(response.status===429){
        const data = await response.json();
         if(!data.success){
        message3.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.replace('bg-green-600' , 'bg-red-600');


    }
          message3.innerText = data.message;
        message3.classList.remove('hidden');
        message3.classList.replace('text-green-600' , 'text-red-600');
// $1.innerText = message3.innerText;
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
// $1.innerText = '';
          message3.innerText="";
         message3.classList.add('hidden');
        message3.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
        },5000)
       
        return;
       
    }
    if(response.status===400){
        const data = await response.json();
        message3.innerText = data.message;
        message3.classList.remove('hidden');
        message3.classList.replace('text-green-600' , 'text-red-600');
// $1.innerText = message3.innerText;
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
// $1.innerText = '';
          message3.innerText="";
         message3.classList.add('hidden');
        message3.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
    },5000);
        return;
    }
        const data = await response.json();
        message3.innerHTML = data.message + (data.link ? `<a href="${data.link}">${' ' + data.actionText}</a>` : '');
// $1.innerText = message3.innerText;
                 message3.classList.remove('hidden');
        // message.classList.replace('text-green-600' , 'bg-red-600');
// $1.classList.remove('hidden');
        // warn.classList.replace('bg-red-600' , 'bg-green-600');
     setTimeout(()=>{
    message3.innerText='';
// $1.innerText = message3.innerText;
// $1.classList.add('hidden');
        message3.classList.add('hidden');

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
        message3.innerText='Unable to connect to server';
// $1.innerText = message3.innerText;
       message3.classList.remove('hidden');
        message3.classList.replace('text-green-600' , 'text-red-600');
// $1.classList.remove('hidden');
// $1.classList.replace('bg-green-600' , 'bg-red-600');
        setTimeout(()=>{
          message3.innerText='';
// $1.innerText = message3.innerText;
          message3.classList.add('hidden');
        message3.classList.replace( 'text-red-600' , 'text-green-600');
// $1.classList.add('hidden');
// $1.classList.replace( 'bg-red-600' , 'bg-green-600');
    },5000);
    }
});


      eyetoggle.addEventListener('click', function(){
        var input = eyetoggle.previousElementSibling;
        input.type = (input.type === 'password') ? 'text' : 'password';
      });
        eyetoggle2.addEventListener('click', function(){
        var input = eyetoggle2.previousElementSibling;
        input.type = (input.type === 'password') ? 'text' : 'password';
      });

document.querySelectorAll('.tab').forEach(function(tab){
      tab.addEventListener('click', function(){
        document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
        tab.classList.add('active');
      });
    });