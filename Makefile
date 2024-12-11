install: deps-install build link

deps-install:
	npm ci

link:
	npm link

check: type-check test lint

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

build:
	npm run build

type-check:
	npm run type-check

run:
	node dist/bin/gendiff.js

publish:
	npm publish --dry-run

.PHONY: test
