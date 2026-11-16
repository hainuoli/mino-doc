# Mino documentation

[English](README.md) · [简体中文](README.zh.md) · [Mino](https://github.com/hainuoli/mino) · [API](https://pkg.go.dev/github.com/hainuoli/mino)

Guides, executable examples, and benchmarks. Built with Fumadocs, with English and Chinese content, search, and light/dark themes.

## Read

- [Getting started](content/docs/en/getting-started.mdx) — Run your first HTTP service.
- [Progressive adoption](content/docs/en/progressive-adoption.mdx) — Add binding, validation, and routing on demand.
- [ServeMux migration](content/docs/en/migration.mdx) — Reuse existing code and select path policies.
- [Packages and defaults](content/docs/en/packages.mdx) — Responsibilities, limits, and configuration.
- [Benchmarks and footprint](content/docs/en/benchmarks.mdx) — Methodology, results, and reproduction.

## Preview locally

```sh
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000). `pnpm build` exports the static site to `out/`.

## Run the examples and benchmarks

Keep `mino` and `mino-doc` as sibling checkouts. Development modules reference the core source at `../../mino`:

```sh
git clone https://github.com/hainuoli/mino.git
git clone https://github.com/hainuoli/mino-doc.git
cd mino-doc
```

Run an example (Go 1.23+):

```sh
cd examples
go run ./hello
```

Run benchmarks from the mino-doc root (Go 1.25+, Python 3):

```sh
sh benchmarks/run.sh
```

The core library stays in [mino](https://github.com/hainuoli/mino); this repository contains documentation and its supporting code.
