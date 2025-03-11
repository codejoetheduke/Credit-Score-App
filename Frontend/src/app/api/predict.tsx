import { NextApiRequest, NextApiResponse } from "next";

interface PredictionResult {
  approval: string;
  confidence: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    const formData = req.body;

    // Call your model here (replace this with actual logic)
    const prediction: PredictionResult = {
      approval: "Approved",
      confidence: 0.95,
    };

    res.status(200).json(prediction);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
