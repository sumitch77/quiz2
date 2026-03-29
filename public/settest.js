let q1 = document.querySelector('#Q1');
let a1= document.querySelector('#A1');
let a2 = document.querySelector('#A2');
let a3 = document.querySelector('#A3');
let a4 = document.querySelector('#A4');
let ans = document.querySelector('#correctans');
let send = document.querySelector('#but');
let submit = document.querySelector('#submit');
let message = document.querySelector('#message');
let warn = document.querySelector('#warn');

send.addEventListener("click",async(e)=>{
    e.preventDefault();
   try {
    const response = await fetch('/sendques', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q1:q1.value, a1:a1.value , a2:a2.value , a3:a3.value , a4:a4.value ,ans:ans.value })
    });
    const data = await response.json();
    message.innerHTML= data.message;
       warn.innerText = message.innerText;
        warn.style.display= 'block';
  
     setTimeout(()=>{
    message.innerText='';
       warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
      if(data.success){
        q1.value = '';
        a1.value='';
        a2.value='';
        a3.value='';
        a4.value='';
      }
    
    } catch (err) {
    message.innerText='Unable to connect to server ';
       warn.innerText = message.innerText;
        warn.style.display= 'block';
     setTimeout(()=>{
    message.innerText='';
       warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
  }

});

submit.addEventListener("click",async(e)=>{
    e.preventDefault();

 try {
    const response = await fetch('/submitques', {     
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (data.success) {
      message.innerText = data.message; 
         warn.innerText = message.innerText;
        warn.style.display= 'block';     
  setTimeout(() => {
    window.location.href = '/';         
  }, 1500); 
}
  else{                  
      message.innerText = data.message;
         warn.innerText = message.innerText;
        warn.style.display= 'block';
       setTimeout(()=>{
    message.innerText='';
       warn.innerText = message.innerText;
        warn.style.display= 'none';
    },5000);
    }

    
   
    } catch (err) {
    message.innerText='Unable to connect to server';
     setTimeout(()=>{
    message.innerText='';
    },5000);
  }

});