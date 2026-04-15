export async function sendLineNotify(message: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.warn("LINE_CHANNEL_ACCESS_TOKEN not set, skipping notification");
    return;
  }

  try {
    // Use LINE Messaging API broadcast to send to all bot followers
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

    if (!res.ok) {
      console.error("LINE Messaging API error:", await res.text());
    }
  } catch (error) {
    console.error("LINE notification failed:", error);
  }
}
