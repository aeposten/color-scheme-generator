const colorSelector = selectComponent("color-input");
const schemeSelector = selectComponent("scheme-select");
const numSelector = selectComponent("num-select");
const colorSchemeEl = selectComponent("color-scheme");
const hexCopiedEl = selectComponent("hex-copied");
const saveBtn = selectComponent("save-btn");

let colorScheme = [];
let savedColors = [];
let retrievedColors;

//Dynamically selects component by id
function selectComponent(elementId) {
  let component = document.getElementById(elementId);
  return component;
}

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

// Sets color selected by user
function setSelectedColor() {
  selectedColor = colorSelector.value.slice(1);

  return selectedColor;
}

// Sets color scheme selected by user
function setSelectedScheme() {
  selectedScheme = schemeSelector.value;

  return selectedScheme;
}

// Sets desired number of colors selected by user
function setSelectedNumber() {
  selectedNumber = numSelector.value;

  return selectedNumber;
}

saveBtn.addEventListener("click", () => {
  saveColorScheme(colorScheme);
});

function setColorScheme(colors) {
  colorScheme = colors;
}

function saveColorScheme(scheme) {
  savedColors.push(scheme);
  localStorage.setItem("savedSchemes", JSON.stringify(savedColors));

  retrievedColors = JSON.parse(localStorage.getItem("savedSchemes"));
  console.log(retrievedColors);
}

function renderSavedSchemes(schemes) {
  
}

// Sets specified user actions using functions above then uses fetch function to getcolor data from API
function setEventAction(action) {
  action();
  fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
}

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
      .then((data) => {
        setColorScheme(data.colors);
        renderColors(data.colors);
      });
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
