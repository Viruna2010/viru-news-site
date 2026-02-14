const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const apiUrl = 'https://esena-news-api-v3.vercel.app/news/trending';

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <meta name="robots" content="noindex, nofollow, noarchive">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #050505; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                }

                .bg-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: radial-gradient(circle at 50% 50%, #1a0505 0%, #000 100%);
                    z-index: -1;
                }

                .header { position: absolute; top: 30px; text-align: center; }
                .viru-logo { 
                    font-size: 65px; font-weight: 900; color: #fff;
                    letter-spacing: 12px; text-shadow: 4px 4px 0px #e60000;
                }

                .live-indicator {
                    background: #e60000; color: white; padding: 5px 15px;
                    font-size: 16px; font-weight: 900; border-radius: 4px;
                    display: flex; align-items: center; gap: 8px; margin-top: 10px;
                }

                .dot { width: 10px; height: 10px; background: white; border-radius: 50%; animation: blink 0.8s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                .news-box {
                    width: 85%; max-width: 1200px; text-align: center;
                    padding: 40px; border-top: 3px solid #ffcc00; border-bottom: 3px solid #ffcc00;
                    position: relative;
                }

                .headline { 
                    font-size: 48px; color: #ffffff; font-weight: 800;
                    line-height: 1.5; transition: all 0.7s ease; opacity: 0;
                }

                .active { opacity: 1; }

                .footer {
                    position: absolute; bottom: 0; width: 100%;
                    background: #e60000; color: white; padding: 15px 0;
                    font-weight: 900; font-size: 20px; text-align: center;
                    border-top: 4px solid #ffcc00;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            <div class="bg-overlay"></div>
            <div class="header">
                <div class="viru-logo">VIRU TV</div>
                <div class="live-indicator"><div class="dot"></div> සජීවී තොරතුරු සේවාව</div>
            </div>

            <div class="news-box">
                <div class="headline" id="title-display">තොරතුරු පූරණය වෙමින් පවතී...</div>
            </div>

            <div class="footer" id="footer-text">VIRU TV | 24/7 LIVE UPDATES</div>

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
                                // RISK PROTECTION: අකුරු අතරට නොපෙනෙන Space එකක් දාලා Bot ලගෙන් බේරෙනවා
                                let cleanTitle = n.titleSi.replace(/Esana|හෙළකුරු|Ada Derana|NewsFirst/gi, "").trim();
                                return cleanTitle.split('').join('\\u200B'); 
                            });
                            return true;
                        }
                    } catch (e) { console.error("API Connection Error"); }
                    return false;
                }

                function updateDisplay() {
                    if (newsData.length > 0) {
                        const titleEl = document.getElementById('title-display');
                        const footerEl = document.getElementById('footer-text');
                        const footers = ["VIRU TV | 24/7 සජීවී තොරතුරු", "VIRU TV | AUTOMATED NEWS SERVICE", "VIRU TV | LIVE STREAM"];

                        titleEl.classList.remove('active');
                        
                        setTimeout(() => {
                            titleEl.innerText = newsData[currentIndex];
                            footerEl.innerText = footers[Math.floor(Math.random() * footers.length)];
                            titleEl.classList.add('active');
                            currentIndex = (currentIndex + 1) % newsData.length;
                        }, 700);

                        // තත්පර 7 ත් 10 ත් අතර රෑන්ඩම් වෙලාවක ඊළඟ නිව්ස් එකට යනවා
                        let randomTime = Math.floor(Math.random() * (10000 - 7000 + 1)) + 7000;
                        setTimeout(updateDisplay, randomTime);
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        updateDisplay();
                    } else {
                        setTimeout(init, 5000);
                    }
                }

                init();
                setInterval(fetchNews, 600000); // විනාඩි 10න් 10ට API Update
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("Security Error");
    }
};
