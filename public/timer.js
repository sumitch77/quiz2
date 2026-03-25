let flex = document.querySelector("#flexb");    
let hour = document.querySelector("#hour");    
let min = document.querySelector("#min");    
let sec = document.querySelector("#sec");    
let start = document.querySelector("#start");    
let hide = document.querySelector("#hide");    
let submit = document.querySelector("#submit");    
let result = document.querySelector("#res");    
let ans = document.querySelector("#ans");
let dis = document.querySelectorAll(".dis");
let replay = document.querySelector("#replay");
let edit = document.querySelector("#edit");
let load = document.querySelector("#load");
let your = document.querySelector("#your");
let msg = document.querySelector("#msg");

let qu1 = document.querySelector("#qu1");    
let qu2 = document.querySelector("#qu2");    
let qu3 = document.querySelector("#qu3");    
let qu4 = document.querySelector("#qu4");    
let qu5 = document.querySelector("#qu5");
let qu6 = document.querySelector("#qu6");
let qu7 = document.querySelector("#qu7");
let qu8 = document.querySelector("#qu8");
let qu9 = document.querySelector("#qu9");
let qu10 = document.querySelector("#qu10");

let login = document.querySelector("#login");
let signup = document.querySelector("#signup");
let logout = document.querySelector("#logout");


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/check');
        const data = await response.json();
        if (data.loggedIn) {
          login.style.display = 'none';
          signup.style.display = 'none';
          logout.style.display = 'block';
        } else {
          login.style.display = 'block';
          signup.style.display = 'block';
          logout.style.display = 'none';
        }
    } catch (err) {
        console.log('Fetch error:', err);
    }
});



result.style.display= "none";
replay.style.display= "none";

let userques = localStorage.getItem("allquest");
 let finuser = JSON.parse(userques);


load.addEventListener("click",()=>{
 if (Object.keys(finuser).length === 0) {
    console.log("Object is empty");
   return
 }
  qu1.innerText = finuser[0].ques1;
  qu2.innerText = finuser[1].ques1;
  qu3.innerText = finuser[2].ques1;
  qu4.innerText = finuser[3].ques1;
  qu5.innerText = finuser[4].ques1;
  qu6.innerText = finuser[5].ques1;
  qu7.innerText = finuser[6].ques1;
  qu8.innerText = finuser[7].ques1;
  qu9.innerText = finuser[8].ques1;
  qu10.innerText = finuser[9].ques1;
  
  
});

 let hour1 = 0;
 let min1 = 0o2;
 let sec1 = 60;
let a = hour1;
let b = min1;
let c = sec1;
let run = true;
start.addEventListener("click", async () => {
  running = true;

  start.style.display = "none";
  hide.style.display = "block";

  while (running) {
     
    if (
      Number(hour.innerText) === 0 &&
      Number(min.innerText) === 0 &&
      Number(sec.innerText) === 0
    ) {
      running = false;
      break;
      dis.forEach(diss => {
  diss.disabled = true;
  
  });
      
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // countdown logic
    let s = Number(sec.innerText);
    let m = Number(min.innerText);
    let h = Number(hour.innerText);

    s--;

    if (s < 0) {
      s = 59;
      m--;
    }
    if (m < 0) {
      m = 59;
      h--;
    }

    sec.innerText = String(s).padStart(2, "0");
    min.innerText = String(m).padStart(2, "0");
    hour.innerText = String(h).padStart(2, "0");
  }

  
  dis.forEach(diss => {
  diss.disabled = true;
  
  })
  subm();
  result.style.display = "none";
  replay.style.display= "block";

  showresult();
});

  
  let score = 0;

function subm(){
  dis.forEach(diss => {
  diss.disabled = true;
  
  });
  
  submit.style.display="none";
  flex.style.display="none";
  res.style.display="block";
  hour.innerText=0;
  min.innerText=0;
  sec.innerText=0;
  const selected = document.querySelector('input[name="one"]:checked');    
const selected2 = document.querySelector('input[name="two"]:checked');  
const selected3 = document.querySelector('input[name="three"]:checked');    
const selected4 = document.querySelector('input[name="four"]:checked');  
const selected5 = document.querySelector('input[name="five"]:checked');    
const selected6 = document.querySelector('input[name="six"]:checked');  

const selected7 = document.querySelector('input[name="seven"]:checked');    
const selected8 = document.querySelector('input[name="eight"]:checked');  
const selected9 = document.querySelector('input[name="nine"]:checked');    
const selected10 = document.querySelector('input[name="ten"]:checked');  

  if(selected.value === "raj"){
    score+=1;
  }if(selected2.value === "up"){
    score+=1;
  }
  if(Number(selected3.value) === 8){
    score+=1;
  }if(selected4.value === "asia"){
    score+=1;
  }if(Number(selected5.value) === 7){
    score+=1;
  }
  if(Number(selected6.value) === 13){
    score+=1;
  }
  if(selected7.value === "mumbai"){
    score+=1;
  }
if(Number(selected8.value) === 2){
    score+=1;
  }if(Number(selected9.value) == 1950){
    score+=1;
  }if(Number(selected10.value) == 1949){
    score+=1;
  }
  
}

submit.addEventListener("click" , ()=>{
  
subm();
});

function showresult(){
  ans.innerText = `Your Score is ${score}/10`;
}

result.addEventListener("click",()=>{
  showresult();
  replay.style.display= "block";
});

replay.addEventListener("click",()=>{
  location.reload();
});

edit.addEventListener("click",async ()=>{
    window.location.href = '/index';

});