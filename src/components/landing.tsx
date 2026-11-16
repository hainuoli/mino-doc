import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { highlight } from "fumadocs-core/highlight";
import { CopyCommand } from "./copy-command";
import { hello } from "@/lib/examples";
import { Moon } from "./moon";

const samples = [
  ["Static route", "静态路由", 85.5, 101.2, 220.3, 123.4],
  ["One parameter", "单路径参数", 183.0, 127.0, 343.5, 385.2],
  ["Three parameters", "三个路径参数", 274.5, 197.6, 499.1, 679.2],
  ["1,000 routes", "1,000 条路由", 131.3, 170.6, 355.1, 5328.0],
  ["Five middleware layers", "五层中间件", 254.9, 279.1, 410.7, 304.4],
  ["Route + JSON", "路由 + JSON", 178.5, 217.9, 316.5, 219.5],
] as const;

export async function Landing({ lang = "zh" }: { lang?: "zh" | "en" }) {
  const zh = lang === "zh";
  const doc = `/docs/${lang}`;
  const features = zh
    ? [
        ["渐进式", "从一个工具包到完整 HTTP 服务，按项目的节奏逐步成长。"],
        ["轻量小巧", "2,003 行生产代码，零第三方运行时依赖。"],
        ["高性能", "静态路由实测 85.5 ns/op，六组对比基准中四组领先。"],
        ["出色的 DX", "实用的默认行为、一致的组件约定，少写重复代码。"],
        ["符合直觉", "标准 HTTP handler、上下文与错误链，熟悉 Go 就能上手。"],
        ["按需引入", "需要什么就引入什么。各包独立可用，也能自然组合。"],
      ]
    : [
        [
          "Progressive",
          "From one utility to an HTTP service, at your own pace.",
        ],
        [
          "Lightweight",
          "2,003 production code lines. Zero third-party runtime dependencies.",
        ],
        [
          "Fast",
          "85.5 ns/op for static routes. Lowest median in four of six measured workloads.",
        ],
        [
          "Great DX",
          "Useful defaults and consistent conventions, with less repetitive code.",
        ],
        [
          "Intuitive",
          "Standard HTTP handlers, contexts, and error chains. Familiar Go.",
        ],
        [
          "Adopt on demand",
          "Use the packages you need, independently or together.",
        ],
      ];
  const steps = zh
    ? [
        [
          "先用一个包",
          "独立处理 JSON、包装错误，或组合已有中间件。",
          "jsonx · errorx · mapping · chain",
        ],
        [
          "再加请求处理",
          "按需加入绑定、验证、错误响应，保留标准 handler。",
          "httpx.Parse → Validate → OkJSON",
        ],
        [
          "自然长成服务",
          "围绕同一份 handler 增加路由、分组与中间件。",
          "rest.NewMux → Route → Use",
        ],
      ]
    : [
        [
          "Start with one package",
          "Encode JSON, wrap errors, or compose existing middleware.",
          "jsonx · errorx · mapping · chain",
        ],
        [
          "Add request handling",
          "Bring in binding, validation, and responses. Keep standard handlers.",
          "httpx.Parse → Validate → OkJSON",
        ],
        [
          "Grow into a service",
          "Add routing, groups, and middleware around the same handlers.",
          "rest.NewMux → Route → Use",
        ],
      ];
  const code = await highlight(hello, {
    lang: "go",
    themes: { light: "github-light", dark: "github-dark" },
  });
  return (
    <main className="landing" lang={zh ? "zh-CN" : "en"}>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">MINO / SMALL STEPS. OPEN POSSIBILITIES.</p>
          <h1>
            {zh ? (
              <>
                从一个包开始。
                <br />
                <span>随项目成长。</span>
              </>
            ) : (
              <>
                Start small.
                <br />
                <span>Grow your way.</span>
              </>
            )}
          </h1>
          <p className="hero-description">
            {zh
              ? "按需引入，自然组合。让服务逐步成长，始终写熟悉的 Go。"
              : "Adopt what you need. Compose as you grow. Keep writing familiar Go."}
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href={`${doc}/getting-started`}>
              {zh ? "开始使用" : "Get started"}
              <ArrowRight size={16} />
            </Link>
            <a className="text-link" href="https://github.com/hainuoli/mino">
              GitHub
              <ArrowUpRight size={15} />
            </a>
          </div>
          <CopyCommand
            command="go get github.com/hainuoli/mino"
            label={zh ? "复制安装命令" : "Copy install command"}
            done={zh ? "已复制" : "Copied"}
          />
          <p className="hero-meta">
            Go 1.23+<span>·</span>MIT<span>·</span>
            {zh
              ? "零第三方运行时依赖"
              : "Zero third-party runtime dependencies"}
          </p>
        </div>
        <Moon />
      </section>

      <section
        className="feature-grid"
        aria-label={zh ? "Mino 的六个亮点" : "Why Mino"}
      >
        {features.map(([title, description], i) => (
          <div className="feature" key={title}>
            <span className="feature-index">0{i + 1}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        ))}
      </section>

      <section className="hello-section" id="hello">
        <div className="hello-intro">
          <p className="eyebrow">HELLO, MINO.</p>
          <h2>
            {zh ? (
              <>
                熟悉的 Go，
                <br />
                自然就会用。
              </>
            ) : (
              <>
                Familiar Go.
                <br />A natural start.
              </>
            )}
          </h2>
          <p>
            {zh
              ? "标准 HTTP handler，一次调用输出 JSON。保存为 main.go，即可运行第一个 Mino 服务。"
              : "A standard HTTP handler. One call to return JSON. Save as main.go to run your first Mino service."}
          </p>
          <Link className="text-link" href={`${doc}/getting-started`}>
            {zh ? "运行这个示例" : "Run this example"}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="code-window">
          <div className="code-caption">
            <span>main.go</span>
            <span>net/http + Mino</span>
          </div>
          {code}
          <div className="code-result">
            <span>GET /</span>
            <code>&quot;Hello, Mino!&quot;</code>
            <span className="response-status">200 OK</span>
          </div>
        </div>
      </section>

      <section className="story-section" id="progressive">
        <div className="section-intro">
          <div>
            <p className="eyebrow">01 / ROOM TO GROW</p>
            <h2>{zh ? "今天够用，明天从容。" : "Room to grow."}</h2>
          </div>
          <Link className="text-link" href={`${doc}/progressive-adoption`}>
            {zh ? "渐进式使用" : "Progressive adoption"}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="growth-steps">
          {steps.map(([title, text, packages], i) => (
            <div className="growth-step" key={title}>
              <span className="step-number">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <code>{packages}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="migration-section" id="migration">
        <div>
          <p className="eyebrow">02 / AT HOME IN NET/HTTP</p>
          <h2>
            {zh ? (
              <>
                已有的服务，
                <br />
                也能轻松接入。
              </>
            ) : (
              <>
                Your existing service.
                <br />A small next step.
              </>
            )}
          </h2>
          <p>
            {zh
              ? "替换构造器，保留注册方式、handler、中间件与服务配置。需要路径清理、转义匹配或尾斜杠重定向时，再开启对应策略。"
              : "Replace the constructor. Keep your registrations, handlers, middleware, and server setup. Enable path policies to match your existing service."}
          </p>
          <Link className="text-link" href={`${doc}/migration`}>
            {zh ? "从 ServeMux 迁移" : "Move from ServeMux"}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="migration-code">
          <div className="code-caption">
            <span>{zh ? "从这里开始" : "Start here"}</span>
            <span>main.go</span>
          </div>
          <pre>
            <code>
              <span className="diff-remove">− mux := http.NewServeMux()</span>
              {"\n"}
              <span className="diff-add">+ mux := rest.NewMux()</span>
              {"\n\n"}
              {'  mux.HandleFunc("GET /users/{id}", getUser)'}
            </code>
          </pre>
          <div className="migration-note">
            <code>http.Handler</code>
            <span>→</span>
            <code>r.PathValue</code>
            <span>→</span>
            <code>{zh ? "原有代码继续用" : "Keep your code"}</code>
          </div>
        </div>
      </section>

      <section className="story-section" id="performance">
        <div className="section-intro">
          <div>
            <p className="eyebrow">03 / SMALL CODE. MEASURED SPEED.</p>
            <h2>{zh ? "快，有据可查。" : "Speed, with the evidence."}</h2>
          </div>
          <Link className="text-link" href={`${doc}/benchmarks`}>
            {zh ? "查看测试方法" : "See the methodology"}
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="benchmark-layout">
          <div className="benchmark-aside">
            <p className="big-number">
              85.5<span>ns/op</span>
            </p>
            <p>
              {zh
                ? "静态路由 · 本次六组基准中四组领先"
                : "Static routing · Lowest median in four of six workloads"}
            </p>
            <div className="footprint-note">
              <strong>88 KiB</strong>
              <p>
                {zh
                  ? "最小路由服务相对 net/http 基线的二进制增量。"
                  : "Added binary size over a minimal net/http server."}
              </p>
            </div>
            <Link
              className="text-link"
              href={`${doc}/benchmarks#${zh ? "体积测量方法" : "footprint-methodology"}`}
            >
              {zh ? "体积测量" : "Footprint details"}
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="benchmark-table">
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label={zh ? "路由性能对比" : "Router benchmarks"}
            >
              <table>
                <caption className="sr-only">
                  {zh
                    ? "单位 ns/op，越低越好。"
                    : "Time in ns/op; lower is better."}
                </caption>
                <thead>
                  <tr>
                    <th>{zh ? "场景 / ns/op" : "Scenario / ns/op"}</th>
                    <th>Mino</th>
                    <th>Gin</th>
                    <th>Chi</th>
                    <th>go-zero router</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map(([en, cn, ...values]) => (
                    <tr key={en}>
                      <th scope="row">{zh ? cn : en}</th>
                      {values.map((n, i) => (
                        <td
                          key={i}
                          data-best={n === Math.min(...values) || undefined}
                        >
                          {n.toLocaleString("en-US", {
                            minimumFractionDigits: 1,
                          })}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="measurement-note">
              Apple M4 · Go 1.25.4 ·{" "}
              {zh
                ? "五次采样的中位数 · -cpu=1 · 2026-11-15"
                : "Median of five runs · -cpu=1 · 2026-11-15"}
            </p>
            <p className="measurement-note">
              {zh
                ? "进程内 ServeHTTP，无默认中间件；go-zero 仅使用独立路由器。"
                : "In-process ServeHTTP without default middleware; go-zero uses its standalone router."}
            </p>
            <p className="measurement-note">
              {zh
                ? "参数路由中 Gin 更快；Mino 当前写入标准 PathValue 产生额外 map 分配。"
                : "Gin leads the parameter workloads. Mino currently allocates a map when populating standard PathValue."}{" "}
              <Link
                href={`${doc}/benchmarks#${zh ? "参数路由的开销" : "parameter-route-cost"}`}
              >
                {zh ? "原因分析 ↗" : "Read the analysis ↗"}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="closing">
        <p className="eyebrow">YOUR CODE. YOUR PACE.</p>
        <h2>
          {zh ? "从你需要的那一部分开始。" : "Start with the part you need."}
        </h2>
        <Link className="button-primary" href={`${doc}/getting-started`}>
          {zh ? "写下第一个 Mino 服务" : "Build your first Mino service"}
          <ArrowRight size={16} />
        </Link>
      </section>
      <footer className="landing-footer">
        <Link className="mino-wordmark" href="/">
          mino<span>.</span>
        </Link>
        <p>{zh ? "轻装起步，自然成长。" : "Start small. Grow naturally."}</p>
        <div>
          <a href="https://github.com/hainuoli/mino">GitHub</a>
          <a href="https://pkg.go.dev/github.com/hainuoli/mino">API</a>
          <Link href={zh ? "/en" : "/"}>{zh ? "English" : "简体中文"}</Link>
          <a href="https://github.com/hainuoli/mino/blob/main/LICENSE">MIT</a>
        </div>
      </footer>
    </main>
  );
}
