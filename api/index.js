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
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');
                
                body { 
                    margin: 0; background: #000; color: white;
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    align-items: center; overflow: hidden;
                    background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
                }

                /* Logo Section */
                .header-container {
                    margin-top: 40px; text-align: center;
                }

                .viru-logo {
                    font-size: 50px; font-weight: 900; color: #ffcc00;
                    letter-spacing: 4px; text-shadow: 0 0 20px rgba(255, 204, 0, 0.3);
                }

                .live-label {
                    background: #e60000; padding: 5px 15px; border-radius: 4px;
                    font-size: 16px; font-weight: bold; vertical-align: middle; margin-left: 10px;
                    animation: blink 1.2s infinite;
                }

                @keyframes blink { 50% { opacity: 0.4; } }

                /* News Card Section */
                .news-card {
                    width: 80%; max-width: 900px; height: 450px;
                    margin-top: 50px; background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 25px; padding: 40px;
                    display: flex; flex-direction: column; justify-content: flex-start;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                    backdrop-filter: blur(10px);
                }

                .headline { 
                    font-size: 38px; color: #ffcc00; font-weight: 700;
                    margin-bottom: 25px; line-height: 1.3; text-align: left;
                    border-left: 8px solid #e60000; padding-left: 20px;
                }

                .content-area {
                    overflow: hidden; flex-grow: 1; position: relative;
                }

                .body-text { 
                    font-size: 24px; line-height: 1.8; color: #e0e0e0;
                    text-align: justify; font-weight: 400;
                    animation: slideUp 1s ease-out;
                }

                @keyframes slideUp { 
                    from { opacity: 0; transform: translateY(20px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }

                .footer-strip {
                    position: fixed; bottom: 0; width: 100%;
                    background: rgba(230, 0, 0, 0.8); padding: 12px;
                    font-size: 18px; text-align: center; color: white;
                }
            </style>
        </head>
        <body onclick="document.getElementById('newsMusic').play()">
            
            <div class="header-container">
                <span class="viru-logo">VIRU TV</span> <span class="live-label">LIVE</span>
            </div>

            <div class="news-card">
                <div class="headline" id="title-display">පුවත් පද්ධතිය සූදානම් වේ...</div>
                <div class="content-area">
                    <div class="body-text" id="content-display">
                        අලුත්ම පුවත් විස්තර ස්වල්ප වේලාවකින් බලාපොරොත්තු වන්න.
                    </div>
                </div>
            </div>

            <div class="footer-strip">📡 පුවත් මූලාශ්‍රය: HELAKURU ESANA | සජීවී පුවත් විකාශය</div>

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

                function updateDisplay() {
                    if (newsData.length > 0) {
                        const titleEl = document.getElementById('title-display');
                        const contentEl = document.getElementById('content-display');
                        
                        const item = newsData[currentIndex];
                        titleEl.innerText = item.title;
                        
                        // මෙතනදී අපි අකුරු ප්‍රමාණය පාලනය කරනවා කොටුව ඇතුළේ ඉතිරි වෙන්න
                        contentEl.innerText = item.body.length > 600 ? item.body.substring(0, 600) + "..." : item.body;

                        currentIndex = (currentIndex + 1) % newsData.length;
                    }
                }

                async function init() {
                    const ok = await fetchNews();
                    if (ok) {
                        updateDisplay();
                        setInterval(updateDisplay, 15000); // තත්පර 15කින් නිවුස් මාරු වේ
                    } else {
                        setTimeout(init, 5000);
                    }
                }

                init();
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
