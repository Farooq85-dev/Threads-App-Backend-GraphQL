"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    try {
        res.json({ msg: "Hello From Server!" });
    }
    catch (error) {
        console.log(error);
    }
});
const PORT = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) || 3500;
app.listen(PORT, () => {
    console.log(`Server is Running at:- ${PORT}`);
});
