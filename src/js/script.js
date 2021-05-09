function escape_string (string) {
    var to_escape = ['\\', ';', ',', ':', '"'];
    var output = "";
    for (var i=0; i<string.length; i++) {
        if(to_escape.indexOf(string[i]) != -1) {
            output += '\\'+string[i];
        }
        else {
            output += string[i];
        }
    }
    return output;
};


function create_wifi_string(ssid, password, encryptionType="nopass", isHidden="false")
{
    const escaped_ssid = escape_string(ssid)
    const escaped_password = escape_string(password)
    return [
        'WIFI:',
        `S:${escaped_ssid};`,
        `T:${encryptionType};`,
        `P:${escaped_password};`,
        `H:${isHidden};`,
        ';'
    ].join('')
}

function main() {
	// const dataName = document.getElementById("dataName");

	const generateBtn = document.getElementById("generateBtn");
	const downloadBtn = document.getElementById("downloadBtn");
	const qrcode = document.getElementById("qrcode");
	const qrdiv = document.getElementById("qrdiv");

	const errorClassName = "error";
	const dataBoxClassName = "dataBox";
    //	const toHideClassName = "hide";
    //	const qrdivClassName = "qrdiv";

	var QR_CODE = new QRCode("qrcode", {
		width: 260,
		height: 260,
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.H,
	});

	generateBtn.onclick = function (e) {
		const ssid = dataName.value;
		const password = dataPassword.value;
		if (! ssid)
            markDataBoxError(dataName);
        if (! password)
            markDataBoxError(dataPassword);
        if (ssid && password) {
            var qrstring = create_wifi_string(ssid, password, encryption.value, hidden.value)
            generateQRCode(qrstring);
            document.getElementById("wifiName").innerHTML = ssid;
            document.getElementById("wifiPassword").innerHTML = password;
            window.print();

		}
        return false;
	};

	dataName.onfocus = function (e) {
		if (dataName.classList.contains(errorClassName)) {
			// Removing error class
			dataName.className = dataBoxClassName;
		}
	};
	dataPassword.onfocus = function (e) {
		if (dataPassword.classList.contains(errorClassName)) {
			// Removing error class
			dataPassword.className = dataBoxClassName;
		}
	};

    // printBtn.onclick = function (e) {
    //     window.print();
    //     return false;
    // }

	// downloadBtn.onclick = function (e) {
	// 	// Image tag
	// 	const img = qrcode.getElementsByTagName("img")[0];
	// 	// Canvas tag
	// 	const canvas = qrcode.getElementsByTagName("canvas")[0];

	// 	// Padding to QRCode
	// 	const padding = 40;

	// 	// Adding padding to width and height
	// 	canvas.width = canvas.width + padding;
	// 	canvas.height = canvas.height + padding;

	// 	// Canvas context
	// 	const context = canvas.getContext("2d");
	// 	// Clearing previous content
	// 	context.clearRect(0, 0, canvas.width, canvas.height);
	// 	// Making the background white
	// 	context.fillStyle = "#ffffff";
	// 	context.fillRect(0, 0, canvas.width, canvas.height);
	// 	// Adding the image of QRCode
	// 	// x and y are padding / 2
	// 	context.drawImage(img, padding / 2, padding / 2);
    //     context.fillStyle = "black";
    //     context.textAlign = "center";
	// 	// Getting base64 url
	// 	const image = canvas.toDataURL("image/png", 1);
	// 	const filename = "QR_Code_" + Date.now() + ".png";
	// 	downloadImage(image, filename);
	// };

	function markDataBoxError(field) {
		const prevClassName = field.className;
		field.className = prevClassName + " " + errorClassName;
	}

	function generateQRCode(data) {
		QR_CODE.clear();
		QR_CODE.makeCode(data);
		// Show QRCode div
        qrdiv.style.display = 'block';
        // qrdiv2.style.display = 'block';
	}

	function downloadImage(image, filename) {
		// Creating hidden <a> tag to download
		var element = document.createElement("a");
		element.setAttribute("href", image);
		element.setAttribute("download", filename);
		// element.setAttribute("class", toHideClassName);
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
}

main();
