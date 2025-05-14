# automation/scraper.py

import requests
import bs4
import datetime
from pathlib import Path

# Folder where MDX files will be saved
OUTPUT_DIR = Path("src/data/ibreviary")

def main():
    session = requests.Session()
    date = datetime.datetime.now()

    # Make sure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for i in range(7):
        date_str = date.strftime('%Y-%m-%d')
        print(f"Fetching prayers for {date_str}...")

        day = str(date.day)
        month = str(date.month)
        year = str(date.year)

        # Set date on iBreviary site
        set_date(session, year, month, day)

        # Get morning and evening prayer
        morning = get_prayer(session, 'morning')
        evening = get_prayer(session, 'evening')

        # Save MDX files
        save_prayer_to_mdx(date_str, "morning", morning)
        save_prayer_to_mdx(date_str, "evening", evening)

        # Move to next day
        date += datetime.timedelta(days=1)

def set_date(session, year, month, day):
    payload = {
        'lang': 'en',
        'anno': year,
        'mese': month,
        'giorno': day,
        'ok': 'ok',
    }
    session.post('http://www.ibreviary.com/m/opzioni.php', data=payload)

def get_prayer(session, daytime):
    sections = {
        'morning': 'lodi',
        'evening': 'vespri'
    }

    section = sections.get(daytime)
    if not section:
        return f"<p>Invalid prayer time: {daytime}</p>"

    response = session.get('http://www.ibreviary.com/m/breviario.php', params={'s': section})
    soup = bs4.BeautifulSoup(response.text, 'lxml')

    output = []
    for i, div in enumerate(soup.find_all('div')):
        text = div.get_text(strip=True)
        if text:
            if i == 0:
                output.append(f"<h2>{text}</h2>")
            else:
                output.append(f"<section><p>{text}</p></section>")

    return '\n\n'.join(output)

def save_prayer_to_mdx(date_str, time_of_day, content):
    """Save prayer content as an MDX file with frontmatter."""
    filename = OUTPUT_DIR / f"{date_str}-{time_of_day}.mdx"
    mdx_content = f"""---
date: {date_str}
type: "{time_of_day}"
---

{content}
"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(mdx_content)
    print(f"Saved {time_of_day} prayer for {date_str} to {filename}")

if __name__ == '__main__':
    main()
