const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

exports.handler = async (event) => {
  // ให้ LINE verify ผ่านแม้ยิง GET มาทดสอบ
  if (event.httpMethod !== 'POST') {
    return { statusCode: 200, body: 'OK' };
  }

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch (_) {}

  const events = Array.isArray(body.events) ? body.events : [];

  const jobs = events.map(async (ev) => {
    if (ev.type === 'message' && ev.message?.type === 'text') {
      const text = (ev.message.text || '').trim().toLowerCase();

      // พิมพ์ "id" เพื่อดู groupId
      if (text === 'id') {
        const gid = ev.source?.groupId || ev.source?.roomId || '';
        const replyText = gid
          ? `groupId ของกลุ่มนี้คือ:\n${gid}\n\nคัดลอกไปใส่ในค่า GROUP_ID ของ Netlify แล้วกด Redeploy`
          : 'ยังไม่ใช่ห้องแบบกลุ่ม/รูมครับ (ต้องเชิญบอทเข้ากลุ่มก่อน)';

        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            replyToken: ev.replyToken,
            messages: [{ type: 'text', text: replyText }],
          }),
        });
      }
    }
  });

  try { await Promise.all(jobs); } catch (_) {}

  // สำคัญ: ตอบ 200 ให้ LINE เสมอ → Verify ผ่าน
  return { statusCode: 200, body: 'OK' };
};
