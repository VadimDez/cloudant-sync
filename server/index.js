const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 9000;
const apikey = process.env.APIKEY || "xxx";

app.use(cors());

app.get("/credentials", (req, res) => {
  console.log("GET /credentials");
  request.post(
    "https://iam.cloud.ibm.com/identity/token",
    {
      form: {
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: apikey
      }
    },
    (err, httpResponse, body) => {
      if (err) {
        return res.status(500).end();
      }

      const data = JSON.parse(body);

      return res.json(data.access_token);
    }
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
