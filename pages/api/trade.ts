// pages/api/trade.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const rawCookies = req.headers.cookie || "";
    const parsed = rawCookies ? cookie.parse(rawCookies) : {};

    const token =
      parsed.papertradex_token ||
      (req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    let { symbol, quantity, side, price } = req.body;

    if (!symbol || !quantity || !side || !price)
      return res.status(400).json({ message: "All fields required" });

    symbol = symbol.toUpperCase();
    const qty = Number(quantity);
    const p = Number(price);

    if (isNaN(qty) || isNaN(p) || qty <= 0 || p <= 0)
      return res.status(400).json({ message: "Invalid quantity or price" });

    const holdings =
      typeof user.holdings === "string"
        ? JSON.parse(user.holdings)
        : user.holdings || {};

    let newBalance = user.balance;

    if (side === "buy") {
      const cost = qty * p;

      if (newBalance < cost)
        return res.status(400).json({ message: "Insufficient balance" });

      newBalance -= cost;
      holdings[symbol] = (holdings[symbol] || 0) + qty;

    } else if (side === "sell") {
      if ((holdings[symbol] || 0) < qty)
        return res.status(400).json({ message: "Not enough shares" });

      newBalance += qty * p;
      holdings[symbol] -= qty;

      if (holdings[symbol] === 0) delete holdings[symbol];

    } else {
      return res.status(400).json({ message: "Invalid trade side" });
    }

    // TRANSACTION
    const result = await prisma.$transaction([
      prisma.trade.create({
        data: {
          userId: user.id,
          symbol,
          quantity: qty,
          side,
          price: p,
        },
      }),

      prisma.user.update({
        where: { id: user.id },
        data: {
          balance: newBalance,
          holdings,
        },
      }),
    ]);

    return res.status(200).json({
      message: "Trade executed",
      balance: newBalance,
      holdings,
    });

  } catch (err) {
    console.error("Trade API error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}