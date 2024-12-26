# Gendiff

[![Node.js CI](https://github.com/CosmoS1X/gendiff/actions/workflows/node.js.yml/badge.svg)](https://github.com/CosmoS1X/gendiff/actions/workflows/node.js.yml)
<a href="https://codeclimate.com/github/CosmoS1X/gendiff/maintainability"><img src="https://api.codeclimate.com/v1/badges/329d71f845a841371fb2/maintainability" /></a>
<a href="https://codeclimate.com/github/CosmoS1X/gendiff/test_coverage"><img src="https://api.codeclimate.com/v1/badges/329d71f845a841371fb2/test_coverage" /></a>

## Description

Gendiff is a command-line utility that generates a diff between two configuration files. It supports JSON and YAML formats. The tool provides a human-readable output that shows the differences between the files. Gendiff supports the following output formats: `stylish`, `plain`, and `json`. Additionally, it supports both absolute and relative file paths.

## Installation

To install, use the following command:

```sh
npm install -g @cosmo.dev/gendiff
```

## Usage

To compare two files, run the following command:

```sh
gendiff [options] <filepath1> <filepath2>
```

### Options

- `-V, --version`        output the version number
- `-h, --help`           display help for command
- `-f, --format [type]`  specify the output format (default: "stylish")

### Examples

Compare two JSON files:

```sh
gendiff file1.json file2.json
```

Compare two YAML files:

```sh
gendiff file1.yaml file2.yaml
```

### Demo

[![asciicast](https://asciinema.org/a/WuRaBnoSythd2wgm50IQuuCTe.svg)](https://asciinema.org/a/WuRaBnoSythd2wgm50IQuuCTe)
