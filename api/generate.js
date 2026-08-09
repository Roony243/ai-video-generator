export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
   const { prompt, style, aspectRatio, duration } = req.body;
const stylePrompt =
  style === "anime" ? "anime style" :
  style === "3d" ? "high-quality 3D animation style" :
  style === "realistic" ? "photorealistic, realistic cinematography" :
  "cinematic, professional film look";
const formatPrompt =
  aspectRatio === "9:16" ? "vertical portrait 9:16 composition" :
  aspectRatio === "1:1" ? "square 1:1 composition" :
  "widescreen landscape 16:9 composition";

const durationPrompt = `approximately ${duration || 5} seconds`;
    

const finalPrompt = `${prompt}. ${stylePrompt}. ${formatPrompt}. ${durationPrompt}.`;
    if (!prompt) {
      return res.status(400).json({ error: "Please enter a prompt" });
    }

    const response = await fetch(
      "https://api.replicate.com/v1/models/minimax/video-01/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait"
        },
        body: JSON.stringify({
          input: {
            prompt: finalprompt,
            prompt_optimizer: true
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong generating the video."
    });
  }
}
