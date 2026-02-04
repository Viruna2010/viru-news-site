const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // හිරු නිවුස් RSS එකෙන් පුවත් ලබා ගැනීම
        const response = await axios.get('https://www.hirunews.lk/rss/sinhala.xml');
        const xmlData = response.data;

        // RSS එකෙන් පුවත් සිරස්තල වෙන් කර ගැනීම
        const newsItems = xmlData.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)
            .map(item => item.replace('<title><![CDATA[', '').replace(']]></title>', ''))
            .slice(1, 11); 

        // HTML & CSS පෙනුම
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Viru News Live</title>
            <style>
                body { 
                    margin: 0; padding: 0; 
                    background: #000 url('https://images.unsplash.com/photo-1504711432869-7155d6b47c0b?q=80&w=1920') no-repeat center center; 
                    background-size: cover;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    overflow: hidden; color: white;
                }
                .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,50,0.5); z-index: 1; }
                .content { z-index: 2; width: 85%; text-align: center; }
                .header { 
                    font-size: 60px; font-weight: 900; color: #ffcc00; 
                    text-transform: uppercase; letter-spacing: 5px; margin-bottom: 50px;
                    border-bottom: 6px solid #ff0000; display: inline-block; padding-bottom: 10px;
                }
                .news-box { height: 250px; display: flex; justify-content: center; align-items: center; }
                .news-item { font-size: 45px; line-height: 1.4; display: none; text-shadow: 4px 4px 15px rgba(0,0,0,0.8); font-weight: bold; }
                .active { display: block; animation: slideIn 0.8s ease-out; }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .footer { position: absolute; bottom: 30px; font-size: 20px; color: #ccc; z-index: 2; }
            </style>
        </head>
        <body>
            <div class="overlay"></div>
            <div class="header">VIRU NEWS UPDATE</div>
            <div class="content">
                <div class="news-box">
                    ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
                </div>
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's First Automated Live Stream</div>

            <audio id="bgMusic" loop>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3">
            </audio>

            <script>
                // Audio ප්ලේ වෙන්න Screen එකට කොහේ හරි Click කරන්න ඕනේ (Browser Security)
                window.onclick = () => { document.getElementById('bgMusic').play(); };
                
                const items = document.querySelectorAll('.news-item');
                let current = 0;
                
                setInterval(() => {
                    items[current].classList.remove('active');
                    current = (current + 1) % items.length;
                    items[current].classList.add('active');
                }, 8000); // තත්පර 8ක් එක පුවතක් පෙන්වයි
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (e) {
        res.status(500).send("Error fetching news: " + e.message);
    }
};
