"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const probo_1 = require("./probo");
const polymarket_1 = require("./polymarket");
dotenv_1.default.config();
const POLYMARKET_TOKEN_ID = "521143195012459155160551060468842099699261274828279546744";
const PROBO_TOKEN_ID = 4062874;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const depth1 = yield (0, probo_1.getDepth)(PROBO_TOKEN_ID);
        console.log(depth1);
        const depth2 = yield (0, polymarket_1.getDepth)(POLYMARKET_TOKEN_ID);
        console.log(depth2);
    });
}
main();
