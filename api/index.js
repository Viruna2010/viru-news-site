const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const apiUrl = 'https://esena-news-api-v3.vercel.app/news/trending';

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap');
                
                body { 
                    margin: 0; background: #000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    justify-content: flex-end; align-items: center; overflow: hidden;
                    background: linear-gradient(0deg, #001220 0%, #000 50%);
                }

                /* News Display Area */
                .news-window {
                    width: 95%; height: 50vh;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 20px 20px 0 0;
                    border: 3px solid #e60000;
                    border-bottom: none;
                    position: relative;
                    padding: 30px;
                    box-sizing: border-box;
                    overflow: hidden;
                }

                .headline-box {
                    color: #ffcc00; font-size: 45px;
                    font-weight: 900; text-align: center;
                    margin-bottom: 20px; text-shadow: 2px 2px 10px rgba(0,0,0,1);
                }

                /* Scrolling Animation */
                .scroll-container {
                    position: relative;
                    height: 250px; /* විස්තරය පෙනෙන උස */
                    overflow: hidden;
                }

                .content-scroll {
                    position: absolute;
                    width: 100%;
                    font-size: 32px;
                    line-height: 1.6;
                    text-align: center;
                    animation: smoothScroll 20s linear infinite; /* වේගය මෙතනින් වෙනස් කරන්න */
                }

                @keyframes smoothScroll {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(-120%); }
                }

                .live-indicator {
                    position: absolute; top: 30px; right: 40px;
                    display: flex; align-items: center; gap: 10px;
                }

                .dot { width: 15px; height: 15px; background: red; border-radius: 50%; animation: blink 1s infinite; }
                @keyframes blink { 50% { opacity: 0; } }

                .footer-ticker {
                    width: 100%; background: #e60000; color: white;
                    padding: 15px; font-size: 24px; font-weight: bold;
                    text-align: center; box-shadow: 0 -10px 30px rgba(230,0,0,0.3);
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            
            <div class="live-indicator">
                <div class="dot"></div>
                <span style="font-weight: bold; font-size: 20px;">SIRIUS LIVE</span>
            </div>

            <div class="news-window" id="news-window">
                <div class="headline-box" id="title-display">පද්ධතිය සූදානම් වෙමින් පවතී...</div>
                <div class="scroll-container">
                    <div class="content-scroll" id="content-display">
                        මඳක් රැඳී සිටින්න, අලුත්ම පුවත් දැන් ලැබෙනු ඇත.
                    </div>
                </div>
            </div>

            <div class="footer-ticker">📡 VIRU TV NEWS UPDATES | HELAKURU ESANA</div>

            <audio id="newsMusic" loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsData = [];
                let currentIndex = 0;

                async function fetchNews() {
                    try {
                        const response = await fetch('${apiUrl}');
                        const result = await response.json();
                        if (result.news_data && result.news_data.data) {
                            newsData = result.news_data.data.map(n => {
                                let bodyText = n.contentSi
                                    .filter(c => c.type === 'text')
                                    .map(c => c.data.replace(/<[^>]*>?/gm, ''))
                                    .join(' ');
                                return { title: n.titleSi, body: bodyText };
                            });
                            return true;
                        }
                    } catch (e) { console.error(e); }
                    return false;
                }

                function rotateNews() {
                    if (newsData.length > 0) {
                        const titleBox = document.getElementById('title-display');
                        const contentBox = document.getElementById('content-display');
                        const item = newsData[currentIndex];
                        
                        titleBox.innerText = item.title;
                        contentBox.innerText = item.body;
                        
                        // Animation එක Reset කරනවා අලුත් නිවුස් එකට
                        contentBox.style.animation = 'none';
                        contentBox.offsetHeight; /* Trigger reflow */
                        contentBox.style.animation = 'smoothScroll 20s linear infinite';

                        currentIndex = (currentIndex + 1) % newsData.length;
                    }
                }

                async function start() {
                    const ok = await fetchNews();
                    if (ok) {
                        rotateNews();
                        setInterval(rotateNews, 20000); // තත්පර 20න් 20ට නිවුස් මාරු වේ
                    } else {
                        setTimeout(start, 5000);
                    }
                }

                start();
                setInterval(fetchNews, 600000);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
};
