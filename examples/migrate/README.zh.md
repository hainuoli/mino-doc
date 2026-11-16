# 从 ServeMux 迁移

[English](README.md) · [简体中文](README.zh.md) · [Mino](../../README.zh.md)

同一份服务，切换两种路由器。[main.go](main.go) 中的 handler、路由注册、中间件和服务配置共用一份实现。

## 运行

进入 `examples/`，每次运行一条命令：

```sh
go run ./migrate -stdlib
go run ./migrate
go run ./migrate -clean-path -escaped-path -trailing-slash -redirect-status=301
```

三条命令分别选择标准库、Mino 默认配置，以及匹配本示例 Go 1.25 路径行为的 Mino 配置。通过 `-addr=:8081` 更换监听地址。

| 请求 | Mino 默认配置 | 配置后的 Mino |
| --- | --- | --- |
| `/users/42` | 200，响应 `42` | 200，响应 `42` |
| `/users//42` | 404 | 301 → `/users/42` |
| `/files/a%2Fb` | 404 | 200，响应 `a/b` |
| `/docs` | 404 | 301 → `/docs/` |

查看响应与重定向位置：

```sh
curl -i http://localhost:8080/users//42
curl -i http://localhost:8080/files/a%2Fb
curl -i http://localhost:8080/docs
```

## 接入已有项目

- 将 `http.NewServeMux()` 替换为 `rest.NewMux(...)`，在注册路由前选择路径策略。
- 保留 `Handle`、`HandleFunc`、标准 handler、中间件包装与 `http.Server` 配置。
- 将全局 `http.Handle` / `http.HandleFunc` 改为新 mux 的实例方法，并把它交给服务的 handler。
- 注册辅助函数若接收 `*http.ServeMux`，可改用本地接口，见 [main.go](main.go) 中的 `routeMux`。

## 对齐原服务行为

Mino 的三项路径策略默认关闭。重定向状态码默认 307，统一作用于路径清理与尾斜杠重定向。上方 301 配置面向 Go 1.25；[Go 1.26](https://go.dev/doc/go1.26#net/http) 将标准库尾斜杠重定向改为 307。

本示例采用现代 `ServeMux` 路由，不覆盖旧版 `httpmuxgo121=1` 行为及各版本的重定向细节。用已有 HTTP 测试核对选定的配置即可。
