# Crystal Beauty Center — website

Static, dependency-free site for [crystalbeautycenter.com](https://crystalbeautycenter.com/). No build step is required.

## Preview locally

```bash
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Deployment note

The site is Vercel-compatible (`vercel.json` included), but **Vercel Hobby is not eligible**: the Vercel Terms of Service (§4) restrict Hobby to personal, non-commercial use, and this is a business site. Deploy on Vercel Pro or another host that permits commercial use. No deployment, DNS or account changes have been made.

## Content notes

- Service names come from the supplied `Crystal price list.pdf`. The menu lists service names and category headings only: PDF variant/duration qualifiers (lengths, hands/feet, timings) and the pigmentation touch-up note are deliberately omitted. No prices appear anywhere.
- Branch details were integrated from verified research: Al Khuwair, Building 317, Al Maha Street, Al Khuwair 33 (`+968 2448 3637`) and Al Mouj, The Walk, 1st floor (`+968 2454 3343`). Al Mouj hours are omitted because sources conflict; Al Khuwair shows the consistently listed daily 09:00–21:00 hours.
- Bookings route to Instagram and the two verified branch phone numbers.
- Photos and logo are copied and optimised from the supplied `CRYSTAL-WEBSITE` folder. The source folder is untouched.

## Structure

```
index.html            404.html
assets/css/styles.css
assets/js/site.js
assets/images/        (optimised JPG/PNG + favicons)
robots.txt            sitemap.xml            site.webmanifest
vercel.json
```
