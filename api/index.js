const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // හෙළකුරු ඇසණ Unofficial API එක
        const apiUrl = 'https://esena-news-api-v3.vercel.app/news/trending';

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Viru TV News Live</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap');
                
                body { 
                    margin: 0; padding: 0; 
                    background: #000;
                    background-image: radial-gradient(circle, #080808, #000);
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    color: white; overflow: hidden;
                }

                .header { 
                    font-size: 50px; color: #ffcc00; 
                    border-left: 15px solid #e60000; 
                    padding-left: 20px;
                    margin-bottom: 30px; 
                    text-shadow: 0 0 20px rgba(255, 204, 0, 0.4);
                    font-weight: 900;
                    letter-spacing: 2px;
                }

                .news-box { 
                    width: 90%; height: 400px; 
                    text-align: center; 
                    display: flex; align-items: center; justify-content: center; 
                    background: rgba(255, 255, 255, 0.05); 
                    border-radius: 30px; 
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    padding: 50px; box-sizing: border-box;
                    box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
                }

                .news-item { 
                    font-size: 42px; line-height: 1.5; 
                    text-shadow: 2px 2px 10px rgba(0,0,0,1); 
                    animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; 
                }

                @keyframes slideUp { 
                    0% { opacity: 0; transform: translateY(30px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }

                .footer { 
                    position: absolute; bottom: 40px; 
                    font-size: 24px; color: #fff; 
                    background: #e60000; 
                    padding: 8px 40px; border-radius: 5px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">VIRU TV NEWS FLASH</div>
            
            <div class="news-box" id="news-container">
                <div class="news-item">නවතම පුවත් පද්ධතියට එක්වෙමින් පවතී...</div>
            </div>

            <div class="footer">📡 ESENA NEWS | VIRU TV LIVE UPDATE</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                let newsList = [];
                let currentIndex = 0;
                const container = document.getElementById('news-container');

                async function fetchNews() {
                    try {
                        // අපිට RapidAPI Keys දැන් ඕන වෙන්නේ නැහැ
                        const response = await fetch('${apiUrl}');
                        const result = await response.json();
                        
                        // ඇසණ API එකේ දත්ත තියෙන්නේ result.news ඇතුලේ
                        if (result.status && result.news.length > 0) {
                            newsList = result.news.map(n => n.title);
                            return true;
                        }
                    } catch (error) {
                        console.error("News Fetch Error:", error);
                    }
                    return false;
                }

                function rotateNews() {
                    if (newsList.length > 0) {
                        container.innerHTML = "";
                        const div = document.createElement('div');
                        div.className = 'news-item';
                        div.innerText = newsList[currentIndex];
                        container.appendChild(div);
                        currentIndex = (currentIndex + 1) % newsList.length;
                    }
                }

                async function startSystem() {
                    const success = await fetchNews();
                    if (success) {
                        rotateNews();
                        setInterval(rotateNews, 10000); // තත්පර 10කින් නිවුස් මාරු වේ
                    } else {
                        setTimeout(startSystem, 5000);
                    }
                }

                startSystem();
                setInterval(fetchNews, 600000); // විනාඩි 10කට වරක් අලුත්ම නිවුස් ගනී

                window.onclick = () => document.getElementById('bgMusic').play();
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
