function clearBuffer() {
	window.localStorage.setItem("data", "[]");
}

function readFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var json = JSON.stringify(allText);
				return json
            }
        }
    }
    rawFile.send(null);
}
