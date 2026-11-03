# Branded email template

A simple, letter-style email that matches the portfolio: white card, thin indigo-to-blue brand line, the Enoch monogram, plain body text, one optional button and a clean signature.

Open `brand-template.html` in your browser to preview it. Use `brand-template.txt` for plain-text emails or as the text alternative in an email tool, and keep its wording and links in step with the HTML version. The subject line belongs in your email app's subject field.

## How to use it

1. Replace every `[bracketed text]`, including the hidden inbox preview near the top of the file.
2. The button opens your Calendly page for a 30-minute call. Delete that table row if you do not need it. To change it, update both the normal link and the Outlook (VML) link, URL and label.
3. Import the HTML through your email tool's HTML editor and send yourself a test first. Pasting raw HTML into a normal compose window will not render it.

## Notes

- The logo loads from `https://enochakinpeluportfolio.vercel.app/images/brand/email-logo.png`, so it only appears once the site is deployed. If an email app blocks images, the word "Enoch" shows in its place and everything else stays readable.
- Colors come from the brand: logo navy `#05173e`, indigo `#2a2a72`, blue `#009ffd`, violet `#7d3cff` for the button, paper `#f9f9f9`.
- Built with tables, inline styles and system fonts, with an Outlook-compatible button. No JavaScript.
- It is a personal correspondence template. Nothing here sends mail or connects to a mailing service.

Checked in a browser at 900px and 375px wide with no horizontal overflow. Gmail and Outlook rendering has not been tested; send yourself a test before using it.
