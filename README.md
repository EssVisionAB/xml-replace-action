# XML-Replace-Action

Based on `rvolo/xml-replace-action@v0.2`

Simple GitHub Action to **replace**, **read**, or **delete** values or substrings of values in an XML configuration file using XPath.

If no matching nodes are found, the action normally logs a **warning** and continues.  
If you want warnings to cause the step to fail, set `failonwarning: true`.

---

## Inputs (Options)

| Name            | Required | Default   | Description                                                                                                                                                                   |
| --------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filepath`      | Yes      | –         | Path to the XML file to process.                                                                                                                                              |
| `xpath`         | Yes      | –         | XPath expression that selects the node(s) to operate on.                                                                                                                      |
| `operation`     | No       | `replace` | Type of operation to perform: `replace`, `read`, or `delete`.                                                                                                                 |
| `replace`       | No       | –         | Replacement string or new XML node, depending on the operation.                                                                                                               |
| `newvalue`      | No       | –         | Optional replacement substring when not replacing the entire node. Used together with `replace`.                                                                              |
| `namespaces`    | No       | –         | JSON object defining namespace prefixes, for example `{ "foo": "http://example" }`.                                                                                           |
| `failonwarning` | No       | `false`   | Optional. If set to `true`, the action fails when a warning occurs (for example, if no matching node is found). By default, warnings are logged but do not fail the workflow. |

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

### Sample – delete node but fails if it does not exist

```yaml
- name: Delete non-existent node (fail on warning)
  uses: EssVisionAB/xml-replace-action@v2
  with:
    filepath: "config-file.xml"
    xpath: "//client/nonexistentnode"
    operation: delete
    failonwarning: true
```
