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
			<label for= "site${sites[i]}Checkbox"> <br>
			  <input type="checkbox" id="site${sites[i]}Checkbox" onchange="dataDisplay();" checked/>${sites[i]}</label> 
			`;
	}
	for (let i = 0; i < PRN.length; i++) {
		PRNBoxes =
			PRNBoxes +
			`
			<label for= "PRN${PRN[i]}Checkbox"> <br>
			  <input type="checkbox" id="PRN${PRN[i]}Checkbox" onchange="toggleDisplay('PRN${PRN[i]}Vis')" checked />${PRN[i]}</label>  
			`;
	}

	siteDropdown.innerHTML = siteBoxes;
	PRNDropdown.innerHTML = PRNBoxes;

	document.getElementById("sites").appendChild(siteDropdown);
	document.getElementById("PRN").appendChild(PRNDropdown);
}

function dataDisplay() {
	let vis = dataFormatting();
	document.getElementById("dataWrapper").innerHTML = "";

	for (let i = 0; i < vis.length; i++) {
		let PRNVis = document.createElement("div");
		let text = `<br>SV ${vis[i].PRN}`;
		for (let index = 0; index < vis[i].times.length; index++) {
			text =
				text +
				`<br> Start: ${vis[i].times[index].start} Stop: ${vis[i].times[index].stop}`;
		}
		PRNVis.id = `PRN${vis[i].PRN}Vis`;
		PRNVis.innerHTML = text;
		document.getElementById("dataWrapper").appendChild(PRNVis);
	}
}

function dataFormatting() {
	let refinedData = [];
	let siteTimes = [];
	let visGaps = [];
	let test = false;
	let min;
	let startOfVis;

	//remove all unselected sites
	for (let i = 0; i < data.length; i++) {
		if (document.getElementById(`site${data[i].Site}Checkbox`).checked) {
			refinedData.push(data[i]);
		}
	}

	console.log(refinedData);
	//put all start and stop times for a PRN together
	for (let i = 0; i < refinedData.length; i++) {
		if (
			document.getElementById(`site${refinedData[i].Site}Checkbox`)
				.checked
		) {
			for (let index = 0; index < refinedData[i].Data.length; index++) {
				test = false;
				for (let ii = 0; ii < siteTimes.length; ii++) {
					if (siteTimes[ii].PRN == refinedData[i].Data[index].PRN) {
						siteTimes[ii].times.push({
							start: refinedData[i].Data[index].visibilityBegin,
							stop: refinedData[i].Data[index].visibilityEnd,
						});
						test = true;
					}
				}
				if (!test) {
					siteTimes.push({
						PRN: refinedData[i].Data[index].PRN,
						times: [
							{
								start: refinedData[i].Data[index]
									.visibilityBegin,
								stop: refinedData[i].Data[index].visibilityEnd,
							},
						],
					});
				}
			}
		}
	}
	//sorting
	for (let index = 0; index < siteTimes.length; index++) {
		startOfVis = 0;
		//start passes
		for (let i = 0; i < siteTimes[index].times.length; i++) {
			//index of smallest element
			min = i;
			//check for lesser element
			for (let j = i + 1; j < siteTimes[index].times.length; j++) {
				if (
					dateTimeToInt(siteTimes[index].times[j].start) <
					dateTimeToInt(siteTimes[index].times[min].start)
				) {
					min = j;
				}
			}
			//compare indexes
			if (min !== i) {
				//swap
				[siteTimes[index].times[i], siteTimes[index].times[min]] = [
					siteTimes[index].times[min],
					siteTimes[index].times[i],
				];
			}
		}
		//merge vis times together
		for (let i = 0; i < siteTimes[index].times.length; i++) {
			if (i != siteTimes[index].times.length - 1) {
				if (
					dateTimeToInt(siteTimes[index].times[startOfVis].start) <=
						dateTimeToInt(
							siteTimes[index].times[startOfVis + 1].start
						) &&
					dateTimeToInt(
						siteTimes[index].times[startOfVis + 1].start
					) <= dateTimeToInt(siteTimes[index].times[startOfVis].stop)
				) {
					siteTimes[index].times[startOfVis].stop =
						siteTimes[index].times[startOfVis + 1].stop;
					siteTimes[index].times.splice(startOfVis + 1, 1);
					i--;
				} else {
					startOfVis = i;
				}
			}
		}
		//invert vis times to get vis gaps
		if (document.getElementById("visGaps").checked) {
			if (
				dateTimeToInt(siteTimes[index].times[0].start)
					.toString()
					.slice(-4) != "0000"
			) {
				visGaps.push({
					PRN: siteTimes[index].PRN,
					times: [
						{
							start:
								siteTimes[index].times[0].start.split(" ")[0] +
								" 00:00",
							stop: siteTimes[index].times[0].start,
						},
					],
				});
			} else {
				visGaps.push({
					PRN: siteTimes[index].PRN,
					times: [],
				});
			}
			for (let i = 0; i < siteTimes[index].times.length; i++) {
				if (i + 1 < siteTimes[index].times.length)
					visGaps[index].times.push({
						start: siteTimes[index].times[i].stop,
						stop: siteTimes[index].times[i + 1].start,
					});
			}
			if (
				dateTimeToInt(
					siteTimes[index].times[siteTimes[index].times.length - 1]
						.stop
				)
					.toString()
					.slice(-4) != "2359"
			) {
				visGaps[index].times.push({
					start: siteTimes[index].times[
						siteTimes[index].times.length - 1
					].stop,
					stop:
						siteTimes[index].times[
							siteTimes[index].times.length - 1
						].stop.split(" ")[0] + " 23:59",
				});
			}
		}
	}
	if (document.getElementById("visGaps").checked) {
		return visGaps;
	} else {
		return siteTimes;
	}
}

function toggleDisplay(id) {
	if (document.getElementById(id).style.display == "none") {
		document.getElementById(id).style.display = "block";
	} else {
		document.getElementById(id).style.display = "none";
	}
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
