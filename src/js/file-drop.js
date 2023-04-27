const fileInput = document.querySelector("#files");

function dropHandler(event) {
	// Prevent default behavior (Prevent file from being opened)
	event.preventDefault();

	if (event.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file(s)
		[...event.dataTransfer.items].forEach((item, i) => {
			// If dropped items aren't files, reject them
			if (item.kind === "file") {
				const file = item.getAsFile();
				fileReader(file);
			}
		});
	} else {
		// Use DataTransfer interface to access the file(s)
		[...event.dataTransfer.files].forEach((file, i) => {
			fileReader(file);
		});
	}
}

function dragOverHandler(event) {
	console.log("File(s) in drop zone");
	// Prevent default behavior (Prevent file from being opened)
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
		console.log (event.target.result)
	};
	reader.readAsText(file);
}
