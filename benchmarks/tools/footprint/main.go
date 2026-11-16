// Command footprint measures Mino production source and the minimal server
// fixtures. Run from the benchmarks module: go run ./tools/footprint.
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go/scanner"
	"go/token"
	"io"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"

	"strings"
)

type sourceSize struct {
	Files int `json:"files"`
	Lines int `json:"code_lines"`
	Bytes int `json:"bytes"`
}

type binarySize struct {
	Name     string `json:"name"`
	Bytes    int64  `json:"bytes"`
	Packages int    `json:"non_std_packages"`
	Modules  int    `json:"non_std_modules"`
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	moduleDir, err := exec.Command("go", "list", "-m", "-f", "{{.Dir}}", "github.com/hainuoli/mino").Output()
	if err != nil {
		return err
	}
	sourceRoot := strings.TrimSpace(string(moduleDir))
	source := make(map[string]sourceSize)
	for _, root := range []string{filepath.Join(sourceRoot, "core"), filepath.Join(sourceRoot, "rest")} {
		if err := filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}
			if d.IsDir() || !strings.HasSuffix(path, ".go") || strings.HasSuffix(path, "_test.go") {
				return nil
			}
			data, err := os.ReadFile(path)
			if err != nil {
				return err
			}
			relative, err := filepath.Rel(sourceRoot, filepath.Dir(path))
			if err != nil {
				return err
			}
			name := filepath.ToSlash(relative)
			size := source[name]
			size.Files++
			size.Bytes += len(data)
			size.Lines += codeLines(data)
			source[name] = size
			return nil
		}); err != nil {
			return err
		}
	}

	dir, err := os.MkdirTemp("", "mino-footprint-*")
	if err != nil {
		return err
	}
	defer os.RemoveAll(dir)
	var binaries []binarySize
	for _, name := range []string{"stdlib", "mino", "mino-httpx", "gin", "chi", "gozero"} {
		target := "./cmd/" + name
		output := filepath.Join(dir, name)
		cmd := exec.Command("go", "build", "-trimpath", "-ldflags=-s -w", "-o", output, target)
		cmd.Env = append(os.Environ(), "CGO_ENABLED=0", "GOOS=linux", "GOARCH=amd64", "GOAMD64=v1", "GOFLAGS=", "GOEXPERIMENT=")
		if data, err := cmd.CombinedOutput(); err != nil {
			return fmt.Errorf("build %s: %w\n%s", name, err, data)
		}
		info, err := os.Stat(output)
		if err != nil {
			return err
		}
		list := exec.Command("go", "list", "-deps", "-json", target)
		list.Env = cmd.Env
		data, err := list.Output()
		if err != nil {
			return fmt.Errorf("list %s: %w", name, err)
		}
		dec := json.NewDecoder(bytes.NewReader(data))
		packages := 0
		modules := make(map[string]bool)
		for {
			var pkg struct {
				Standard   bool
				ImportPath string
				Module     *struct{ Path string }
			}
			if err := dec.Decode(&pkg); err == io.EOF {
				break
			} else if err != nil {
				return err
			}
			// Exclude the fixture's own main package; include Mino itself.
			if !pkg.Standard && pkg.Module != nil && pkg.Module.Path != "github.com/hainuoli/mino-doc/benchmarks" {
				packages++
				modules[pkg.Module.Path] = true
			}
		}
		binaries = append(binaries, binarySize{name, info.Size(), packages, len(modules)})
	}
	result := struct {
		Go       string                `json:"go"`
		Target   string                `json:"target"`
		Source   map[string]sourceSize `json:"source"`
		Binaries []binarySize          `json:"binaries"`
	}{runtime.Version(), "linux/amd64; CGO_ENABLED=0; GOAMD64=v1; -trimpath -ldflags='-s -w'; default build tags", source, binaries}
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	return enc.Encode(result)
}

// Blank comments using Go's lexer (so comment markers inside strings survive),
// then count nonblank physical lines. Raw-string content counts as code.
func codeLines(data []byte) int {
	clean := bytes.Clone(data)
	fset := token.NewFileSet()
	file := fset.AddFile("source.go", -1, len(data))
	var s scanner.Scanner
	s.Init(file, data, nil, scanner.ScanComments)
	var comments [][2]int
	for {
		pos, tok, lit := s.Scan()
		if tok == token.EOF {
			break
		}
		if tok == token.COMMENT {
			start := file.Offset(pos)
			comments = append(comments, [2]int{start, start + len(lit)})
		}
	}

	for _, span := range comments {
		for i := span[0]; i < span[1]; i++ {
			if clean[i] != '\n' && clean[i] != '\r' {
				clean[i] = ' '
			}
		}
	}
	lines := 0
	for _, line := range bytes.Split(clean, []byte{'\n'}) {
		if len(bytes.TrimSpace(line)) > 0 {
			lines++
		}
	}
	return lines
}
