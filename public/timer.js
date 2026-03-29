
let login = document.querySelector("#login");
let signup = document.querySelector("#signup");
let logout = document.querySelector("#logout");

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
        } else {
          login.style.display = 'block';
          signup.style.display = 'block';
          logout.style.display = 'none';
        }
    } catch (err) {
        console.log('Fetch error:', err);
    }
});



 
