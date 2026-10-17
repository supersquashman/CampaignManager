.PHONY: run build ui
run:
	go run ./cmd/server

# Build the frontend and copy it where go:embed can see it.
ui:
	cd ../web && npm install && npm run build
	rm -rf internal/ui/dist && cp -r ../web/dist internal/ui/dist

build: ui
	go build -o bin/server ./cmd/server
