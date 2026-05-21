import fs from "fs";

async function run() {
  try {
    const res = await fetch("https://sreenathsjk.github.io/PreSchooldemo/app.js");
    const text = await res.text();
    fs.writeFileSync("./app_scraped_raw.js", text);
    console.log("Scraped app.js successfully! Status:", res.status, "Size:", text.length);
  } catch (err) {
    console.error("Error scraping app.js:", err);
  }
}

run();
