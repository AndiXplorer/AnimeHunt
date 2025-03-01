import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cors from 'cors';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { setTimeout } from 'node:timers/promises';
import express from 'express';

// adblocker ni plugin edhe stealth per me menjaju botin qaty
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;

// POST method
app.post('/extract', async (req, res) => {
    const { url } = req.body; // Accept the URL dynamically from the POST request

    if (!url) {
        return res.status(400).json({ error: "URL is required" }); // Return an error if no URL is provided
    }

    (async () => {
        const browser = await puppeteer.launch({
            headless: false, // Running script qetu
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

        // Store data
        const result = [];

        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue(); // Continue the request without blocking

            // Check if the request contains .m3u8
            if (request.url().includes('.m3u8')) {
                console.log('Found m3u8 URL:', request.url());
                result.push({
                    request_url: request.url(),
                    request_headers: request.headers(),
                    request_post_data: request.postData()
                });
            }
        });

        // Open the URL received in the POST request
        await page.goto(url, { waitUntil: "networkidle2" });
        await page.mouse.move(200, 300);
        await page.keyboard.press("ArrowDown");

        await browser.close();

        res.json(result);
    })().catch(error => {
        console.error("Error:", error);
        res.status(500).json({ error: "Hmm, that URL doesn't seem to be working. Please double-check and try again." });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
