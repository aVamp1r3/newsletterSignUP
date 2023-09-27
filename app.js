const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const https = require("https"); // <--- Fixed Typo Here
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/77261a931e";

    const options = {
        method: "POST",
        auth: "username:e14b9d2ec5ad8f04e5892fc48f227e3d-us21"
    };

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            // res.send("Sucess is smiling at you");            
            res.sendFile(__dirname + '/success.html');

        } else {
            // res.send("Who the hell knows why, but, you ain't signed uptime.")
            
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', function (data) {
            // Do something with the data
            console.log(JSON.parse(data));
        });
    });


    request.write(jsonData);
    request.end();

});


app.post("/failure", function(req, res){
    res.redirect("/")
})




app.listen(process.env.PORT || 3000, () => {
});

//api key
// e14b9d2ec5ad8f04e5892fc48f227e3d-us21
//id
// 77261a931e
