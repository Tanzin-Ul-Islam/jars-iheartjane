
export default function checkBot() {
    try {

        if (typeof navigator !== "undefined") {
            const userAgent = navigator.userAgent;
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
            const botDetected = bots.some((bot) => userAgent.includes(bot));
            // console.log('botdeted', userAgent);
            // console.log('botDetected', botDetected);

            if (botDetected) {
                return true;
            } else {
                return false
            }
        }

        
    } catch (error) {
        console.log(error);
        return { error: "An error occurred while making the request." };
    }
}

