// Package ui serves the built frontend (web/dist, copied to internal/ui/dist by `make ui`).
package ui

import (
	"embed"
	"io/fs"
	"net/http"
	"path"
	"strings"
)

//go:embed all:dist
var distFS embed.FS

func Handler() http.Handler {
	sub, err := fs.Sub(distFS, "dist")
	if err != nil {
		panic(err)
	}
	files := http.FileServerFS(sub)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		p := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		if p != "" {
			if _, err := fs.Stat(sub, p); err != nil {
				r.URL.Path = "/" // client-side route: serve index.html
			}
		}
		files.ServeHTTP(w, r)
	})
}
