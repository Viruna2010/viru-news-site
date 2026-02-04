const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // අපි Google News එකෙන් ලංකාවේ ඉංග්‍රීසි පුවත් ගන්නවා (මේවා තමයි විස්තරාත්මකව තියෙන්නේ)
        const apiKey = 'pub_040b167098dc4ec797c94c3a60806ce8';
        const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=lk&language=en`;
        
        const response = await axios.get(url);
        let newsItems = [];

        if (response.data && response.data.results) {
            newsItems = response.data.results.map(n => n.title).slice(0, 10);
        }

        const html = `
        <!DOCTYPE html>
        <html lang="en">
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
                /* Google Translate Bar එක හංගන්න */
                .goog-te-banner-frame.skiptranslate, .goog-te-gadget { display: none !important; }
                body { top: 0px !important; }

                .header { font-size: 50px; color: #ffcc00; border-bottom: 6px solid red; margin-bottom: 30px; }
                .news-box { width: 90%; height: 300px; text-align: center; display: flex; align-items: center; justify-content: center; }
                .news-item { font-size: 45px; line-height: 1.4; display: none; text-shadow: 2px 2px 10px black; animation: fadeIn 1s; }
                .active { display: block; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .footer { position: absolute; bottom: 30px; font-size: 20px; color: #ffcc00; }
            </style>
        </head>
        <body>
            <div id="google_translate_element"></div>
            <div class="header">VIRU TV LIVE NEWS</div>
            <div class="news-box">
                ${newsItems.map((n, i) => `<div class="news-item ${i === 0 ? 'active' : ''}">${n}</div>`).join('')}
            </div>
            <div class="footer">📡 Auto-Translated from English | Viru TV News</div>

            <audio id="bgMusic" loop autoplay><source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mp3"></audio>

            <script type="text/javascript">
                function googleTranslateElementInit() {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en', 
                        includedLanguages: 'si', 
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE, 
                        autoDisplay: true
                    }, 'google_translate_element');
                    
                    // තත්පර 2කින් ඉබේම සිංහලට හරවන්න
                    setTimeout(() => {
                        var select = document.querySelector('select.goog-te-combo');
                        if(select) {
                            select.value = 'si';
                            select.dispatchEvent(new Event('change'));
                        }
                    }, 2000);
                }
            </script>
            <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

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
                }, 8000);
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        res.status(500).send("Translation Engine Error: " + e.message);
    }
};
