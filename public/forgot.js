let email = document.getElementById('email');
let sendcode = document.getElementById('sendcode');
let code = document.getElementById('code');
let verbtn = document.getElementById('verbtn');
let newPassword = document.getElementById('newPassword');
let confirmPassword = document.getElementById('confirmPass');
let resetbtn = document.getElementById('resetbtn');
let message = document.getElementById('message');

sendcode.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailValue = email.value.trim();
    try {
    const response = await fetch('/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue })
    });
    const data = await response.json();
    if (data.success) {
        message.innerHTML = data.message || 'Verification code sent to your email.';
    } else {
        message.innerHTML = data.message || 'Error sending verification code.';
    }
} catch (error) {
    message.innerHTML = 'Unable to connect to server.';
}
});

verbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailValue = email.value.trim();
    const codeValue = code.value.trim();
    try {
    const response = await fetch('/forgotverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, code: codeValue })
    });
    const data = await response.json();
    if (data.success) {
        message.innerHTML = data.message || 'Code verified. You can now reset your password.';
    }   
    else {
        message.innerHTML = data.message || 'Invalid code. Please try again.';
    }
} catch (error) {
    message.innerHTML = 'Unable to connect to server.';
}
});

resetbtn.addEventListener('click', async (e) => {
e.preventDefault();
     const emailValue = email.value.trim();
    const newPasswordValue = newPassword.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();
    try {
    const response = await fetch('/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordValue , confirmPasswordValue: confirmPasswordValue, email: emailValue })
    });
    const data = await response.json();
    if (data.success) {
        message.innerHTML = data.message || 'Password reset successful!';
    }
    else {
        message.innerHTML = data.message || 'Error resetting password.';
    }
} catch (error) {
    message.innerHTML = 'Unable to connect to server.';
}
});