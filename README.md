# Testh

##  What is Testh?

Testh is an open-source «No-Code Automation Testing as Code» framework.

What does it mean?

Writing automation tests is often a routine: same thing over and over. This could be greatly reduced by reusing exisiting code.

This is where **Testh** comes in and provides a number of built-in components, which can be operated using YAML files.

For example, to open browser we can do the following:

```yaml
type: open
values:
    browser: chrome
```

## How to write tests?

Currently the only format supported is YAML.

Writing tests are really easy and quick. Testh provides a lot of built-in components.

The first thing which is needed is the test's name:

```yaml
name: My first test
```

Then we need to tell Testh what steps it should execute:

```yaml
steps:
    - type: open
      values:
        browser: chrome
    - type: open-url
      values:
        url: http://google.com
```

These steps will open `chrome` browser and will navigate to `http://google.com`

That's it! Really simple, eh?

So combining these two items we will have our first simple test:

```yaml
name: My first test
steps:
    - type: open
      values:
        browser: chrome
    - type: open-url
      values:
        url: http://google.com
```

But **Testh** is more powerful than that!

For starters, **Testh** supports variables. There are multiple ways to define them.

Firstly, we can define test-wide variables:

```yaml
variables:
  url: https://google.com
```

This will create a variable with the name `url`. How we can use it? It's really simple:

```yaml
- type: open-url
  values:
    url: $(url)/maps
```

Which will open the url of `https://google.com/maps`

`$(EXPRESSION)` where `EXPRESSION` is a valid Javascript expression

If your value is completely an evaluation of something, we can simplify it even further:

```yaml
- type: open-url
  values:
    $url: url
```

Which is the same as `url: $(url)`.

But! It could be simplified again! Some of the steps support *Binding* property.  This mostly applies to steps with one value:

```yaml
- open-url: $(url)
```

or

```yaml
- $open-url: url
```

Noice! ![Noice](https://media0.giphy.com/media/yJFeycRK2DB4c/giphy.gif?cid=ecf05e4795bae8xc0m4k7f2w0et7n1rzsdwpamq53534zzzj&ep=v1_gifs_search&rid=giphy.gif&ct=g)

You can see more examples: 

- [example.yaml](./examples/example.yaml)
- [http.yaml](./examples/http.yaml)
- [http.file.yaml](./examples/http.file.yaml)

## How to run tests?

TBD

## How to contribute

TBD