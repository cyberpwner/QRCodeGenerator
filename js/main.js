const qrForm = document.getElementById('qr-settings-form');
const dataField = document.getElementById('data');
const colorField = document.getElementById('color');
const bgColorField = document.getElementById('bg-color');
const sizeField = document.getElementById('size');
const marginField = document.getElementById('margin');
const formatFields = document.getElementsByName('format'); // all radio inputs with name 'format'
const goBackBtn = document.getElementById('go-back');
const resultSection = document.getElementById('qr-code-result');
const settingsSection = document.getElementById('qr-code-settings');

/* Handling Events */

qrForm.addEventListener('submit', handleSubmit);

goBackBtn.addEventListener('click', goBackToSettings);

colorField.addEventListener('change', updateColorValue);

bgColorField.addEventListener('change', updateBgColorValue);

sizeField.addEventListener('change', updateSizeValue);

marginField.addEventListener('change', updateMarginValue);

/* Data Handling and Validation */

function validateData(data) {
    return data.trim() !== '';
}

async function handleSubmit(event) {
    event.preventDefault();

    const data = dataField.value.trim();
    const color = String(colorField.value).substring(1); // quitar '#' del color
    const bgColor = String(bgColorField.value).substring(1); // quitar '#' del color
    const size = `${sizeField.value}x${sizeField.value}`; // i.e: 200x200
    const margin = marginField.value;

    if (!validateData(data)) {
        return;
    }

    const formatSelected = Array.from(formatFields).filter(
        (field) => field.checked,
    );

    if (!formatSelected) {
        return;
    }

    const format = formatSelected[0].value;

    const qr = await createQR(data, color, bgColor, size, margin, format);

    if (!qr) {
        return;
    }

    showQR(qr);
}

/* Fetching from API */

async function createQR(data, color, bgColor, size, margin, format) {
    const baseUri = 'https://api.qrserver.com/v1/create-qr-code/';
    const uri = `${baseUri}?data=${data}&size=${size}&color=${color}&bgcolor=${bgColor}&margin=${margin}&format=${format}`;

    const qr = await fetch(uri);

    if (!qr.ok) {
        return false;
    }

    return uri;
}

/* Dom Manipulation */

function showQR(qr) {
    resultSection.classList.add('flipped');
    settingsSection.classList.add('flipped');

    const qrImage = document.getElementById('qr-code-image');
    qrImage.src = qr;
}

function goBackToSettings() {
    resultSection.classList.remove('flipped');
    settingsSection.classList.remove('flipped');
}

function updateColorValue() {
    const colorValue = document.getElementById('color-value');
    colorValue.textContent = `${colorField.value}`;
}

function updateBgColorValue() {
    const bgColorValue = document.getElementById('bg-color-value');
    bgColorValue.textContent = `${bgColorField.value}`;
}

function updateSizeValue() {
    const sizeValue = document.getElementById('size-value');
    sizeValue.textContent = `${sizeField.value} x ${sizeField.value}`;
}

function updateMarginValue() {
    const marginValue = document.getElementById('margin-value');
    marginValue.textContent = `${marginField.value} px`;
}
