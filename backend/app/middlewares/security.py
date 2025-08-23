import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.logger import logger

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(
                f"❌ Error procesando {request.method} {request.url.path} "
                f"desde {request.client.host} → {repr(e)}",
                exc_info=True
            )
            raise

        process_time = (time.time() - start_time) * 1000
        status_code = response.status_code

        if status_code >= 500:
            logger.error(
                f"⛔ {request.method} {request.url.path} "
                f"→ {status_code} ({process_time:.2f}ms)"
            )
        elif status_code >= 400:
            logger.warning(
                f"⚠️ {request.method} {request.url.path} "
                f"→ {status_code} ({process_time:.2f}ms)"
            )
        else:
            logger.info(
                f"✅ {request.method} {request.url.path} "
                f"→ {status_code} ({process_time:.2f}ms)"
            )

        return response