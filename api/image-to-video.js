export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
   const { prompt, image, style, aspectRatio, duration } = req.body;

    const cleanPrompt = prompt?.trim();
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

const finalPrompt = `${cleanPrompt}. ${stylePrompt}. ${formatPrompt}. ${durationPrompt}.`;
    
    if (!image) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    if (!cleanPrompt) {
      return res.status(400).json({ error: "Please enter a prompt" });
    }

    const response = await fetch(
      "https://api.replicate.com/v1/models/minimax/video-01-live/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            prompt: finalPrompt,
            first_frame_image: image,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Replicate error:", data);
      return res.status(response.status).json({
        error: data?.detail || "Image-to-video generation failed",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Image-to-video error:", error);

    return res.status(500).json({
      error: "Something went wrong while generating the video",
    });
  }
}
