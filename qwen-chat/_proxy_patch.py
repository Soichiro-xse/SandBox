"""Monkey-patch grpclib to route connections through HTTP CONNECT proxy."""

import asyncio
import base64
import os
import socket
import ssl
import urllib.parse

import grpclib.client


def _get_proxy_info():
    proxy_url = os.environ.get("https_proxy") or os.environ.get("HTTPS_PROXY", "")
    if not proxy_url:
        return None
    p = urllib.parse.urlparse(proxy_url)
    auth = None
    if p.username:
        cred = f"{urllib.parse.unquote(p.username)}:{urllib.parse.unquote(p.password or '')}"
        auth = base64.b64encode(cred.encode()).decode()
    return p.hostname, p.port, auth


_original_create_connection = grpclib.client.Channel._create_connection


async def _patched_create_connection(self):
    proxy_info = _get_proxy_info()
    if not proxy_info or not self._host:
        return await _original_create_connection(self)

    proxy_host, proxy_port, proxy_auth = proxy_info
    host = self._host
    port = self._port or (443 if self._ssl else 80)

    raw_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    raw_sock.setblocking(False)

    loop = asyncio.get_event_loop()
    await loop.sock_connect(raw_sock, (proxy_host, proxy_port))

    req = f"CONNECT {host}:{port} HTTP/1.1\r\nHost: {host}:{port}\r\n"
    if proxy_auth:
        req += f"Proxy-Authorization: Basic {proxy_auth}\r\n"
    req += "\r\n"

    await loop.sock_sendall(raw_sock, req.encode())

    buf = b""
    while b"\r\n\r\n" not in buf:
        chunk = await loop.sock_recv(raw_sock, 4096)
        if not chunk:
            raise ConnectionError("Proxy closed connection")
        buf += chunk

    status_line = buf.split(b"\r\n")[0].decode()
    if "200" not in status_line:
        raw_sock.close()
        raise ConnectionError(f"Proxy CONNECT failed: {status_line}")

    ssl_context = self._ssl if isinstance(self._ssl, ssl.SSLContext) else ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    ssl_context.set_alpn_protocols(["h2"])

    _, protocol = await loop.create_connection(
        self._protocol_factory,
        ssl=ssl_context,
        sock=raw_sock,
        server_hostname=host,
    )

    return protocol


grpclib.client.Channel._create_connection = _patched_create_connection
