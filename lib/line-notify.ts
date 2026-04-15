export async function sendLineNotify(message: string) {
  const token = process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    console.warn("LINE_NOTIFY_TOKEN not set, skipping notification");
    return;
  }

  try {
    const res = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ message }),
    });

    if (!res.ok) {
      console.error("LINE Notify error:", await res.text());
    }
  } catch (error) {
    console.error("LINE Notify failed:", error);
  }
}
