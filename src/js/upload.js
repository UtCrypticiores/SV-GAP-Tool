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

	let data = [];

	reader.onload = (event) => {
		let array;
		let object;

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
			array[i] = array[i].split(",");
			array[i] = {
				PRN: array[i][0],
				visibilityBegin: array[i][1],
				visibilityEnd: array[i][2],
			};
		}
		object = {
			Site: array[0][0],
			Date: array[0][1],
			Time: array[0][2],
		};
		array.splice(0, 1);
		object.Data = array;
		data.push(object);

		window.localStorage.setItem("data", data);
	};
	reader.readAsText(file);
}
