const colorSelector = document.getElementById("color-input");
const schemeSelector = document.getElementById("scheme-select");
const numSelector = document.getElementById("num-select");
const colorSchemeEl = document.getElementById("color-scheme");
const hexCopiedEl = document.getElementById("hex-copied");

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

function setEventAction(action) {
  action();
  fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
}

schemeSelector.addEventListener("change", () => {
  setEventAction(setSelectedScheme);
});

colorSelector.addEventListener("input", () => {
  setEventAction(setSelectedColor);
});

numSelector.addEventListener("change", () => {
  setEventAction(setSelectedNumber);
});

document.addEventListener("click", function (e) {
  if (e.target.dataset.hex) {
    copyHex(e.target);
  }
});

function copyHex(element) {
  let copiedHex = element.textContent;

  try {
    navigator.clipboard.writeText(copiedHex).then(() => {
      hexCopiedEl.textContent = `${copiedHex} Copied to Clipboard`;
      setTimeout(() => {
        hexCopiedEl.textContent = "";
      }, 3000);
    });
  } catch (error) {
    console.error(error);
  }
}

function fetchColorScheme(colorValue, scheme, count) {
  try {
    fetch(
      `https://www.thecolorapi.com/scheme?hex=${colorValue}&mode=${scheme}&count=${count}`
    )
      .then((response) => response.json())
      .then((data) => renderColors(data.colors));
  } catch (error) {
    console.log(error);
  }
}

function renderColors(colors) {
  colorSchemeEl.innerHTML = colors
    .map(
      ({ hex, name }, index) => `
    <section class="color">
    <div class="color-bar" style="background-color:${hex.value}"></div>
    <div class="color-name"></div>
    <div class="hex" data-hex="${index}">${hex.value}</div>
    </section>
    `
    )
    .join("");
}

fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
