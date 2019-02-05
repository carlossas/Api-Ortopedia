"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
var router = express_1.Router();
router.get('/usuario', (req, res) => {
    //RECIBIR DATOS POR PARAMETROS
    // const id = req.params.id;
    //RECIBIR DATOS POR POST(BODY)
    // let id = req.body.id;
    // var body = req.body;
    return res.status(200).json({
        error: false,
        mensaje: "Todo esta bien"
    });
});
exports.route_index = router;
