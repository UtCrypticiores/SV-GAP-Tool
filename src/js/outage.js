window.onload = (event) => {
	console.log("page is fully loaded");
	outage()
  };

function outage(sites, PRN) {
let data = window.localStorage.getItem("data")
console.log(data)

	let allowedSites = [];
	let allowedPRNs = [];

	for (let file = 0; file < data.length; file++) {
		for (let i = 0; i < sites.length; i++) {
			if (data[file].Site == sties[i]) {
				allowedSites.push(file);
			}
		}
		for (let i = 0; i < data[file].Data.length; i++) {
			for (let index = 0; index < PRN.length; index++) {
				if (data[file].Data[i] == PRN[index]) {
				}
			}
		}
	}
}
