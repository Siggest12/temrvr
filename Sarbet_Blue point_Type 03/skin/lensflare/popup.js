function show_fl_textfield(a) {
	var div = document.createElement("div");
	div.id = "showCode";
	div.innerHTML = '<pre style="background: none repeat scroll 0px 0px #272822;' +
		'overflow: auto;' +
		'display: block;' +
		'opacity: 1.0;' +
		'height: 400px;' +
		'width: 600px;' +
		'margin: -200px 0 0 -300px;' +
		'top: 50%;' +
		'left: 50%;' +
		'font-size: 14px;' +
		'font-family: Courier, sans-serif;' +
		'color:#a6e22e;' +
		'padding:0px;' +
		'line-height: normal;' +
		'position:fixed;' +
		'z-index: 200000;">'+a+'</pre>';
	document.body.appendChild(div);
}

function remove_textfield() {
	var div;
	while (!!(div = document.getElementById('showCode'))) {
		div.parentNode.removeChild(div);
	}
}
