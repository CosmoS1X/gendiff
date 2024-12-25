# Gendiff

[![Node.js CI](https://github.com/CosmoS1X/gendiff/actions/workflows/node.js.yml/badge.svg)](https://github.com/CosmoS1X/gendiff/actions/workflows/node.js.yml)
<a href="https://codeclimate.com/github/CosmoS1X/gendiff/maintainability"><img src="https://api.codeclimate.com/v1/badges/329d71f845a841371fb2/maintainability" /></a>
<a href="https://codeclimate.com/github/CosmoS1X/gendiff/test_coverage"><img src="https://api.codeclimate.com/v1/badges/329d71f845a841371fb2/test_coverage" /></a>

## Description

`gendiff` is a command-line utility that generates a diff between two configuration files. It supports JSON and YAML formats. The tool provides a human-readable output that shows the differences between the files. `gendiff` supports the following output formats: `stylish`, `plain`, and `json`. Additionally, it supports both absolute and relative file paths.

## Installation

To install package, use the following command:

```sh
npm i @cosmo.dev/gendiff
```

To install `gendiff` utility locally, use the following commands:

```sh
git clone git@github.com:CosmoS1X/gendiff.git
cd gendiff
make install
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