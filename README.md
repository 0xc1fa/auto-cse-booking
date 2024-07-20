# CSE Booking Automation

CSE Booking is an automated script designed to reserve slots on the HKU CSE website.

## Enable Automation in Your Account

1. Fork this repository
   
   Navigate to the original repository [0xc1fa/auto-cse-booking](https://github.com/0xc1fa/auto-cse-booking) and click the "Fork" button in the top-right corner of the page.

2. Set up GitHub repository secrets
   
   In your forked repository, navigate to Settings > Secrets and variables (under Security) > Actions, and add a new repository secret:
   
   - `TWOCAPTCHA_API_KEY`: Your 2Captcha API key, obtainable from [2Captcha](https://2captcha.com).

3. Clone your forked repository
   ```sh
   git clone https://github.com/<your-username>/auto-cse-booking.git
   cd auto-cse-booking
   ```

4. Configure the booking setting in `src/config.ts` according to your needs:
   ```ts
   const bookingConfig: BookingConfig = {
       name: "<your-name>",         // e.g. "Chan Tai Man"
       email: "<your-email>",       // e.g. "chantaiman@connect.hku.hk
       uid: "<your-uid>",           // e.g. "3035690000"
       center: "<center-to-book>",  // "cse-active" or "b-active"
       session: 0,                  // 0, 1, or 2
       omit: [0, 1, 6],             // Days to omit: 0=Sunday, 1=Monday, ...
   } as const;
   ```

5. Commit and push your configurations:
   ```sh
   git add src/config.ts
   git commit -m "Update configuration"
   git push origin main
   ```

6. Done. The GitHub Actions workflow is set to run the booking script daily at 12:05 PM HKT.

## Disable the Scheduled Job

To disable the scheduled job, go to Actions > Scheduled Job in your GitHub repository, click the three dots in the top-right corner, and select "Disable workflow."

To re-enable, click "Enable workflow" on the same page.

## Installation for Local Testing and Running

1. Install dependencies using `pnpm` (for local testing)

   ```sh
   npm install -g pnpm
   pnpm install
   ```

2. To disable headless mode for testing, edit `src/index.ts`.
   ```ts
   const browser = await chromium.launch({
     slowMo: 10,
     headless: false,
   });
   ```

3. Start the automation
   ```sh
   pnpm start
   ```
