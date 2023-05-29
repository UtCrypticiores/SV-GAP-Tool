var data;

window.onload = (event) => {
	data = window.localStorage.getItem("data");
	if (data.length == 0) {
		noFiles();
		return;
	}
	data = JSON.parse(data);

	console.log(data);

	loadSelection();
	outage();
};

function loadSelection() {
	let sites = [];
	let PRN = [];

	for (let i = 0; i < data.length; i++) {
		sites.push(data[i].Site);
		for (let index = 0; index < data[i].Data.length; index++) {
			PRN.push(data[i].Data[index].PRN);
		}
	}
	PRN = [...new Set(PRN)];
	sites = [...new Set(sites)];

	console.log(sites, PRN);
}

function outage() {}

function noFiles() {
	console.log("No files found");
}
