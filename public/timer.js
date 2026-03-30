
let login = document.querySelector("#login");
let signup = document.querySelector("#signup");
let logout = document.querySelector("#logout");
let profile = document.querySelector("#profile");
let profile2 = document.querySelector("#profile2");

  const menuWrap = document.getElementById('menuWrap');
  const menuBtn  = document.getElementById('menuBtn');

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
        

        if (data.loggedIn) {
          login.style.display = 'none';
          signup.style.display = 'none';
          logout.style.display = 'block';
          logout.style.display = 'block';
          logout.style.display = 'block';

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
    } catch (err) {
        console.log('Error in fetching user data', err);
    }
});



 
