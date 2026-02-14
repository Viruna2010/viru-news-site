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
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; overflow: hidden;
                }

                .bg-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(180deg, #0d0d0d 0%, #000 100%);
                    z-index: -1;
                }

                /* Header */
                .header { position: absolute; top: 40px; text-align: center; }
                .viru-logo { 
                    font-size: 70px; font-weight: 900; color: #fff;
                    letter-spacing: 15px; text-shadow: 0 0 20px #e60000;
                }
                .live-indicator {
                    background: #e60000; color: white; padding: 6px 18px;
                    font-size: 18px; font-weight: 900; border-radius: 5px;
                    display: inline-flex; align-items: center; gap: 10px; margin-top: 15px;
                }
                .dot { width: 12px; height: 12px; background: #fff; border-radius: 50%; animation: pulse 1s infinite; }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.2; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }

                /* News Box */
                .news-box {
                    width: 90%; max-width: 1200px; text-align: center;
                    padding: 60px; border-left: 10px solid #e60000;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 0 30px 30px 0; box-shadow: -10px 0 30px rgba(230, 0, 0, 0.1);
                }

                .headline { 
                    font-size: 55px; color: #ffcc00; font-weight: 900;
                    line-height: 1.4; transition: opacity 0.8s ease;
                    text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
                }

                /* Footer */
                .footer {
                    position: absolute; bottom: 0; width: 100%;
                    background: #e60000; color: #fff; padding: 18px 0;
                    font-weight: 900; font-size: 24px; text-align: center;
                    letter-spacing: 2px; border-top: 5px solid #ffcc00;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            <div class="bg-overlay"></div>
            <div class="header">
                <div class="viru-logo">VIRU TV</div>
                <div class="live-indicator"><div class="dot"></div> LIVE UPDATES</div>
            </div>

            <div class="news-box">
                <div class="headline" id="title-display">සම්බන්ධ වෙමින් පවතී...</div>
            </div>

            <div class="footer">STAY TUNED WITH VIRU TV | AUTOMATED INFO SERVICE</div>

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
                                // මෙතනදී තමයි රිස්ක් එක නැති කරන්නේ
                                return n.titleSi.replace(/Esana|හෙළකුරු|Ada Derana/gi, "").trim();
                            });
                            return true;
                        }
                    } catch (e) { console.error("Update Error"); }
                    return false;
                }

                function updateDisplay() {
                    if (newsData.length > 0) {
                        const titleEl = document.getElementById('title-display');
                        titleEl.style.opacity = 0;
                        
                        setTimeout(() => {
                            titleEl.innerText = newsData[currentIndex];
                            titleEl.style.opacity = 1;
                            currentIndex = (currentIndex + 1) % newsData.length;
                        }, 800);
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        updateDisplay();
                        setInterval(updateDisplay, 8000); // 8 Seconds
                    } else {
                        setTimeout(init, 5000);
                    }
                }

                init();
                setInterval(fetchNews, 300000); // විනාඩි 5න් 5ට අලුත් පුවත් බලනවා
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("System Securely Stopped.");
    }
};
