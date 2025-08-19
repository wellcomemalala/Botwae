const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const GROUP_ID = process.env.GROUP_ID; // ใส่หลังจากได้จากคำสั่ง 'id'
const MESSAGE_TEXT = process.env.MESSAGE_TEXT || 'วันนี้ใช้น้ำมันไปกี่ถุงจ๊ะ';

exports.handler = async () => {
  if (!GROUP_ID) {
    return { statusCode: 200, body: 'NO_GROUP_ID' };
  }

  try {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        to: GROUP_ID,
        messages: [{ type: 'text', text: MESSAGE_TEXT }],
      }),
    });

    const text = await res.text();
    // คืน 200 ให้ Netlify เสมอ เพื่อไม่ให้แจ้งล้มเหลว แต่เก็บสถานะไว้ใน body
    return { statusCode: 200, body: `PUSH ${res.status}: ${text}` };
  } catch (err) {
    return { statusCode: 200, body: 'ERROR ' + (err?.message || String(err)) };
  }
};
