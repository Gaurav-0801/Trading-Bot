import axios from "axios";
import { Depth } from "./types";

const AUTH_TOKEN = "uW4xKiWvc4KLWOIWpR0tfXYbhy+5RgNikJIQY/zzNsc=";

export async function getDepth(marketId: number): Promise<Depth> {
  return new Promise((resolve, reject) => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://prod.api.probo.in/api/v3/tms/trade/bestAvailablePrice?eventId=${marketId}`,
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        appid: "in.probo.pro",
        authorization: `Bearer ${AUTH_TOKEN}`,
        "content-type": "application/json",
        "if-none-match": 'W/"2234-H0TduRK4uQO7zpwRcpI+r8xzpp0"',
        origin: "https://probo.in",
        priority: "u=1, i",
        referer: "https://probo.in/",
        "sec-ch-ua": '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        "x-device-os": "ANDROID",
        "x-version-name": "10",
      },
    };

    axios
      .request(config)
      .then((response: any) => {
        let book: Depth = { buy: {}, sell: {} };

        Object.keys(response.data.data.available_qty.buy).forEach((key: string) => {
          book.buy[key] = response.data.data.available_qty.buy[key].toString();
        });

        Object.keys(response.data.data.available_qty.sell).forEach((key: string) => {
          book.sell[key] = response.data.data.available_qty.sell[key].toString();
        });

        resolve(book);
      })
      .catch((error: any) => {
        console.log(error);
        reject(error);
      });
  });
}

export async function createOrder(
  marketId: number,
  side: "buy" | "sell",
  size: number,
  price: number
) {
  const data = JSON.stringify({
    event_id: marketId,
    offer_type: side,
    order_type: "LO",
    l1_order_quantity: size,
    l1_expected_price: price,
    advanced_options: {
      auto_cancel: {
        minutes: 2,
        disable_trigger: true,
      },
      book_profit: {
        price: 4,
        quantity: 1,
        disable_trigger: true,
      },
      stop_loss: {
        price: 2.5,
        quantity: 1,
        disable_trigger: true,
      },
    },
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://prod.api.probo.in/api/v1/oms/order/initiate",
    headers: {
      accept: "*/*",
      appid: "in.probo.pro",
      authorization: `Bearer ${AUTH_TOKEN}`,
      "content-type": "application/json",
      origin: "https://probo.in",
      referer: "https://probo.in/",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "x-device-os": "ANDROID",
      "x-version-name": "10",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response: any) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error: any) => {
      console.error("Error creating order:", error);
    });
}
