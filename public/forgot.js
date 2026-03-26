let email = document.getElementById('email');
let sendcode = document.getElementById('sendcode');
let code = document.getElementById('code');
let verbtn = document.getElementById('verbtn');
let newpassword = document.getElementById('newpassword');
let confirmpassword = document.getElementById('confirmpassword');
let resetbtn = document.getElementById('resetbtn');
let message = document.getElementById('message');

sendcode.addEventListener('click', async () => {
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

verbtn.addEventListener('click', async () => {
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

resetbtn.addEventListener('click', async () => {
     const emailValue = email.value.trim();
    const newPasswordValue = newpassword.value.trim();
    const confirmPasswordValue = confirmpassword.value.trim();
    if (newPasswordValue !== confirmPasswordValue) {
        message.innerHTML = 'Passwords do not match.';
        return;
    }
    try {
    const response = await fetch('/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordValue , email: emailValue })
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