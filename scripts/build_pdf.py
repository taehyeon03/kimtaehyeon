"""Regenerate the CV PDFs (English + Korean) from index.html.

The PDFs are printed from the live page with the print stylesheet, so whatever
the site shows in each language is what ends up in the PDF.

    pip install playwright && playwright install chromium
    python scripts/build_pdf.py

Writes:
    assets/files/CV_TaeHyeon_Kim.pdf      (English)
    assets/files/CV_TaeHyeon_Kim_KO.pdf   (Korean)
"""
import functools
import http.server
import pathlib
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUTPUTS = {
    "en": ROOT / "assets/files/CV_TaeHyeon_Kim.pdf",
    "ko": ROOT / "assets/files/CV_TaeHyeon_Kim_KO.pdf",
}


def setup_routes(context, base_url):
    """Hook for environments without CDN access; no-op by default."""


def serve(root):
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(root))
    handler.log_message = lambda *a, **k: None
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def build():
    server = serve(ROOT)
    base = f"http://127.0.0.1:{server.server_address[1]}"
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            context = browser.new_context()
            setup_routes(context, base)
            for lang, out in OUTPUTS.items():
                page = context.new_page()
                page.goto(f"{base}/index.html?lang={lang}", wait_until="networkidle")
                page.wait_for_function(f"document.documentElement.lang === '{lang}'")
                page.evaluate("document.fonts.ready")
                page.emulate_media(media="print")
                page.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
                page.close()
                print(f"wrote {out.relative_to(ROOT)}")
            browser.close()
    finally:
        server.shutdown()


if __name__ == "__main__":
    build()
