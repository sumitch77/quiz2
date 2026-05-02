let fileInput = document.getElementById('fileInput');
let upload = document.getElementById('upload');
let docs = document.getElementById('docs');
let usernameInput = document.getElementById('username');
let filesend;

fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
 
    const reader = new FileReader();
    reader.readAsDataURL(file);
});


upload.addEventListener('click', async (e) => {
    e.preventDefault();
  filesend = fileInput.files[0];
      const formData = new FormData();
    formData.append('filesend', filesend); 
    formData.append('username', usernameInput.value);       

    try {
        const response = await fetch('/vault', {
            method: 'POST',
            body: formData
        });
         
        const data = await response.json();  
        if (data.success) {
            message.innerText = data.message;
                setTimeout(() => {
                    message.innerText = '';
                }, 5000);
                window.location.href = '/vault';
        } else {
            message.innerText = data.message;
        }

    } catch (err) {
        message.innerText='Unable to connect to server';
     
    }
});