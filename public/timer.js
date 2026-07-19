
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
let finalfingerprint;


  async function getAudioFingerprint() {
  const context = new OfflineAudioContext(1, 44100, 44100);

  // Create an oscillator (sound source)
  const oscillator = context.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.value = 10000;

  // Create a compressor (amplifies CPU differences)
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.attack.value = 0;
  compressor.release.value = 0.25;

  // Connect the nodes
  oscillator.connect(compressor);
  compressor.connect(context.destination);

  oscillator.start(0);

  // Render the audio
  const buffer = await context.startRendering();
  const data = buffer.getChannelData(0);

  // Sum some samples to get a fingerprint value
  let fingerprint = 0;
  for (let i = 4000; i < 5000; i++) {
    fingerprint += Math.abs(data[i]);
  }

  return fingerprint.toString();
}

//bckbckjbcfhvcjlwbdjwvlebhcfhwbvk wbkhmvhwkjbv



async function getCanvasFingerprint () {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 50;
  const ctx = canvas.getContext("2d");

  // Draw text with specific styling
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);

  ctx.fillStyle = "#069";
  ctx.fillText("Hello, world! 🙂 #canvas", 2, 15);

  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText("Hello, world! 🙂 #canvas", 4, 17);

  // Get raw pixel data as base64
  const dataURL = canvas.toDataURL();
    const buffer =  new TextEncoder().encode(dataURL);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = await Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


// Measure how long each font takes to render
// Different GPU/OS combos take different time per font
function fontTimingFingerprint() {
  const fonts = ["Arial", "Helvetica", "Georgia", "Courier New", 
                 "Times New Roman", "Verdana", "Impact"];
  const sizes = [12, 24, 48, 72, 96]; // different sizes stress GPU differently
  const timings = {};

  fonts.forEach(font => {
    timings[font] = {};
    sizes.forEach(size => {
      const el = document.createElement("span");
      el.style.cssText = `
        font: ${size}px '${font}';
        position: absolute;
        visibility: hidden;
      `;
      // chars that expose rendering differences
      el.textContent = "mmmwwwiiiIII@#gggjjy";
      document.body.appendChild(el);

      const start = performance.now();
      el.getBoundingClientRect();
      timings[font][size] = performance.now() - start;

      document.body.removeChild(el);
    });
  });
  return JSON.stringify(timings);
}
(async () => {
  const [canvasFp, audioFp] = await Promise.all([
    getCanvasFingerprint(),
    getAudioFingerprint(),
  ]);

  const allParts = [
    canvasFp,
    audioFp,
    fontTimingFingerprint(),
    navigator.userAgent,
    screen.width + "x" + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency,
    navigator.language,
  ].join("|||");
  finalfingerprint = allParts;

})();

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
setTimeout( async () => {
  try {
    const result = await fetch('/fingerprint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fingerprint: finalfingerprint })
    });
    const data = await result.json();
    if (!data.success) {
      console.error('Fingerprint POST failed:', data.message);
    }else{
      console.log('Fingerprint sent successfully');
    }
  } catch (error) {
    console.error('Error sending fingerprint:', error);
  }
}, 500);
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

 
