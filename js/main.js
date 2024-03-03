const qrForm = document.getElementById('qr-settings-form');
const dataField = document.getElementById('data');
const colorField = document.getElementById('color');
const bgColorField = document.getElementById('bg-color');
const sizeField = document.getElementById('size');
const marginField = document.getElementById('margin');
const goBackBtn = document.getElementById('go-back');
const resultSection = document.getElementById('qr-code-result');
const settingsSection = document.getElementById('qr-code-settings');

/* Handling Events */

window.addEventListener('load', () => qrForm.reset());

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

    const data = dataField.value;
    const color = colorField.value;
    const bgcolor = bgColorField.value;
    const size = sizeField.value;
    const margin = marginField.value;
    const format = document.querySelector('input[name="format"]:checked').value;

    if (!validateData(data)) {
        showError();
        return;
    }

    // if everything is correct hide the error in case it was show before
    hideError();

    const params = prepareParams({
        data,
        color,
        bgcolor,
        size,
        margin,
        format,
    });

    const qr = await createQR(params);

    if (!qr) {
        return;
    }

    showQR(qr);
}

// Factory function that returns an object with all the parameters in the right format to be passed to the api
const prepareParams = (params) => ({
    data: params.data,
    size: `${params.size}x${params.size}`, // i.e: 200x200
    color: params.color.replace('#', ''), // quitar el # del color
    bgcolor: params.bgcolor.replace('#', ''),
    margin: params.margin,
    format: params.format,
});

/* Fetching from API */

async function createQR(parameters) {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const urlParams = new URLSearchParams(parameters).toString();

    const fullUrl = `${baseUrl}?${urlParams}`;

    const qr = await fetch(fullUrl);

    if (!qr.ok) {
        return false;
    }

    return fullUrl;
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

const showError = () => {
    dataField.classList.add('error');
};

const hideError = () => {
    dataField.classList.remove('error');
};
