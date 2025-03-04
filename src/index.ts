import { chromium } from "playwright";
import dotenv from "dotenv";
import { CSEFormFiller } from "./CSEFormFiller";
import bookingConfig from "./config";
import { pageUrl, recaptchaSiteKey } from "./constants";

dotenv.config();

async function main() {
	const browser = await chromium.launch({
		slowMo: 10,
	});
	const page = await browser.newPage();

	await page.goto(pageUrl);

	let date = new Date();
	date.setDate(date.getDate() + 3);

	if (
		bookingConfig.omit &&
		bookingConfig.omit.find(value => value === date.getDay())
	) {
		console.log("Weekday in `omit`, skipping today...");
		process.exit(0);
	}

	const formFiller = new CSEFormFiller(page);
	await formFiller.fillAll({
		...bookingConfig,
		date: date,
	});
	await formFiller.solveRecaptcha(
		process.env.TWOCAPTCHA_API_KEY!,
		pageUrl,
		recaptchaSiteKey
	);
	await formFiller.clickSubmit();

	browser.close();
	process.exit(0);
}

main();
