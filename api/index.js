const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // Google News RSS feed - Sri Lanka Sinhala
        const url = 'https://news.google.com/rss/headlines/section/topic/NATION?hl=si&gl=LK&ceid=LK:si';
        
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        
        const data = response.data;
        
        // අකුරු වෙන් කරන අලුත්ම සරල ක්‍රමය
        const newsItems = [];
        const rawItems = data.split('<item>');

        for (let i = 1; i < rawItems.length && newsItems.length < 10; i++) {
            let titlePart = rawItems[i].split('<title>')[1];
            if (titlePart) {
                let title = titlePart.split('</title>')[0];
                title = title.replace('<![CDATA[', '').replace(']]>', '').split(' - ')[0].trim();
                newsItems.push(title);
            }
        }

        // පුවත් නැති වුණොත් පෙන්වන backup පණිවිඩයක්
        if (newsItems.length === 0) {
            newsItems.push("අද දවසේ පුවත් සාරාංශය ඉක්මනින් බලාපොරොත්තු වන්න...");
            newsItems.push("විරු TV සමග දිගටම රැඳී සිටින්න...");
        }

        const html = `
        <!DOCTYPE html>
        <html lang="si">
        <head>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@700&display=swap');
                body { 
                    margin: 0; padding: 0; background: #000;
                    background-image: radial-gradient(circle, #001f3f, #000);
                    font-family: 'Noto Sans Sinhala', sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    color: white; overflow: hidden;
                }
                .header { font-size: 50px; color: #ffcc00; border-bottom: 5px solid red; margin-bottom: 40px; text-shadow: 2px 2px 10px black; }
                .news-box { width: 85%; height: 250px; text-align: center; display: flex; align-items: center; justify-content: center; }
                .news-item { font-size: 38px; line-height: 1.5; display: none; animation: fadeIn 0.8s; }
                .active { display: block; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .footer { position: absolute; bottom: 20px; font-size: 18px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="header">VIRU NEWS UPDATE</div>
            <div class="news-box" id="box">
                ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's Automated News</div>
            
            <audio id="bgMusic" loop autoplay>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                window.onclick = () => document.getElementById('bgMusic').play();
                const items = document.querySelectorAll('.news-item');
                let curr = 0;
                setInterval(() => {
                    items[curr].classList.remove('active');
                    curr = (curr + 1) % items.length;
                    items[curr].classList.add('active');
                }, 8000);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("System Error: " + e.message);
    }
};
