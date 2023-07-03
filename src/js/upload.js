const fileInput = document.querySelector("#files");

function dropHandler(event) {
	event.preventDefault();

	if (event.dataTransfer.items) {
		[...event.dataTransfer.items].forEach((item, i) => {
			if (item.kind === "file") {
				const file = item.getAsFile();
				fileReader(file);
			}
		});
	} else {
		[...event.dataTransfer.files].forEach((file, i) => {
			fileReader(file);
		});
	}
}

function dragOverHandler(event) {
	console.log("File(s) in drop zone");
	event.preventDefault();
}

fileInput.addEventListener("change", () => {
	for (const file of fileInput.files) {
		fileReader(file);
	}
});

function fileReader(file) {
	const reader = new FileReader();

	reader.onload = (event) => {
		let data = window.localStorage.getItem("data");
		let array;
		let object;

		data = JSON.parse(data);
		array = event.target.result.replace(/\r/g, "").split("\n");
		array.splice(0, 1);
		array.splice(1, 1);
		array[0] = array[0].replace(/ /g, "");
		array[0] = array[0].split(";");
		array[0].splice(0, 1);
		array[0][0] = array[0][0].replace("Route:", "");
		array[0][2] = array[0][2].replace(/,/g, "");
		array[0][2] = array[0][2].concat("Z");
		for (let i = 1; i < array.length; i++) {
			if (array[i] == "" || array[i] == undefined) {
				array.splice(i, 1);
			} else {
				array[i] = array[i].split(",");
				for (let index = 1; index <= 2; index++) {
					array[i][index] = array[i][index].split(" ");
					if (array[i][index][1].length == 4) {
						array[i][index][1] = "0" + array[i][index][1];
					}
					array[i][index] =
						array[i][index][0] + " " + array[i][index][1];
					array[i][index] = array[i][index].split("/");
					if (array[i][index][0].length == 1) {
						array[i][index][0] = "0" + array[i][index][0];
					}
					array[i][index] =
						array[i][index][0] +
						"/" +
						array[i][index][1] +
						"/" +
						array[i][index][2];
				}

				array[i] = {
					PRN: array[i][0],
					visibilityBegin: array[i][1],
					visibilityEnd: array[i][2],
				};
			}
		}
		object = {
			Site: array[0][0],
			Date: array[0][1],
			Time: array[0][2],
		};
		array.splice(0, 1);
		object.Data = array;
		data.push(object);
		console.log(data);
		data = JSON.stringify(data);

		window.localStorage.setItem("data", data);
	};
	reader.readAsText(file);
}
