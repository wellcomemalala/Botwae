import fetch from "node-fetch";

export default async (req, context) => {
  const LINE_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const GROUP_ID = process.env.GROUP_ID;
  const MESSAGE_TEXT = process.env.MESSAGE_TEXT || "ถึงเวลา 16:00 แล้วครับ!";

  const url = "https://api.line.me/v2/bot/message/push";

  const body = {
    to: GROUP_ID,
    messages: [{ type: "text", text: MESSAGE_TEXT }],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
};
