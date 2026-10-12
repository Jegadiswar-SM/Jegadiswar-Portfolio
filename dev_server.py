import functools
import http.server
import socketserver

PORT = 3000
DIRECTORY = r"C:\Users\Jegadiswar SM\Downloads\Jegadiswar-Portfolio\dist"

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
handler = functools.partial(NoCacheHandler, directory=DIRECTORY)
try:
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving {DIRECTORY} on port {PORT} with zero-cache headers...")
        httpd.serve_forever()
except Exception as e:
    print(f"Server error: {e}")
