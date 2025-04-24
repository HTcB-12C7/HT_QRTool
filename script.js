function generateQR() {
  const url = document.getElementById("urlInput").value.trim();
  const qrContainer = document.getElementById("qrcode");

  qrContainer.innerHTML = ""; // 清空旧二维码
  if (!url) return;

  QRCode.toCanvas(url, { width: 200, margin: 1 }, function (err, canvas) {
    if (err) {
      alert("生成二维码失败！");
      return;
    }
    qrContainer.appendChild(canvas);
  });
}

function downloadQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return alert("请先生成二维码！");
  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function copyQR() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return alert("请先生成二维码！");
  canvas.toBlob(blob => {
    navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
    alert("二维码已复制到剪贴板！");
  });
}

function scanQRCode(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      const resultDiv = document.getElementById("scan-result");
      if (code) {
        resultDiv.textContent = "✅ 识别结果：" + code.data;
      } else {
        resultDiv.textContent = "❌ 没有识别到二维码";
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
