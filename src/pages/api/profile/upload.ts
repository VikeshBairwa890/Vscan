import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Read the query parameters or inspect multipart context
    const urlParams = new URL(req.url || "", `http://${req.headers.host}`);
    const typeParam = urlParams.searchParams.get("type");

    let isQr = typeParam === "qr" || req.url?.includes("qr");

    // We can also check if body is parsed (for base64/JSON uploads)
    if (req.body && typeof req.body === "object") {
      if (req.body.type === "qr" || req.body.type === "paymentQr") {
        isQr = true;
      }
    }

    // Return high quality visual assets based on the type
    let returnedUrl = "";
    if (isQr) {
      returnedUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=business@upi&pn=Vscan%20Merchant";
    } else {
      // Stunning Unsplash business logo template
      returnedUrl = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80";
    }

    return res.status(200).json({
      success: true,
      url: returnedUrl,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Simulated upload failed",
      error: error.message,
    });
  }
}
