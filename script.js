const colorSelector = document.getElementById("color-input");
const schemeSelector = document.getElementById("scheme-select");
const numSelector = document.getElementById("num-select");
const colorSchemeEl = document.getElementById("color-scheme");
const hexCopiedEl = document.getElementById("hex-copied");
const saveBtn = document.getElementById("save-btn");
const savedSchemesList = document.getElementById("schemes");

let colorScheme = [];
let savedColors = [];
let retrievedColors;

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

document.addEventListener("click", function (e) {
  // Event to copy  color's hex value to clipboard
  if (e.target.dataset.hex) {
    copyHex(e.target, hexCopiedEl);
  }

  // Event to copy color's hex value from a saved color scheme
  if (e.target.dataset.hexsm) {
    copyHex(
      e.target,
      e.target.parentElement.parentElement.parentElement.children.namedItem(
        "hex"
      )
    );
  }

  // Deletes selected color scheme from local storage and renders saved schemes
  if (e.target.dataset.delete) {
    deleteSavedScheme(e.target.dataset.delete);
    retrievedColors = JSON.parse(localStorage.getItem("savedSchemes"));
    renderSavedSchemes(retrievedColors);
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

// Saves selected color scheme to local storage and then renders saved schemes
saveBtn.addEventListener("click", () => {
  saveColorScheme(colorScheme);
  renderSavedSchemes(retrievedColors);
});

// Sets color scheme variable for saving in local storage
function setColorScheme(colors) {
  colorScheme = colors;
}

// For use in save button event listener, adds additional color schemes to local storage
function saveColorScheme(scheme) {
  // If colors are saved in local storgae, retrieve them and use them to set saved colors variable
  if (localStorage.getItem("savedSchemes")) {
    savedColors = JSON.parse(localStorage.getItem("savedSchemes"));
  }

  // Add desired color scheme to saved colors array, then ave the array in local storage
  savedColors.push(scheme);
  localStorage.setItem("savedSchemes", JSON.stringify(savedColors));

  // Get saved color schemes from local storage, parse the JSON and save the parsed array in retrievedColors
  retrievedColors = JSON.parse(localStorage.getItem("savedSchemes"));
}

// For use in delete button event listener, deletes color schemes from local storage
function deleteSavedScheme(schemeIndex) {
  // Retrieves saved colorschemes from local storage, parses JSON and stores array in savedColors
  savedColors = JSON.parse(localStorage.getItem("savedSchemes"));

  // Removes scheme from savedColorsarray
  savedColors.splice(schemeIndex, 1);

  // stores edited savedColors array to local storage
  localStorage.setItem("savedSchemes", JSON.stringify(savedColors));
}

// Generates saved color scheme HTML from arrays saved in local storage
function generateSavedSchemeHTML(schemes) {
  const renderedSchemes = schemes
    .map(
      (scheme, index) =>
        `
    <li class="saved-scheme">
      <div class="saved-colors">
      ${scheme
        .map(
          ({ hex }) =>
            `
          <div class="saved-color">
            <div class="color-square" style="background-color:${hex.value}"></div>
            <div class="hex-small" data-hexsm=${index}>${hex.value}</div>
          </div>
          `
        )
        .join("")}
        </div>
        <div class="hex-copied" data-copied=${index} name="hex"></div>
      <button class="delete-btn" id="selete-btn" data-delete=${index}>Delete Scheme</button>
    </li>
  `
    )
    .join("");

  return renderedSchemes;
}

// Renders saved color schemes on page
function renderSavedSchemes(schemes) {
  savedSchemesList.innerHTML = `
    <li>
      ${generateSavedSchemeHTML(schemes)}
    </li>
  `;
}

// Sets specified user actions using functions above then uses fetch function to getcolor data from API
function setEventAction(action) {
  action();
  fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
}

// Copies hex to clipboard
function copyHex(element, messageEl) {
  let copiedHex = element.textContent;

  try {
    navigator.clipboard.writeText(copiedHex).then(() => {
      messageEl.textContent = `${copiedHex} Copied to Clipboard`;
      setTimeout(() => {
        messageEl.textContent = "";
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
    <div class="hex" data-hex="${index}">${hex.value}</div>
    </section>
    `
    )
    .join("");

  // If saved color schemes are found in local storage they are rendered on the page
  if (localStorage.getItem("savedSchemes")) {
    retrievedColors = JSON.parse(localStorage.getItem("savedSchemes"));
    renderSavedSchemes(retrievedColors);
  }
}

// Fetches default color scheme on page load
fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
