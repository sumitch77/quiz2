// let name1 = document.getElementById('name1');
// let phone = document.getElementById('phone');
// let email = document.getElementById('email');
// let password = document.getElementById('password');
// let confirmpass = document.getElementById('confirmpass');
name1.addEventListener('input' , (e)=>{
   let currval = e.target.value;
   let flag = "true";

    if(currval.length >20 ) {flag = "false"; }
    else if(currval.length<4) {flag="black";}

    if(flag==="false"){
    name1.classList.remove('border-[#262626]','focus:border-[#1967d3]');
    name1.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    ername.innerText = "Username should be less than 20 characters";

    ername.classList.remove('opacity-0', '-translate-y-1' , 'hidden');
    ername.classList.add('opacity-100', 'translate-y-0');
    }
    else if(flag==="black"){
    name1.classList.remove('border-[#262626]','focus:border-[#1967d3]');
    name1.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    ername.innerText = "Username should be more than 4 characters";

    ername.classList.remove('opacity-0', '-translate-y-1' , 'hidden');
    ername.classList.add('opacity-100', 'translate-y-0');
    }
    else{
        name1.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    name1.classList.add('border-[#262626]', 'focus:border-[#1967d3]');
    ername.innerText="";
    ername.classList.remove('opacity-100', 'translate-y-0');
    ername.classList.add('opacity-0', '-translate-y-1', 'hidden');
    }


});


phone.addEventListener('input',(e)=>{
    let currval = e.target.value;
let flag = "true";

    if(currval.length !=10 ) {flag = "false";}   

   if(flag==="false"){
    phone.classList.remove('border-[#262626]','focus:border-[#1967d3]');
    phone.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    erphone.innerText = "Phone number should be Valid";

    erphone.classList.remove('opacity-0', '-translate-y-1' , 'hidden');
    erphone.classList.add('opacity-100', 'translate-y-0');
    }
  else{
        phone.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    phone.classList.add('border-[#262626]', 'focus:border-[#1967d3]');
    erphone.innerText="";
    erphone.classList.remove('opacity-100', 'translate-y-0');
    erphone.classList.add('opacity-0', '-translate-y-1', 'hidden');
    }
});


email.addEventListener('input',(e)=>{
    let currval = e.target.value;
let flag = "true";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!emailRegex.test(currval.trim()))  { flag = "false";  }

     if(flag==="false"){
    email.classList.remove('border-[#262626]','focus:border-[#1967d3]');
    email.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    eremail.innerText = "Email should be Valid";

    eremail.classList.remove('opacity-0', '-translate-y-1' , 'hidden');
    eremail.classList.add('opacity-100', 'translate-y-0');
    }
  else{
        email.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    email.classList.add('border-[#262626]', 'focus:border-[#1967d3]');
    eremail.innerText="";
    eremail.classList.remove('opacity-100', 'translate-y-0');
    eremail.classList.add('opacity-0', '-translate-y-1', 'hidden');
    }

});


password.addEventListener('input',(e)=>{
    let currval = e.target.value;
let flag = "true";
  
if(currval.length<6) {flag = "false"; }
else if(currval.length>20) {flag="black";} 

    
    if(flag==="false"){
    password.classList.remove('border-[#262626]','focus:border-[#1967d3]');
    password.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    erpass.innerText = "Password should be less than 6 characters";

    erpass.classList.remove('opacity-0', '-translate-y-1' , 'hidden');
    erpass.classList.add('opacity-100', 'translate-y-0');
    }
     else if(flag==="black"){
    password.classList.remove('border-[#262626]','focus:border-[#1967d3]');
    password.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    erpass.innerText = "Password should be less than 20 characters";

    erpass.classList.remove('opacity-0', '-translate-y-1' , 'hidden');
    erpass.classList.add('opacity-100', 'translate-y-0');
    }
    else{
        password.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    password.classList.add('border-[#262626]', 'focus:border-[#1967d3]');
    erpass.innerText="";
    erpass.classList.remove('opacity-100', 'translate-y-0');
    erpass.classList.add('opacity-0', '-translate-y-1', 'hidden');
    }

});


confirmpass.addEventListener('input',(e)=>{
let currval = e.target.value;
let flag = "true";

    if(currval!=password.value) { flag = "false"; }
    
    else{ flag="true";}


      if(flag==="false"){
    confirmpass.classList.remove('border-[#262626]','focus:border-[#1967d3]');
    confirmpass.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    erconpass.innerText = "Both Passwords should match";

    erconpass.classList.remove('opacity-0', '-translate-y-1' , 'hidden');
    erconpass.classList.add('opacity-100', 'translate-y-0');
    }
        else{
    confirmpass.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-2', 'focus:ring-red-500/20');
    confirmpass.classList.add('border-[#262626]', 'focus:border-[#1967d3]');
    erconpass.innerText="";
    erconpass.classList.remove('opacity-100', 'translate-y-0');
    erconpass.classList.add('opacity-0', '-translate-y-1', 'hidden');
    }
});
