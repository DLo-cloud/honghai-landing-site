"""Build independently indexable EN, FR and Traditional Chinese static editions."""
from pathlib import Path
import re, html

ROOT = Path(__file__).resolve().parent
template = (ROOT / 'src/template.html').read_text()
copy = {}
for line in (ROOT / 'src/copy.tsv').read_text().splitlines():
    if not line.strip():
        continue
    key, zh, en, fr = line.split('|')
    if key in copy:
        raise ValueError('Duplicate key: ' + key)
    copy[key] = {'zh-Hant': zh, 'en': en, 'fr': fr}

pattern = re.compile(r'(<(?P<tag>[\w-]+)\b[^>]*\bdata-i18n(?:-html)?="(?P<key>[^"]+)"[^>]*>).*?(</(?P=tag)>)', re.S)
keys = set(re.findall(r'data-(?:i18n(?:-html)?|alt|placeholder)="([^"]+)"', template))
missing = keys - copy.keys()
if missing:
    raise ValueError('Missing translations: ' + ', '.join(sorted(missing)))

titles = {'en': 'Cohesol — Design, sourcing & solutions', 'fr': 'Cohesol — Conception, approvisionnement et solutions', 'zh-Hant': 'Cohesol — 設計、採購與方案服務'}
descriptions = {'en': 'Cohesol brings design, sourcing and supplier coordination together for hospitality equipment, energy applications and modular aluminium structures.', 'fr': 'Cohesol réunit conception, approvisionnement et coordination pour les équipements hôteliers, les applications énergétiques et les structures aluminium.', 'zh-Hant': 'Cohesol 提供酒店廚房設備、新能源應用與鋁型材結構的設計、採購及供應協調服務。'}
paths = {'en': 'en', 'fr': 'fr', 'zh-Hant': 'zh-hant'}
for lang, path in list(paths.items()) + [('en', '')]:
    prefix = '../' if path else './'
    page = pattern.sub(lambda m: m[1] + copy[m['key']][lang] + m[4], template)
    page = re.sub(r'<html lang="[^"]+">', '<html lang="' + lang + '">', page)
    page = re.sub(r'<title>.*?</title>', '<title>' + titles[lang] + '</title>', page)
    page = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="' + html.escape(descriptions[lang], quote=True) + '">', page)
    for attr, data in [('alt', 'alt'), ('placeholder', 'placeholder')]:
        def translate_attr(match):
            tag = match[0]
            key = re.search(r'data-' + data + r'="([^"]+)"', tag)[1]
            return re.sub(r'\b' + attr + r'="[^"]*"', attr + '="' + html.escape(copy[key][lang], quote=True) + '"', tag)
        page = re.sub(r'<[^>]+data-' + data + r'="[^"]+"[^>]*>', translate_attr, page)
    languages = '<details class="languages"><summary aria-label="' + {'en':'Choose language','fr':'Choisir la langue','zh-Hant':'選擇語言'}[lang] + '">' + {'en':'EN','fr':'FR','zh-Hant':'繁中'}[lang] + ' <span aria-hidden="true">⌄</span></summary><nav aria-label="Language">'
    for code, label in [('en', 'English'), ('fr', 'Français'), ('zh-Hant', '繁體中文')]:
        languages += '<a href="' + prefix + paths[code] + '/" lang="' + code + '" hreflang="' + code + '"' + (' aria-current="page"' if code == lang else '') + '>' + label + '</a>'
    languages += '</nav></details>'
    page = re.sub(r'<button id="language".*?</button>', languages, page)
    page = page.replace('./CONTACT_ROUTE', '/' + paths[lang] + '/contact/')
    page = page.replace('src="./', 'src="' + prefix).replace('href="./', 'href="' + prefix)
    page = page.replace('SOLAR · STORAGE · SOURCING', {'en':'SOLUTION-LED SOURCING', 'fr':'APPROVISIONNEMENT & SOLUTIONS', 'zh-Hant':'SOLUTION-LED SOURCING'}[lang])
    page = page.replace('CONNECTED THINKING. PRACTICAL SOURCING.', {'en':'YOUR SOURCING PARTNER', 'fr':'VOTRE PARTENAIRE D’APPROVISIONNEMENT', 'zh-Hant':'YOUR SOURCING PARTNER'}[lang])
    page = page.replace('01 / THE ENERGY AHEAD', {'en':'01 / FROM REQUIREMENTS TO SOLUTIONS', 'fr':'01 / DU BESOIN À LA SOLUTION', 'zh-Hant':'01 / FROM REQUIREMENTS TO SOLUTIONS'}[lang])
    labels = {'en':('Home','Open menu','Main navigation','Mobile navigation','Sourcing solutions','Scroll to our perspective'), 'fr':('Accueil','Ouvrir le menu','Navigation principale','Navigation mobile','Solutions d’approvisionnement','Notre approche'), 'zh-Hant':('首頁','開啟選單','主選單','流動版選單','採購方案','閱讀我們的出發點')}[lang]
    for old, new in zip(('Cohesol Home','開啟選單','Main navigation','Mobile navigation','Energy solutions','Scroll to our perspective'), labels):
        page = page.replace('aria-label="' + old + '"', 'aria-label="' + new + '"')
    fixed_labels = {
        'SOLAR POWER SYSTEMS': {'en':'HOSPITALITY & KITCHEN', 'fr':'HÔTELLERIE & CUISINES', 'zh-Hant':'酒店與廚房設備'},
        'ENERGY STORAGE': {'en':'ENERGY APPLICATIONS', 'fr':'APPLICATIONS ÉNERGÉTIQUES', 'zh-Hant':'新能源應用'},
        'OFF-GRID APPLICATIONS': {'en':'MODULAR STRUCTURES', 'fr':'STRUCTURES MODULAIRES', 'zh-Hant':'模組化結構'},
        '01 / COMMERCIAL': {'en':'01 / EQUIPMENT', 'fr':'01 / ÉQUIPEMENTS', 'zh-Hant':'01 / 設備'},
        '02 / STORAGE': {'en':'02 / ENERGY', 'fr':'02 / ÉNERGIE', 'zh-Hant':'02 / 能源'},
        '03 / OFF-GRID': {'en':'03 / STRUCTURE', 'fr':'03 / STRUCTURES', 'zh-Hant':'03 / 結構'},
    }
    for original, translated in fixed_labels.items():
        page = page.replace('>' + original + '<', '>' + translated[lang] + '<')
    page = page.replace('maxlength="2000"', 'maxlength="1200"')
    meta = '\n'.join('<link rel="alternate" hreflang="' + code + '" href="https://cohesol.com/' + p + '/">' for code, p in paths.items())
    meta += '\n<link rel="alternate" hreflang="x-default" href="https://cohesol.com/en/">'
    meta += '\n<link rel="canonical" href="https://cohesol.com/' + paths[lang] + '/">'
    page = page.replace('</head>', meta + '\n</head>')
    target = ROOT / 'dist' / path
    target.mkdir(parents=True, exist_ok=True)
    (target / 'index.html').write_text(page)
    print('Built', target / 'index.html')

from string import Template

contact_template = Template((ROOT / 'src/contact.html').read_text())
contact_intro = {
    'en': ('Tell us what you need to source, where it will be used and when you need it.', 'Prepare a project brief'),
    'fr': ('Indiquez-nous ce que vous recherchez, le lieu d’utilisation et le délai souhaité.', 'Préparer un descriptif du projet'),
    'zh-Hant': ('歡迎告訴我們你想採購甚麼、使用地點和預計交付時間。', '整理你的項目需求'),
}
contact_channels = {
    'en': ('Languages: French, English, Cantonese and Mandarin.', 'Open WhatsApp', 'WeChat', 'Enlarge QR code'),
    'fr': ('Langues parlées : français, anglais, cantonais et mandarin.', 'Ouvrir WhatsApp', 'WeChat', 'Agrandir le QR code'),
    'zh-Hant': ('可使用語言：法語、英語、粵語、國語。', '開啟 WhatsApp', '微信', '放大微信二維碼'),
}
for lang, path in paths.items():
    spoken, wa, wc, zoom = contact_channels[lang]
    target = ROOT / 'dist' / path / 'contact'
    target.mkdir(parents=True, exist_ok=True)
    intro, brief = contact_intro[lang]
    (target / 'index.html').write_text(contact_template.substitute(
        lang=lang, path=path, title=copy['navStart'][lang], intro=intro, brief=brief,
        spoken=spoken, wa=wa, wc=wc, zoom=zoom, region=copy['contactLocation'][lang],
    ))
