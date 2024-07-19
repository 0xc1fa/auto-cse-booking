import { chromium } from "playwright";
import dotenv from "dotenv";
import { CSEFormFiller, PersonalInfo } from "./CSEFormFiller";

dotenv.config();
const pageUrl = "https://fcbooking.cse.hku.hk/Form/SignUp";
const recaptchaSiteKey = "6Lf676AUAAAAAKNDRHuFKbmIAc4-u01jjj3nHMoc";

const personalInfo: PersonalInfo = {
	email: "testing@connect.hku.hk",
	name: "test",
	uid: "3035990000",
};

async function main() {
	const browser = await chromium.launch({
		headless: false,
		slowMo: 10,
	});
	const page = await browser.newPage();

	await page.goto(pageUrl);

	let date = new Date();
	date.setDate(date.getDate() + 3);

	const formFiller = new CSEFormFiller(page);
	await formFiller.fillAll({
		...personalInfo,
		center: "b-active",
		date: date,
		session: 0,
	});
	await formFiller.solveRecaptcha(
		process.env.TWOCAPTCHA_API_KEY!,
		pageUrl,
		recaptchaSiteKey
	);
	await formFiller.clickSubmit();
}

main();
