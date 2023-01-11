const colorSelector = document.getElementById("color-input");
const schemeSelector = document.getElementById("scheme-select");
const numSelector = document.getElementById("num-select");
const colorSchemeEl = document.getElementById("color-scheme");

let selectedColor = "FFDB58";
let selectedScheme = "monochrome";
let selectedNumber = 5;

let colorsArray = [];

function setSelectedColor() {
  selectedColor = colorSelector.value.slice(1);

  return selectedColor;
}

function setSelectedScheme() {
  selectedScheme = schemeSelector.value;

  return selectedScheme;
}

function setSelectedNumber() {
  selectedNumber = numSelector.value;
  
  return selectedNumber;
}

schemeSelector.addEventListener("change", () => {
  setSelectedScheme();
  fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
});

colorSelector.addEventListener("input", () => {
  setSelectedColor();
  fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
});

numSelector.addEventListener("change", () => {
  setSelectedNumber();
  fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
});

function fetchColorScheme(colorValue, scheme, count) {
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${colorValue}&mode=${scheme}&count=${count}`
  )
    .then((response) => response.json())
    .then((data) => renderColors(data.colors));
}

function renderColors(colors) {
  colorSchemeEl.innerHTML = colors
    .map(
      ({ hex, name }) => `
    <section class="color">
    <div class="color-bar" style="background-color:${hex.value}"></div>
    <div class="color-name"></div>
    <div class="hex">${hex.value}</div>
    </section>
    `
    )
    .join("");
}

fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
