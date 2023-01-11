import {
  setSelectedColor,
  setSelectedScheme,
  setSelectedNumber,
  setEventAction,
  schemeSelector,
  colorSelector,
  numSelector,
} from "./userSelects.js";

import { selectComponent } from "./utils.js";

const colorSchemeEl = selectComponent("color-scheme");
const hexCopiedEl = selectComponent("hex-copied");

// Default values to appear on page load. Will be changed based on used selection
let selectedColor = "FFDB58";
let selectedScheme = "monochrome";
let selectedNumber = 5;

// Event listeners for user selections
schemeSelector.addEventListener("change", () => {
  setEventAction(setSelectedScheme);
});

colorSelector.addEventListener("input", () => {
  setEventAction(setSelectedColor);
});

numSelector.addEventListener("change", () => {
  setEventAction(setSelectedNumber);
});

// Event to copy color color's hex value to clipboard
document.addEventListener("click", function (e) {
  if (e.target.dataset.hex) {
    copyHex(e.target);
  }
});

// Copies hex to clipboard
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

// Fetches color scheme from colors api based on user selections
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

// Renders colors on page
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

// Fetches default color scheme on page load
fetchColorScheme(selectedColor, selectedScheme, selectedNumber);


export {fetchColorScheme}