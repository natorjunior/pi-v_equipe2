from starlette.middleware.cors import CORSMiddleware

from app.src.infra.middleware.log_request_middleware import LogRequestMiddleware


class Middleware:

    @staticmethod
    def register_middlewares(app):
        Middleware().register_cors_middleware(app)
        Middleware().register_documentation_middleware(app)

    def register_cors_middleware(self, app):
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def register_documentation_middleware(self, app):
        app.add_middleware(LogRequestMiddleware)
