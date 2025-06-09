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
exports.createOrder = createOrder;
exports.getDepth = getDepth;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const wallet_1 = require("@ethersproject/wallet");
const index_1 = require("./clob-client/src/index");
function createOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        const TOKEN_ID = process.env.TOKEN_ID;
        if (!TOKEN_ID)
            throw new Error("TOKEN_ID not set in environment");
        const ETH_PRIVATE_KEY = process.env.PRIVATE_KEY;
        if (!ETH_PRIVATE_KEY) {
            throw new Error("Private key not set");
        }
        const host = process.env.CLOB_API_URL || "http://clob.polymarket.com";
        const signer = new wallet_1.Wallet(ETH_PRIVATE_KEY);
        const clobClient = new index_1.ClobClient(host, index_1.Chain.POLYGON, signer, {
            key: process.env.POLYMARKET_API_KEY,
            secret: process.env.POLYMARKET_SECRET,
            passphrase: process.env.POLYMARKET_PASS_PHRASE,
        });
        const order = yield clobClient.createOrder({
            tokenID: TOKEN_ID,
            price: 0.74,
            side: index_1.Side.BUY,
            size: 5,
            feeRateBps: 0,
        });
        const resp = yield clobClient.postOrder(order);
        console.log(resp);
    });
}
function getDepth(tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        const host = process.env.CLOB_API_URL || "http://clob.polymarket.com";
        const ETH_PRIVATE_KEY = process.env.PRIVATE_KEY;
        const signer = new wallet_1.Wallet(ETH_PRIVATE_KEY);
        const clobClient = new index_1.ClobClient(host, index_1.Chain.POLYGON, signer, {
            key: process.env.POLYMARKET_API_KEY,
            secret: process.env.POLYMARKET_SECRET,
            passphrase: process.env.POLYMARKET_PASS_PHRASE,
        });
        const apiResponse = yield clobClient.createOrDeriveApiKey();
        console.log(apiResponse);
        const response = yield clobClient.getOrderBook(tokenId);
        let depth = { buy: {}, sell: {} };
        response.bids.map((bid) => {
            depth.buy[bid.price.toString()] = bid.size.toString();
        });
        response.asks.map((ask) => {
            depth.sell[ask.price.toString()] = ask.size.toString();
        });
        return depth;
    });
}
