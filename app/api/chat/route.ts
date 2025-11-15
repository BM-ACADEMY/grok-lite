export async function POST(req: Request) {
  const { msg } = await req.json();

  if (!msg || typeof msg !== "string") {
    return new Response("Missing 'msg'", { status: 400 });
  }

  const useXai = String(process.env.USE_XAI || "false").toLowerCase() === "true";

  // Dummy fallback
  if (!useXai) {
    const reply = `I'm Eve, not quite Grok, but close enough: ${msg
      .split(" ")
      .reverse()
      .join(" ")}`;
    return new Response(reply, { status: 200 });
  }

  // Real XAI API
  const apiKey = process.env.XAI_KEY;
  if (!apiKey) {
    return new Response("Missing XAI_KEY", { status: 500 });
  }

  try {
    const r = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: msg }],
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      return new Response(`xAI error: ${text}`, { status: 502 });
    }

    const result = await r.json();

    const content =
      result?.choices?.[0]?.message?.content ||
      result?.choices?.[0]?.text ||
      JSON.stringify(result);

    return new Response(content, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
