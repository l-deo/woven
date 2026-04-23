var d = new Date()
var time = d.getHours()

if (time < 24) {
  document.getElementById("title").innerHTML = "Good evening!";
};
if (time < 18) {
  document.getElementById("title").innerHTML = "Good afternoon!";
};
if (time < 12) {
  document.getElementById("title").innerHTML = "Good morning!";
};
if (time < 5) {
  document.getElementById("title").innerHTML = "Go to sleep!";
};

