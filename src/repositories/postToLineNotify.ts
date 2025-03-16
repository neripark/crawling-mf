export const notifyToLine = async (message: string) => {
  return fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LINE_MESSAGING_API_CHANNEL_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: new URLSearchParams({
      message,
    }).toString(),
  });
};

// export const notifyToLine = async (message: string) => {
//   return fetch("https://notify-api.line.me/api/notify", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       message,
//     }).toString(),
//   });
// };
