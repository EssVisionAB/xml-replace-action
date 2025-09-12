# XML-Replace-Action

based of rvolo/xml-replace-action@v0.2

Simple GitHub action to replace, read or delete values or substrings of values in an XML config file using xpath.

---

### Sample – replace text content of a node or attribute

```yaml
- name: Set logback env values
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//configuration/server/url"
    replace: "testserver"
    newvalue: "localhost" # optional, when used replace targets string
```

---

### Sample – replace whole node with new XML

```yaml
- name: Replace whole node
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//configuration/server/url"
    replace: "<url>localhost</url>"
    operation: replace
```

---

### Sample – read value from node or attribute

```yaml
- name: Read address attribute
  id: read_xml
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//client/endpoint/@address"
    operation: read

- run: echo "Found address: ${{ steps.read_xml.outputs.value }}"
```

---

### Sample – delete node or attribute

```yaml
- name: Delete address attribute
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//client/endpoint/@address"
    operation: delete
```

```yaml
- name: Delete endpoint node
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//client/endpoint"
    operation: delete
```

### Sample – delete node or attribute inside namespace

```yaml
- name: Delete address attribute
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//foo:client/foo:endpoint/@address"
    namespaces: |
      { "foo": "http:/foo" }
    operation: delete
```

```yaml
- name: Delete endpoint node
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//foo:client/foo:endpoint"
    namespaces: |
      { "foo": "http:/foo" }
    operation: delete
```
