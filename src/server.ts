
import * as express from "express";
import { root } from "./routes/root";
import { isNumber } from "./utils";

const app = express();


function setupExpress() {
    app.route("/").get(root);
}

function startServer() {
    const portArg = process.argv[2];
    let port: number;

    if (isNumber(portArg)) {
        port = parseInt(portArg);
    }

    if (!port) {
        port = 9000;
    }

    app.listen(port, () => {

        console.log(`Express is running on port localhost:${port}`)
    })
}


setupExpress();
startServer();