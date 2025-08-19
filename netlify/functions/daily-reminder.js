import fetch from "node-fetch";

export async function handler() {
  const { LINE_CHANNEL_ACCESS_TOKEN, GROUP_ID, MESSAGE_TEXT } = process.env;

  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing LINE_CHANNEL_ACCESS_TOKEN" }) };
  }
  if (!GROUP_ID) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing GROUP_ID (กลุ่มเป้าหมาย)" }) };
  }

  const url = "https://api.line.me/v2/bot/message/push";
  const payload = {
    to: GROUP_ID,                         // ส่งเข้ากลุ่ม
    messages: [{ type: "text", text: MESSAGE_TEXT || "วันนี้ใช้น้ำมันไปกี่ถุงครับ คุณนายซี และมาดามเจี๊ยบ  โปรดตอบผมด้วย  ถ้าไม่มีการตอบรับ ใครก็ได้ไปตามมาตอบกระผมที" }]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    // ดู error ได้ที่ Logs ใน Netlify
    return { statusCode: res.status, body: text };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}
