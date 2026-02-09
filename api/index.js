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
                    justify-content: center; align-items: center; overflow: hidden;
                    background-image: linear-gradient(to bottom, #001f3f, #000);
                }

                .header { 
                    font-size: 45px; color: #ffcc00; margin-bottom: 20px;
                    border-bottom: 5px solid #e60000; padding-bottom: 10px;
                    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
                }

                .news-box { 
                    width: 85%; height: 350px; background: rgba(0,0,0,0.6);
                    border: 2px solid #e60000;
                    border-radius: 20px; display: flex; align-items: center;
                    justify-content: center; padding: 40px; text-align: center;
                    box-shadow: 0 0 30px rgba(230, 0, 0, 0.2);
                }

                .news-item { 
                    font-size: 35px; line-height: 1.4;
                    animation: slideIn 0.8s ease-out;
                }

                @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .footer { margin-top: 30px; font-size: 20px; color: #ffcc00; font-weight: bold; }
            </style>
        </head>
        <body onclick="playAudio()">
            <div class="header">VIRU TV NEWS UPDATE</div>
            <div class="news-box" id="news-container">
                <div class="news-item">පුවත් පද්ධතිය හා සම්බන්ධ වෙමින්...</div>
            </div>
            <div class="footer">📡 SOURCE: HELAKURU ESANA | VIRU TV LIVE</div>

            <audio id="newsMusic" loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsList = [];
                let currentIndex = 0;
                const audio = document.getElementById('newsMusic');

                // Browser එකේ බ්ලොක් එක මග හරින්න ක්ලික් එකක් ගමු
                function playAudio() {
                    audio.play();
                }

                // ඔටෝම ප්ලේ කරන්නත් ට්‍රයි එකක් දෙමු
                window.onload = () => {
                    audio.volume = 0.5;
                    audio.play().catch(() => {
                        console.log("Browser blocked autoplay. Click anywhere to play sound.");
                    });
                };

                async function fetchNews() {
                    try {
                        const response = await fetch('${apiUrl}');
                        const result = await response.json();
                        if (result.news_data && result.news_data.data) {
                            newsList = result.news_data.data.map(n => n.titleSi);
                            return true;
                        }
                    } catch (e) { console.log(e); }
                    return false;
                }

                function showNextNews() {
                    if (newsList.length > 0) {
                        const container = document.getElementById('news-container');
                        container.innerHTML = '<div class="news-item">' + newsList[currentIndex] + '</div>';
                        currentIndex = (currentIndex + 1) % newsList.length;
                    }
                }

                async function start() {
                    const ok = await fetchNews();
                    if (ok) {
                        showNextNews();
                        setInterval(showNextNews, 10000);
                    } else {
                        setTimeout(start, 5000);
                    }
                }

                start();
                setInterval(fetchNews, 300000);
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
