const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const apiKey = 'pub_040b167098dc4ec797c94c3a60806ce8';
        const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=lk&language=si`;
        
        const response = await axios.get(url);
        let newsItems = [];

        if (response.data && response.data.results) {
            newsItems = response.data.results.map(n => {
                // සිරස්තලය කෙටි නම් විස්තරය (description) ගන්නවා, නැත්නම් title එකම ගන්නවා
                return n.description && n.description.length > n.title.length ? n.description : n.title;
            }).slice(0, 10);
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
                .header { font-size: 50px; color: #ffcc00; border-bottom: 6px solid red; margin-bottom: 30px; }
                .news-box { width: 90%; height: 400px; text-align: center; display: flex; align-items: center; justify-content: center; }
                .news-item { 
                    font-size: 35px; /* අකුරු ටිකක් කුඩා කළා විස්තරය දිග නිසා */
                    line-height: 1.6; display: none; text-shadow: 2px 2px 10px black; 
                    animation: fadeIn 1s; padding: 20px;
                }
                .active { display: block; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .footer { position: absolute; bottom: 30px; font-size: 20px; color: #ffcc00; }
            </style>
        </head>
        <body>
            <div class="header">VIRU TV NEWS</div>
            <div class="news-box">
                ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
            </div>
            <div class="footer">📡 Viru TV | Sri Lanka's Automated News System</div>
            <audio id="bgMusic" loop autoplay><source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3"></audio>
            <script>
                window.onclick = () => document.getElementById('bgMusic').play();
                const items = document.querySelectorAll('.news-item');
                let curr = 0;
                setInterval(() => {
                    if(items.length > 0) {
                        items[curr].classList.remove('active');
                        curr = (curr + 1) % items.length;
                        items[curr].classList.add('active');
                    }
                }, 10000); // විස්තරය කියවන්න කාලය මදි නිසා තත්පර 10ක් කළා
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("API Error: " + e.message);
    }
};
