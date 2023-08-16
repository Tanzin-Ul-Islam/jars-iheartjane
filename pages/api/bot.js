// const bots = [
//     "Googlebot",
//     "Bingbot",
//     "Slurp",
//     "DuckDuckBot",
//     "Baiduspider",
//     "YandexBot",
//     "Sogou",
//     "Exabot",
//     "facebookexternalhit",
//     "facebot",
//     "ia_archiver",
// ];


// export default async function handler(req, res) {
//     const userAgent = req.headers['user-agent'];
//     const isBot = bots.some((bot) => userAgent.toLowerCase().includes(bot.toLowerCase()));
//     res.send(isBot);
// }


// /pages/api/bot.js
const bots = [
    "Googlebot",
    "Bingbot",
    "Slurp",
    "DuckDuckBot",
    "Baiduspider",
    "YandexBot",
    "Sogou",
    "Exabot",
    "facebookexternalhit",
    "facebot",
    "ia_archiver",
];

export default async function handler(req, res) {
    const userAgent = req.headers['user-agent'];
    const isBot = bots.some((bot) => userAgent.toLowerCase().includes(bot.toLowerCase()));
    res.json({ userAgent, isBot });
}
