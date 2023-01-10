const colorSelector = document.getElementById("color-input");
let selectedColor = "";

function setSelectedColor() {
  selectedColor = colorSelector.value.slice(1);

  return selectedColor;
}

colorSelector.addEventListener("input", () => {
  setSelectedColor();
  fetchColorScheme(selectedColor);
});

function fetchColorScheme(colorValue) {
  fetch(`https://www.thecolorapi.com/id?hex=${colorValue}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}
