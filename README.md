# Photo Editor: setup guide

## 1. Paystack (use TEST mode first)
1. Dashboard > Settings > API Keys & Webhooks: copy the **Test Secret Key** (starts `sk_test_`).
2. Dashboard > Products > Plans > Create plan: name "Monthly", amount in naira (₦), interval monthly. Copy the **plan code** (starts `PLN_`).
   The price shown on the website is read from this plan, so change it here whenever you change your price.

## 2. Put the files online
1. Create a free GitHub account and a new repository.
2. Upload everything in this folder (keep the folders as they are).
3. Create a free Netlify account > Add new site > Import an existing project > choose your repository > Deploy.

## 3. Add your settings in Netlify
Site configuration > Environment variables:
- `PAYSTACK_SECRET_KEY` = your Paystack secret key
- `PAYSTACK_PLAN_CODE` = your plan code
- `TOKEN_SECRET` = any long random text you make up

Then Deploys > Trigger deploy. Never paste your secret key into the page or share it.

## 4. Test, then go live
Subscribe on your site using a Paystack test card (listed in Paystack's docs). To go live, swap in your **live** secret key and a **live** plan code (test and live plans are separate), then redeploy.

## 5. Your own address
Netlify > Domain management > Add a domain, then follow the steps.
