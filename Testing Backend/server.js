import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { setTimeout } from 'node:timers/promises';
import express from 'express';

// adblocker ni plugin edhe stealth per me menjaju botin qaty
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const app = express();
app.use(express.json())
const port = 3000;

//post method
app.post('/extract', async(req,res) =>{
    const { url } = req.body;

    (async () => {
        const browser = await puppeteer.launch({
            headless: true, // Running script qetu
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--disable-web-security",
            ]
        });
    
        const page = await browser.newPage();
    
        // Kishe po hapet prej ni real browseri do t'dhana
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );
        await page.setViewport({ width: 1366, height: 768 });
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(60000);
    
        // Intercept Cloudflare challenge (if any)
        page.on("dialog", async (dialog) => {
            console.log("Closing Cloudflare pop-up...");
            await dialog.dismiss();
        });
    
        // mi bo store t'dhanat ++ 
        const result = [];
    
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue(); // Continue the request without blocking
    
            // kushti a egziston qeky file nese po dergoje.
            if (request.url().includes('.m3u8')) {
                console.log('Found m3u8 URL:', request.url());
                result.push({
                    request_url: request.url(),
                    request_headers: request.headers(),
                    request_post_data: request.postData()
                });
            }
        });
    
        // Linku statik
        const url = "https://gogoanime.org.vc/index.php/2025/02/08/solo-leveling-season-2-arise-from-the-shadow-episode-6/";
        console.log("Opening:", url);
        await page.goto(url, { waitUntil: "networkidle2" });
    
        
        console.log("Waiting for 5 seconds...");
        await setTimeout(5000); 
        await page.mouse.move(200, 300);
        await page.keyboard.press("ArrowDown");
        console.log("Waiting for 2 seconds...");
        await setTimeout(2000);  
    
        console.log("Page Loaded Successfully!");
    
        
        console.log("Captured Network Traffic:", result);
    
      
        await browser.close();

        res.json(result);
})().catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

