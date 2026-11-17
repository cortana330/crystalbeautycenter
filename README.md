# Crystal Beauty Center — website

Static, dependency-free site for [crystalbeautycenter.com](https://crystalbeautycenter.com/). No build step is required.

## Preview locally

```bash
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Deployment

- The site is served by Vercel with the custom domain `crystalbeautycenter.com`. When the Vercel project is linked to the GitHub repository, every push to `main` creates a production deployment; no CLI step is required.
- DNS lives at Cloudflare in front of Vercel. If a change appears stale, purge the Cloudflare cache for the affected URLs (HTML and the changed assets) rather than editing DNS records.
- `vercel.json` sets cache policy: HTML is left to Vercel, `assets/css` and `assets/js` use `max-age=0, must-revalidate` so unversioned filenames cannot go stale, and images keep a 30-day cache.
- A Content-Security-Policy allows self-hosted files plus Google Fonts and the inline JSON-LD block. **If the JSON-LD in `index.html` changes, recompute its hash** and update `vercel.json`:

  ```bash
  python - <<'PY'
  import re, hashlib, base64, pathlib
  html = pathlib.Path("index.html").read_text(encoding="utf-8")
  body = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S).group(1)
  print("sha256-" + base64.b64encode(hashlib.sha256(body.encode()).digest()).decode())
  PY
  ```

- Before pushing, check the page at 1440, 768, 390 and 320 px wide: keyboard tab order, the mobile menu (Tab containment, Escape, focus return), deep links such as `/#facials`, and a clean browser console.

## Maintenance notes

- `wwwverify*.json` files are local domain-verification scratch output (they contain signed URLs). They are ignored by Git and by Vercel; keep them outside the project.
- No build step, package manager or framework is used. Edit the HTML, CSS and JS directly.

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
