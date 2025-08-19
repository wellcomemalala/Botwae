// ใช้ ES Module import แทน require
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    // ข้อความที่จะแจ้งเตือน
    const message = "⏰ ถึงเวลา 16.00 น. แล้วนะครับ แวะถัวะ!";

    // เรียก API LINE Messaging
    const response = await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        messages: [
          {
            type: "text",
            text: message
          }
        ]
      })
    });

    // ตรวจสอบผลลัพธ์
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LINE API error: ${response.status} - ${errorText}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "ส่งข้อความเรียบร้อยแล้ว!" })
    };

  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
}
