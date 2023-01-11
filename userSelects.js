import { selectComponent } from "./utils.js";

const colorSelector = selectComponent("color-input");
const schemeSelector = selectComponent("scheme-select");
const numSelector = selectComponent("num-select");

let selectedColor = "FFDB58";
let selectedScheme = "monochrome";
let selectedNumber = 5;


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

// Sets specified user actions using functions above then uses fetch function to getcolor data from API
function setEventAction(action) {
  action();
  fetchColorScheme(selectedColor, selectedScheme, selectedNumber);
}

export {
  setSelectedColor,
  setSelectedScheme,
  setSelectedNumber,
  setEventAction,
  colorSelector,
  schemeSelector,
  numSelector
};
