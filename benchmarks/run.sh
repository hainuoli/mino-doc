#!/bin/sh
set -eu
cd "$(dirname "$0")"
mkdir -p results
go mod verify
go test ./...
go vet ./...
python3 report.py environment > results/environment.json
go test -run '^$' -bench '^BenchmarkRouter$' -benchmem -benchtime=1s -count=5 -cpu=1 > results/router.txt
go run ./tools/footprint > results/footprint.json
python3 report.py > results/summary.md
cat results/summary.md
