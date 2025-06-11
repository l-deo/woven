var gray = 'rgb(202, 202, 202)';
var beige = 'rgb(220, 206, 194)';
var lgreen = 'rgb(204, 232, 207)';
var mauve = 'rgb(246, 234, 245)';
var tea = 'rgb(227, 221, 208)';
var color = [gray, beige, lgreen, mauve, tea];
var body = document.getElementsByTagName("body")[0];

window.onload = function () {
    body.style.backgroundColor = color[Math.floor(Math.random() * color.length)];
}


