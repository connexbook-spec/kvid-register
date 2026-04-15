export async function sendLineNotify(message: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  console.log("LINE_CHANNEL_ACCESS_TOKEN exists:", !!token, "length:", token?.length || 0);

  if (!token) {
    console.warn("LINE_CHANNEL_ACCESS_TOKEN not set, skipping notification");
    return;
  }

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ type: "text", text: message }],
      }),
    });

    const body = await res.text();
    console.log("LINE API response:", res.status, body);
  } catch (error) {
    console.error("LINE notification failed:", error);
  }
}
