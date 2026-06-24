"""
Capture all HTML diagrams as PNG screenshots using Selenium.
"""
import os
import time

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
except ImportError:
    print("[INFO] Installing selenium...")
    os.system("pip install selenium")
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service

ASSETS = r"e:\LTHDT_OOP\TL CK\report_assets"

DIAGRAMS = [
    ("flowchart_system.html", "fig_flowchart_system.png", 1100, 870),
    ("object_model.html", "fig_object_model.png", 1150, 600),
    ("dfd_context.html", "fig_dfd_context.png", 1050, 620),
    ("dfd_level1.html", "fig_dfd_level1.png", 1100, 980),
    ("flow_muon.html", "fig_flow_muon.png", 700, 1260),
    ("flow_tra.html", "fig_flow_tra.png", 670, 1000),
]

def capture_all():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--force-device-scale-factor=2")

    driver = webdriver.Chrome(options=opts)

    for html_file, png_file, w, h in DIAGRAMS:
        html_path = os.path.join(ASSETS, html_file)
        png_path = os.path.join(ASSETS, png_file)

        if not os.path.exists(html_path):
            print(f"[SKIP] {html_file} not found")
            continue

        url = "file:///" + html_path.replace("\\", "/")
        driver.set_window_size(w, h)
        driver.get(url)
        time.sleep(0.5)

        # Get actual page height
        page_h = driver.execute_script("return document.body.scrollHeight")
        if page_h > h:
            driver.set_window_size(w, page_h + 40)
            time.sleep(0.3)

        driver.save_screenshot(png_path)
        size_kb = os.path.getsize(png_path) / 1024
        print(f"[OK] {png_file} ({size_kb:.0f} KB)")

    driver.quit()
    print("[DONE] All diagrams captured!")

if __name__ == "__main__":
    capture_all()
