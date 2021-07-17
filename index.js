const fs = require("fs");
const { join } = require("path");

const paths = [
  "/sdcard/Download",
  "/sdcard/Android/data/mark.via.gp/files/offline"
];

const output = process.argv[2] || "/sdcard/via.html";

const pages = [];

for (const path of paths) {
  const files = fs.readdirSync(path)
    .filter(file => file.endsWith(".mht"));

  for (const file of files) {
    const stats = fs.statSync(join(path, file));

    pages.push({
      path: join(path, file),
      url: "file://" + join(path, encodeURIComponent(file)),
      date: stats.mtime,
      size: stats.size,
      name: file.slice(0, -3).trim()
    });
  }
}

const suffixes = ["Bytes", "KB", "MB", "GB"];

function hsize(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (!bytes && "0 Bytes") || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`;
}

pages.sort((x, y) => x.date < y.date ? 1 : -1);
const psize = hsize(pages.reduce((x, y) => x + y.size, 0));

console.log(`Indexed ${pages.length} pages. (${psize})`);

let html = `
<!DOCTYPE HTML>
<html>
  <head>
    <title>Via Saved Pages</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <style>
    .box {
      background-color: white;
      border-radius: 6px;
      box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
      color: #4a4a4a;
      display: block;
      text-overflow: hidden;
      padding: 1.25rem;
    }

    body {
      background-color: white;
      max-width: -webkit-calc(800px - 30px);
      max-width:         calc(800px - 30px);
      padding-right: 15px;
      padding-left: 15px;
      margin-left: auto;
      margin-right: auto;
    }

    .subtitle {
      color: #4a4a4a;
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1.25;
    }

    #myBtn {
      display: none; /* Hidden by default */
      position: fixed; /* Fixed/sticky position */
      bottom: 20px; /* Place the button at the bottom of the page */
      right: 30px; /* Place the button 30px from the right */
      z-index: 99; /* Make sure it does not overlap */
      border: none; /* Remove borders */
      outline: none; /* Remove outline */
      background-color: red; /* Set a background color */
      color: white; /* Text color */
      cursor: pointer; /* Add a mouse pointer on hover */
      padding: 15px; /* Some padding */
      border-radius: 10px; /* Rounded corners */
      font-size: 18px; /* Increase font size */
    }

    #myBtn:hover {
      background-color: #555; /* Add a dark-grey background on hover */
    }
    </style>
  </head>
  <body>
    <button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>
    <script>
      const mybutton = document.getElementById("myBtn");
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }

      function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    </script>
    <p><strong>${pages.length}</strong> Pages.</p>
    <p>Total Size: <strong>${psize}</strong></p>
    <p class="subtitle">Generated at ${new Date().toDateString()}</p>\n`;

for (const page of pages) {
  html += `    <div class="box">
      <a target="_blank" href="${page.url}">${page.name}</a>
      <p class="subtitle">Size: ${hsize(page.size)}</p>
      <p class="subtitle">Date: ${page.date.toDateString()}</p>
    </div>\n`;
}

html += "  </body>\n</html>";

fs.writeFileSync(output, html);
console.log(`Wrote to ${output} (${hsize(Buffer.byteLength(html))})`);
