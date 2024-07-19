import { chromium, Page } from "playwright";

async function main() {
	const browser = await chromium.launch({ headless: false, slowMo: 100 });
	const page = await browser.newPage();

	const formFiller = new CSEFormFiller(page);

	await formFiller.gotoPage();
	await formFiller.fillAll({
		email: "testing@connect.hku.hk",
		name: "test",
		uid: "3035990000",
		center: "cse-active",
		date: "2024/07/22",
		session: "10124",
	});
}

type Year = `${number}${number}${number}${number}`;
type Month = `0${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`;
type Day =
	| `0${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
	| `${1 | 2}${number}`
	| `3${0 | 1}`;
type DateString = `${Year}/${Month}/${Day}`;
type Center = "cse-active" | "b-active";
type Info = {
	email: string;
	name: string;
	uid: string;
	center: Center;
	date: DateString;
	session: string;
};

class CSEFormFiller {
	private page: Page;
	readonly pageUrl = "https://fcbooking.cse.hku.hk/Form/SignUp";
	readonly recaptchaSiteKey = "6Lf676AUAAAAAKNDRHuFKbmIAc4-u01jjj3nHMoc";

	constructor(page: Page) {
		this.page = page;
	}

	gotoPage() {
		return this.page.goto(this.pageUrl);
	}

	async fillAll(items: Info) {
		await this.fillEmail(items.email);
		await this.fillName(items.name);
		await this.fillUid(items.uid);
		await this.fillCenter(items.center);
		await this.fillDate(items.date);
		await this.checkDeclaration();
		await this.clickRecaptcha();
	}

	async fillEmail(email: string) {
		const selector = `#Email`;
		return this.page.fill(selector, email);
	}

	async fillName(name: string) {
		const selector = `#FirstName`;
		return this.page.fill(selector, name);
	}

	async fillUid(uid: string) {
		const selector = `#MemberID`;
		return this.page.fill(selector, uid);
	}

	async fillCenter(centerId: Center) {
		const selector = `#CenterID`;
		switch (centerId) {
			case "cse-active":
				return this.page.selectOption(selector, "10001");
			case "b-active":
				return this.page.selectOption(selector, "10002");
			default:
				throw new Error("centerId not valid.");
		}
	}

	async fillDate(date: DateString) {
		const selector = `#DateList`;
		return this.page.selectOption(selector, date).catch(err => {
			throw new Error("Invalid Date");
		});
	}

	async fillSession(session: string) {
		const selector = `#SessionTime`;
		return this.page.selectOption(selector, session);
	}

	async checkDeclaration() {
		const selector = `#dataCollection`;

		await this.page.evaluate(() => {
			const checkbox = document.querySelector(
				`#dataCollection`
			) as HTMLInputElement;
			if (!checkbox.checked) checkbox.click();
		});
	}

	async clickRecaptcha() {
		const iframeElement = await this.page.$(`iframe[title="reCAPTCHA"]`);
		const iframe = await iframeElement?.contentFrame();
		await iframe?.click(`#rc-anchor-container`);
	}
}

main();
