# Mino 文档

[English](README.md) · [简体中文](README.zh.md) · [Mino](https://github.com/hainuoli/mino) · [API](https://pkg.go.dev/github.com/hainuoli/mino)

使用指南、可执行示例与性能基准。网站基于 Fumadocs，支持中英双语、搜索与明暗主题。

## 阅读

- [快速开始](content/docs/zh/getting-started.mdx) — 运行第一个 HTTP 服务。
- [渐进式使用](content/docs/zh/progressive-adoption.mdx) — 按需加入绑定、验证与路由。
- [ServeMux 迁移](content/docs/zh/migration.mdx) — 复用已有代码，选择路径策略。
- [包与默认行为](content/docs/zh/packages.mdx) — 职责、限制与配置约定。
- [性能与体积](content/docs/zh/benchmarks.mdx) — 测试方法、结果与复现。

## 本地预览

```sh
pnpm install
pnpm dev
```

访问 [localhost:3000](http://localhost:3000)。`pnpm build` 生成静态站点到 `out/`。

## 运行示例与基准

将 `mino` 与 `mino-doc` 放在同级目录，开发模块通过 `../../mino` 引用核心源码：

```sh
git clone https://github.com/hainuoli/mino.git
git clone https://github.com/hainuoli/mino-doc.git
cd mino-doc
```

运行示例（Go 1.23+）：

```sh
cd examples
go run ./hello
```

从 mino-doc 根目录运行基准（Go 1.25+、Python 3）：

```sh
sh benchmarks/run.sh
```

核心库保持在 [mino](https://github.com/hainuoli/mino)；本仓库承载文档及其配套代码。
