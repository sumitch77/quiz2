let A1 = document.querySelector("#A1");
let A2 = document.querySelector("#A2");
let A3 = document.querySelector("#A3");
let A4 = document.querySelector("#A4");
let Q1 = document.querySelector("#Q1");
let but = document.querySelector("#but");
let but2 = document.querySelector("#but2");
let but3 = document.querySelector("#but3");

let obj = [];
let curobj = {};
let newset = "";
but.addEventListener("click",()=>{
    
    curobj = {
        ques1: Q1.value,
        ans1: A1.value,
        ans2: A2.value,
        ans3: A3.value,
        ans4: A4.value

    }
    if(Q1.value === "" || A1.value ==="" || A2.value === "" || A3.value === ""  ||A4.value === "" ){
    //    return;
    }
   
    obj.push(curobj);
    Q1.value = "";
    A1.value = "";
    A2.value = "";
    A3.value = "";
    A4.value = "";

});

but2.addEventListener("click",()=>{
  //  if(Q1.value === "" || A1.value === "" || A2.value === "" || A3.value === ""  ||A4.value === "" )
   // {
       // console.log("helo");
       // return;
  //  }

    
});
    
    
but3.addEventListener("click",()=>{
    localStorage.setItem("allquest" , JSON.stringify(obj));
   // obj = [];
    window.location.href="timer.html";
});   
    