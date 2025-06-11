document.getElementById('ipframe').onload = function(){
	document.getElementById('ipframe')//获取到iframe
	.contentWindow//获取到iframe的window
	.document//获取到iframe的document
	.getElementById('app')//正常获取元素
	.style.display = "none";//修改样式
};

