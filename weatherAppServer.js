const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./templates");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const indexRoutes = require("./routes/index");
const searchRoutes = require("./routes/search");
const weatherRoutes = require("./routes/weather");
const recentRoutes = require("./routes/recent");

app.use('/', indexRoutes);
app.use("/search", searchRoutes);
app.use("/weather", weatherRoutes);
app.use("/recent", recentRoutes);

if (process.argv.length !== 2) {
    process.stdout.write("Usage summerCampServer.js");
    process.exit(1);
}

const portNumber = process.env.PORT || 3000;
app.listen(portNumber, () => {
});

process.stdin.setEncoding("utf8");

const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);

process.stdin.on("readable", () => {
    const input = process.stdin.read();
    if (input !== null) {
        const command = input.trim();
        if (command === "stop") {
            process.stdout.write("Shutting down the server");
            process.exit(0);
        } else {
            process.stdout.write(`Invalid command: ${command}\n`);
        }
        process.stdout.write(prompt);
        process.stdin.resume();
    }
});