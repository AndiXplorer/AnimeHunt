import express from "express";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import { setTimeout } from "node:timers/promises";
import cors from "cors";

const app = express();
const PORT = 5000;

// Use puppeteer stealth and adblocker plugins
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Support JSON requests

app.post("/extract", async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, error: "Missing URL" });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "false", 
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--disable-web-security",
            ],
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );
        await page.setViewport({ width: 1366, height: 768 });
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(60000);

        const m3u8Urls = [];

        await page.setRequestInterception(true);
        page.on("request", (request) => {
            request.continue();
            if (request.url().includes(".m3u8")) {
                console.log("Found m3u8 URL:", request.url());
                m3u8Urls.push(request.url());
            }
        });

        console.log("Opening:", url);
        await page.goto(url, { waitUntil: "networkidle2" });

        console.log("Waiting for 2 seconds...");
        await setTimeout(2000);
        await page.mouse.move(200, 300);
        await page.keyboard.press("ArrowDown");
        console.log("Waiting for 2 seconds...");
        await setTimeout(2000);

        console.log("Page Loaded Successfully!");
        console.log("Captured .m3u8 URLs:", m3u8Urls);

        let m3u8Url = m3u8Urls.find((link) =>
            link.match(/index-[\w-]+-v1-a1\.m3u8$/) && !link.includes("master.m3u8")
        );

        if (!m3u8Url) {
            m3u8Url = m3u8Urls[0] || "Error extracting .m3u8 link.";
        }

        res.json({ success: true, m3u8: m3u8Url });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
