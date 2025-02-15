import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { setTimeout } from 'node:timers/promises';
import fs from 'fs';
import path from 'path';

// Add stealth and adblocker plugins
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Get the current directory path in ES module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Decode the path (remove URL encoding)
const folderPath = path.join(__dirname, 'AnimeVideo');

// Ensure the directory exists (with recursive flag)
try {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log('Folder "AnimeVideo" created successfully!');
    } else {
        console.log('Folder "AnimeVideo" already exists.');
    }
} catch (error) {
    console.error('Error creating folder:', error);
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // Running script in non-headless mode
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--disable-dev-shm-usage",
            "--disable-web-security",
        ]
    });

    const page = await browser.newPage();

    // Set user agent to mimic a real browser
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

    // Store captured .m3u8 URLs
    const m3u8Urls = [];

    await page.setRequestInterception(true);
    page.on('request', (request) => {
        request.continue(); // Continue the request without blocking

        // Check if the request URL contains .m3u8
        if (request.url().includes('.m3u8')) {
            console.log('Found m3u8 URL:', request.url());
            m3u8Urls.push(request.url());
        }
    });

    // Static URL to visit
    const url = "https://gogoanime.org.vc/index.php/2025/02/10/theatre-of-darkness-yamishibai-14-episode-6/";
    console.log("Opening:", url);
    await page.goto(url, { waitUntil: "networkidle2" });

    console.log("Waiting for 7 seconds...");
    await setTimeout(7000);
    await page.mouse.move(200, 300);
    await page.keyboard.press("ArrowDown");
    console.log("Waiting for 2 seconds...");
    await setTimeout(2000);

    console.log("Page Loaded Successfully!");

    console.log("Captured .m3u8 URLs:", m3u8Urls);

    if (m3u8Urls.length > 0) {
        // Find a URL that ends with 'index-<alphanumeric>-v1-a1.m3u8' and exclude 'master.m3u8'
        const m3u8Url = m3u8Urls.find(url => {
            return url.match(/index-[\w-]+-v1-a1\.m3u8$/) && !url.includes('master.m3u8');
        });
    
        if (m3u8Url) {
            console.log("\n==============================================");
            console.log("Open the following link in your browser or media player:");
            console.log(m3u8Url);
            console.log("==============================================\n");
    
            // Optionally, open the link in the default browser
            const open = await import('open'); // Dynamic import for ES modules
            await open.default(m3u8Url);
        } else {
            console.log("No matching .m3u8 URL found that ends with 'index-<alphanumeric>-v1-a1.m3u8' and is not 'master.m3u8'.");
        }
    } else {
        console.log("No .m3u8 URLs found.");
    }
    
    

    await browser.close();
})();
