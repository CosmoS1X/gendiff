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
	npm test -- --coverage

build:
	npm run build

type-check:
	npm run type-check

run: build
	node dist/bin/gendiff.js $(FILE1) $(FILE2)

publish:
	npm publish --access=public

.PHONY: test
