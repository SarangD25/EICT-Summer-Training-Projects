let display = document.getElementById('display');

function appendValue(val) {
    if (display.value === '0' || display.value === 'Error') {
        display.value = val;
    } else {
        display.value += val;
    }
}

function clearDisplay() {
    display.value = '0';
}

function deleteLast() {
    if (display.value.length === 1 || display.value === 'Error') {
        display.value = '0';
    } else {
        display.value = display.value.slice(0, -1);
    }
}

function toggleSign() {
    if (display.value !== '0' && display.value !== 'Error') {
        if (display.value.startsWith('-')) {
            display.value = display.value.substring(1);
        } else {
            display.value = '-' + display.value;
        }
    }
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch (e) {
        display.value = 'Error';
    }
}
