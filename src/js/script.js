const ssidInput     = document.getElementById('ssid');
const passwordInput = document.getElementById('password');
const passwordField = document.getElementById('passwordField');
const togglePassBtn = document.getElementById('togglePassword');
const encryptionSel = document.getElementById('encryption');
const hiddenCheck   = document.getElementById('hidden');
const qrResult      = document.getElementById('qrResult');
const networkName   = document.getElementById('networkName');
const printNetwork  = document.getElementById('printNetwork');
const printPassword = document.getElementById('printPassword');
const printPassField = document.getElementById('printPasswordField');
const eyeSlash      = document.querySelector('.eye-slash');

const screenQr = new QRCode('qrcode', {
    width: 240,
    height: 240,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
});

// SVG for crisp print output
const printQr = new QRCode('printQrcode', {
    width: 300,
    height: 300,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
    useSVG: true,
});

function escapeWifi(s) {
    return s.replace(/[\\;,":]/g, c => '\\' + c);
}

function buildWifiString(ssid, password, encryption, hidden) {
    return `WIFI:S:${escapeWifi(ssid)};T:${encryption};P:${escapeWifi(password)};H:${hidden};;`;
}

let debounceTimer;

function generate() {
    const ssid = ssidInput.value.trim();

    if (!ssid) {
        qrResult.hidden = true;
        return;
    }

    const nopass     = encryptionSel.value === 'nopass';
    const password   = nopass ? '' : passwordInput.value;
    const hidden     = hiddenCheck.checked ? 'true' : 'false';
    const wifiStr    = buildWifiString(ssid, password, encryptionSel.value, hidden);

    screenQr.makeCode(wifiStr);
    printQr.makeCode(wifiStr);

    networkName.textContent  = ssid;
    printNetwork.textContent = ssid;
    
    if (!nopass && password) {
        printPassword.textContent = password;
        printPassField.style.display = 'block';
    } else {
        printPassField.style.display = 'none';
    }

    qrResult.hidden = false;
}

function onInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(generate, 280);
}

ssidInput.addEventListener('input', onInput);
passwordInput.addEventListener('input', onInput);
hiddenCheck.addEventListener('change', generate);

encryptionSel.addEventListener('change', () => {
    passwordField.hidden = encryptionSel.value === 'nopass';
    generate();
});

togglePassBtn.addEventListener('click', () => {
    const visible = passwordInput.type === 'text';
    passwordInput.type = visible ? 'password' : 'text';
    eyeSlash.style.display = visible ? 'none' : 'block';
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    // canvas.toBlob() + object URL works across Android Chrome/Firefox;
    // data URI hrefs are blocked for downloads on many mobile browsers.
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) return;

    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wifi-${ssidInput.value.trim() || 'qr'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }, 'image/png');
});

document.getElementById('printBtn').addEventListener('click', () => window.print());
