import { chromium } from "playwright";
import dotenv from "dotenv";
import { CSEFormFiller } from "./CSEFormFiller";

dotenv.config();
const pageUrl = "https://fcbooking.cse.hku.hk/Form/SignUp";
const recaptchaSiteKey = "6Lf676AUAAAAAKNDRHuFKbmIAc4-u01jjj3nHMoc";

async function main() {
	const browser = await chromium.launch({
		headless: false,
		slowMo: 10,
	});
	const page = await browser.newPage();

	await page.goto(pageUrl);

	const formFiller = new CSEFormFiller(page);
	await formFiller.fillAll({
		email: "testing@connect.hku.hk",
		name: "test",
		uid: "3035990000",
		center: "cse-active",
		date: new Date("2024/07/22"),
		session: "10124",
	});
	await formFiller.solveRecaptcha(
		process.env.TWOCAPTCHA_API_KEY!,
		pageUrl,
		recaptchaSiteKey
	);
	await formFiller.clickSubmit();
}

main();
