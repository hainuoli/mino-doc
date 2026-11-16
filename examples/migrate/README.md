# ServeMux migration

[English](README.md) · [简体中文](README.zh.md) · [Mino](../../README.md)

One service, two routers. Handlers, registrations, middleware, and server configuration are shared in [main.go](main.go).

## Run

From `examples/`, run one command at a time:

```sh
go run ./migrate -stdlib
go run ./migrate
go run ./migrate -clean-path -escaped-path -trailing-slash -redirect-status=301
```

The commands select the standard library, Mino defaults, and Mino with path policies matching this Go 1.25 example. Use `-addr=:8081` to change the listen address.

| Request | Mino defaults | Configured Mino |
| --- | --- | --- |
| `/users/42` | 200, body `42` | 200, body `42` |
| `/users//42` | 404 | 301 → `/users/42` |
| `/files/a%2Fb` | 404 | 200, body `a/b` |
| `/docs` | 404 | 301 → `/docs/` |

Inspect responses without following redirects:

```sh
curl -i http://localhost:8080/users//42
curl -i http://localhost:8080/files/a%2Fb
curl -i http://localhost:8080/docs
```

## Integrate

- Replace `http.NewServeMux()` with `rest.NewMux(...)` and choose path policies before registering routes.
- Keep `Handle`, `HandleFunc`, standard handlers, middleware wrappers, and `http.Server` configuration.
- Move global `http.Handle` / `http.HandleFunc` calls onto the new mux and pass it as the server's handler.
- Registration helpers accepting `*http.ServeMux` can use a local interface instead; see `routeMux` in [main.go](main.go).

## Match your service's behavior

Mino's three path policies default to off. Its redirect status defaults to 307 and applies to both path-cleaning and trailing-slash redirects. The 301 profile above targets Go 1.25; [Go 1.26](https://go.dev/doc/go1.26#net/http) changed standard-library trailing-slash redirects to 307.

This example uses modern `ServeMux` patterns. Legacy `httpmuxgo121=1` behavior and version-specific redirect details are outside its scope. Run your existing HTTP tests with the selected configuration.
