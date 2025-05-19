const express = require("express");
const router = express.Router();

router.get('/', (request, response) => {
    const error = request.query.error;
    response.render("search", { error });
});

module.exports = router;