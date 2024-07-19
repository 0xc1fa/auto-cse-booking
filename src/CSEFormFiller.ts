import { Solver } from "@2captcha/captcha-solver";
import { Page } from "playwright";

export type Center = "cse-active" | "b-active";
export type Info = {
	email: string;
	name: string;
	uid: string;
	center: Center;
	date: Date;
	session: string;
};

export class CSEFormFiller {
	private page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async fillAll(items: Info) {
		await this.fillEmail(items.email);
		await this.fillName(items.name);
		await this.fillUid(items.uid);
		await this.fillCenter(items.center);
		await this.fillDate(items.date);
		await this.checkDeclaration();
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

	async fillDate(date: Date) {
		const selector = `#DateList`;
		const formattedDate = new Intl.DateTimeFormat("zh-CN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(date);

		return this.page.selectOption(selector, formattedDate).catch(err => {
			throw new Error("Invalid Date");
		});
	}

	async fillSession(session: string) {
		const selector = `#SessionTime`;
		return this.page.selectOption(selector, session);
	}

	async checkDeclaration() {
		const selector = `#dataCollection`;
		return this.page.evaluate(selector => {
			const checkbox = document.querySelector(selector) as HTMLInputElement;
			if (!checkbox.checked) checkbox.click();
		}, selector);
	}

	async solveRecaptcha(apiKey: string, pageUrl: string, siteKey: string) {
		const solver = new Solver(apiKey);
		const res = await solver.recaptcha({
			pageurl: pageUrl,
			googlekey: siteKey,
		});

		return this.page.evaluate(res => {
			const responseElement = document.querySelector("#g-recaptcha-response");
			if (!responseElement) throw new Error("g-recaptcha-response not found");
			responseElement.innerHTML = res.data;
		}, res);
	}

	async clickSubmit() {
		return this.page.click(`#sbmtBtn`);
	}
}
