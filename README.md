# CSE Booking Automation

CSE Booking is an automated script designed to book slots on the CSE HKU website. It uses Playwright for browser automation and 2Captcha for solving CAPTCHA challenges.
## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/0xc1fa/cse-booking.git
   cd cse-booking
   ```

2. Install dependencies using `pnpm`:

   ```sh
   npm install -g pnpm
   pnpm install
   ```

## Configuration

The configuration for booking is located in `src/config.ts`. Modify the fields according to your needs:
```ts
const bookingConfig: BookingConfig = {
  name: "your_name",
  email: "your_email",
  uid: "your_uid",
  center: "your_preferred_center",
  session: 0, // 0, 1, or 2 for different session times
  omit: [0, 1, 6], // Days to omit: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
} as const;

export default bookingConfig;
```

## Usage

The script is intended to run as a scheduled job on GitHub Actions. The GitHub Actions workflow is already configured to run the booking script daily at 04:05 AM UTC (12:05 PM HKT).

## Steps to Enable GitHub Actions

1. Push your configuration to GitHub:
   Ensure your changes in `src/config.ts` are committed and pushed to your GitHub repository.
2. Set up secrets:
   In your GitHub repository, navigate to Settings > Secrets and variables > Actions, and add a new repository secret:
   - `TWOCAPTCHA_API_KEY`: Your 2Captcha API key.
3. Ensure the environment is named "production":
   The GitHub Actions workflow uses the environment named "production".

Once these steps are completed, the GitHub Actions workflow will automatically run the booking script based on the defined schedule.
