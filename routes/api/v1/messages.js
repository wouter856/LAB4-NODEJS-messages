//require express
const express = require('express');
//create a new router
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "GETTING messages",
        data: [
            { id: 1, content: "Hello world" },
            { id: 2, content: "Hello another world" } //dit zijn voorbeelden van data. Deze moet je zelf nog aanpassen naar wat je wilt
        ]
    })
});

router.post("/", (req, res) => {
    let message = req.body.message;
    res.json({
        status: "success",
        message: `POST ${message}`,
    })
});

module.exports = router;