import { Solver } from "@2captcha/captcha-solver";
import { Page } from "playwright";
import { Info } from "./types/Info";
import { Center } from "./types/Center";

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
		await this.page.fill(selector, email);
		console.log(`Filled email: ${email}`);
	}

	async fillName(name: string) {
		const selector = `#FirstName`;
		await this.page.fill(selector, name);
		console.log(`Filled name: ${name}`);
	}

	async fillUid(uid: string) {
		const selector = `#MemberID`;
		await this.page.fill(selector, uid);
		console.log(`Filled UID: ${uid}`);
	}

	async fillCenter(centerId: Center) {
		const selector = `#CenterID`;
		try {
			switch (centerId) {
				case "cse-active":
					return this.page.selectOption(selector, "10001");
				case "b-active":
					return this.page.selectOption(selector, "10002");
				default:
					throw new Error("centerId not valid.");
			}
		} finally {
			console.log(`Filled center ID: ${centerId}`);
		}
	}

	async fillDate(date: Date) {
		const selector = `#DateList`;
		const formattedDate = new Intl.DateTimeFormat("zh-CN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(date);

		await this.page.selectOption(selector, formattedDate).catch(err => {
			throw new Error("Invalid date");
		});

		console.log(`Filled date: ${formattedDate}`);
	}

	async fillSession(session: number) {
		const selector = `#SessionTime`;
		await this.page.selectOption(selector, { index: session });
		console.log(`Filled session: ${session}`);
	}

	async checkDeclaration() {
		const selector = `#dataCollection`;
		await this.page.evaluate(selector => {
			const checkbox = document.querySelector(selector) as HTMLInputElement;
			if (!checkbox.checked) checkbox.click();
		}, selector);
		console.log(`Checked declaration`);
	}

	async solveRecaptcha(apiKey: string, pageUrl: string, siteKey: string) {
		console.log("Started solving reCAPTCHA")
		const solver = new Solver(apiKey);
		const res = await solver.recaptcha({
			pageurl: pageUrl,
			googlekey: siteKey,
		});

		await this.page.evaluate(res => {
			const responseElement = document.querySelector("#g-recaptcha-response");
			if (!responseElement) throw new Error("g-recaptcha-response not found");
			responseElement.innerHTML = res.data;
		}, res);

		console.log(`Solved reCAPTCHA: ${res.data}`);
	}

	async clickSubmit() {
		return this.page.click(`#sbmtBtn`);
	}
}
