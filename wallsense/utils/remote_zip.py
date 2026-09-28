"""Read members of a remote ZIP over HTTP range requests, so large datasets can be sampled without a full download."""

import io
import urllib.request


class HttpRangeFile(io.RawIOBase):
    """Seekable, read-only file object backed by HTTP range requests."""

    def __init__(self, url: str, block: int = 1 << 20) -> None:
        self.url = url
        self.pos = 0
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=60) as r:
            self.size = int(r.headers["Content-Length"])
        self.block = block
        self._cache: dict[int, bytes] = {}

    def seekable(self) -> bool:
        return True

    def readable(self) -> bool:
        return True

    def tell(self) -> int:
        return self.pos

    def seek(self, offset: int, whence: int = io.SEEK_SET) -> int:
        base = {io.SEEK_SET: 0, io.SEEK_CUR: self.pos, io.SEEK_END: self.size}[whence]
        self.pos = max(0, base + offset)
        return self.pos

    def _fetch(self, start: int, end: int) -> bytes:
        req = urllib.request.Request(self.url, headers={"Range": f"bytes={start}-{end - 1}"})
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    return r.read()
            except OSError:
                if attempt == 3:
                    raise
        return b""

    def read(self, n: int = -1) -> bytes:
        if self.pos >= self.size:
            return b""
        end = self.size if n is None or n < 0 else min(self.size, self.pos + n)
        # Small reads (zip headers) go through a block cache; large reads are fetched directly.
        if end - self.pos >= self.block:
            data = self._fetch(self.pos, end)
        else:
            chunks = []
            p = self.pos
            while p < end:
                b = p // self.block
                if b not in self._cache:
                    self._cache[b] = self._fetch(b * self.block, min(self.size, (b + 1) * self.block))
                    if len(self._cache) > 64:
                        self._cache.pop(next(iter(self._cache)))
                blk = self._cache[b]
                off = p - b * self.block
                take = min(end - p, len(blk) - off)
                chunks.append(blk[off:off + take])
                p += take
            data = b"".join(chunks)
        self.pos += len(data)
        return data

    def readinto(self, buf) -> int:
        data = self.read(len(buf))
        buf[: len(data)] = data
        return len(data)
