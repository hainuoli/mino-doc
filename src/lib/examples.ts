export const hello =
  'package main\n\nimport (\n\t"log"\n\t"net/http"\n\n\t"github.com/hainuoli/mino/rest"\n\t"github.com/hainuoli/mino/rest/httpx"\n)\n\nfunc main() {\n\tmux := rest.NewMux()\n\n\tmux.Get("/", func(w http.ResponseWriter, r *http.Request) {\n\t\thttpx.OkJSON(w, "Hello, Mino!")\n\t})\n\n\tlog.Fatal(http.ListenAndServe(":8080", mux))\n}';
