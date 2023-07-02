var data;

window.onload = (event) => {
	data = window.localStorage.getItem("data");
	if (data.length == 0) {
		noFiles();
		return;
	}
	data = JSON.parse(data);

	loadSelection();
	dataDisplay();
	console.log(data);
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

	outage(sites, PRN);
}

function outage(sites, PRN) {
	let siteDropdown = document.createElement("form");
	let PRNDropdown = document.createElement("form");
	let siteBoxes = "Sites";
	let PRNBoxes = "SV";

	for (let i = 0; i < sites.length; i++) {
		siteBoxes =
			siteBoxes +
			`
			<label for= "${sites[i]}"> <br>
			  <input type="checkbox" id="${sites[i]}" checked/>${sites[i]}</label> 
			`;
	}
	for (let i = 0; i < PRN.length; i++) {
		PRNBoxes =
			PRNBoxes +
			`
			<label for= "${PRN[i]}"> <br>
			  <input type="checkbox" id="${PRN[i]}" checked/>${PRN[i]}</label>  
			`;
	}

	siteDropdown.innerHTML = siteBoxes;
	PRNDropdown.innerHTML = PRNBoxes;

	document.getElementById("sites").appendChild(siteDropdown);
	document.getElementById("PRN").appendChild(PRNDropdown);
}

function dataDisplay() {
	let siteTimes = [];
	let test = false;

	for (let i = 0; i < data.length; i++) {
		if (document.getElementById(data[i].Site).checked) {
			for (let index = 0; index < data[i].Data.length; index++) {
				test = false;
				for (let ii = 0; ii < siteTimes.length; ii++) {
					if (siteTimes[ii].PRN == data[i].Data[index].PRN) {
						siteTimes[ii].times.push({
							start: data[i].Data[index].visibilityBegin,
							stop: data[i].Data[index].visibilityEnd,
						});
						test = true;
					}
				}
				if (!test) {
					siteTimes.push({
						PRN: data[i].Data[index].PRN,
						times: [
							{
								start: data[i].Data[index].visibilityBegin,
								stop: data[i].Data[index].visibilityEnd,
							},
						],
					});
				}
			}
		}
	}
	console.log(siteTimes);
}

function dateTimeToInt(dateTime) {
	let int;

	dateTime = dateTime.split(/\/| |:/g);
	dateTime =
		dateTime[2] + dateTime[0] + dateTime[1] + dateTime[3] + dateTime[4];
	int = parseInt(dateTime);

	return int;
}

function noFiles() {
	console.log("No files found");
}
