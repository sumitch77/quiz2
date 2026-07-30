
let login = document.querySelector("#login");
let signup = document.querySelector("#signup");
let logout = document.querySelector("#logout");
let profile = document.querySelector("#profile");
let profile2 = document.querySelector("#profile2");
const menuWrap = document.getElementById('menuWrap');
const menuBtn  = document.getElementById('menuBtn');
let imgin = document.getElementById('imgin');
let warn = document.querySelector('#warn');
let url;
let cut = document.querySelector('#cut');
let deleteBtn = document.querySelector('.delete');
let message = document.getElementById('message');
let delbt = document.querySelector('#delbt');
let img = document.querySelector('#img');
let vault = document.querySelector('#vault');
let upigen = document.querySelector('#upigen');


// canvas fingerprint removed


// Measure how long each font takes to render
// Different GPU/OS combos take different time per font
// font timing fingerprint removed

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuWrap.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    menuWrap.classList.remove('open');
  });

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/check');
        const data = await response.json();

        const profilem = await fetch('/profile');
        const profileData = await profilem.json();
      
        if (profileData.photourl===null) {
          url = '/uploads/default-2820-pp.jpeg';
        } else {
          url = profileData.photourl;
        }

        if (data.loggedIn) {
          login.style.display = 'none';
          signup.style.display = 'none';
          logout.style.display = 'block';
          profile.style.display = 'block';
          profile2.style.display = 'block';

        } else {
          login.style.display = 'block';
          signup.style.display = 'block';
          logout.style.display = 'none';
          profile.style.display = 'none';
          profile2.style.display = 'none';
        }
        if(data.success){
          profile.innerText = 'Username -' + data.username;
          profile2.innerText = 'Email -' + data.useremail;
        }

        if(profileData.success){
          menuBtn.innerHTML = `<img src="${url}" alt="Profile Picture" style="width: 4rem; height: 3rem; border-radius: 50%;">`; 
         imgin.innerHTML = `<img src="${url}" alt="Profile Picture" style="width: 6rem; height: 3.5rem; cursor: pointer; border-radius: 50%;">`;
        }
// fingerprint posting removed from timer.js (handled in signup.js)
    } catch (err) {
        console.log('Error in fetching user data', err);
    }
});

imgin.addEventListener('click', () => {
  if(warn.style.display === 'block') {
    warn.style.display = 'none';
  
  } else {
    warn.innerHTML = `<img src="${url}" alt="Profile Picture" id="imgn">`;
    warn.style.display = 'block';
    cut.style.display = 'block';
   
  }
  });

cut.addEventListener('click', () => {
  warn.style.display = 'none';
  cut.style.display = 'none';
});

vault.addEventListener('click', () => {
  window.location.href = '/vault';
});

upigen.addEventListener('click', () => {
  window.location.href = '/upigen';
});





// const profile = {
//   touchPressure: [],      // force of tap (iPhone specific)
//   scrollVelocity: [],     // how fast you flick
//   gyroscopePattern: [],   // tilt patterns while typing
//   tapInterval: [],        // rhythm between taps
//   swipeAngle: []          // exact angle of swipe
// };

// window.addEventListener("touchstart", e => {
//   profile.touchPressure.push(e.touches[0].force);
//   profile.tapInterval.push(Date.now());
// });

 
