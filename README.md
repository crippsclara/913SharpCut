# 913 SharpCut Website

This is a complete static website that can be uploaded to GitHub Pages.

## Before publishing

1. Open `custom-order.html` and replace `YOUR-BUSINESS-EMAIL`.
2. Open `contact.html` and replace the email, Instagram username and service location.
3. Review prices in `js/app.js`. Sticker pack sample prices are:
   - 10: $12
   - 20: $20
   - 30: $27
   - 40: $34
   - 50: $40
4. Review the shipping, refund and privacy policies.
5. Test the site by opening `index.html`.

## Uploading to GitHub

- Unzip the folder.
- In your GitHub repository, choose **Add file → Upload files**.
- Drag every file and folder from inside this folder into GitHub.
- Commit to the `main` branch.
- Go to **Settings → Pages**.
- Choose **Deploy from a branch**, `main`, `/root`, then Save.

## Important limitations

- The cart works in the browser using localStorage.
- Checkout creates an order request on the same device.
- Real card payments require Stripe, PayPal, Square or another provider.
- Real online order tracking requires a database such as Firebase or Supabase.
- The custom order form uses FormSubmit after you add your email.
