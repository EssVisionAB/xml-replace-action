import * as core from "@actions/core";
import * as fs from "fs";
import { DOMParser, XMLSerializer } from "xmldom";
import * as xpath from "xpath";

const XML_NODETYPE = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  ENTITY_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12,
};

try {
  const filePath = core.getInput("filepath", { required: true });
  const xpathString = core.getInput("xpath", { required: true });
  const replaceString = core.getInput("replace");
  const newValueString = core.getInput("newvalue");
  const operation = core.getInput("operation") || "replace";

  const content = fs.readFileSync(filePath, "utf8");
  const document = new DOMParser().parseFromString(content);
  const nodes = xpath.select(xpathString, document);

  if (nodes.length === 0) {
    core.setFailed("No matching XML nodes found");
  } else {
    switch (operation) {
      case "read":
        const node = nodes[0];
        const value =
          node.nodeType === XML_NODETYPE.ATTRIBUTE_NODE
            ? node.nodeValue
            : node.textContent;
        core.setOutput("value", value);
        break;

      case "delete":
        for (const node of nodes) {
          if (node.nodeType === XML_NODETYPE.ATTRIBUTE_NODE) {
            const ownerElement = node.ownerElement;
            if (ownerElement) {
              ownerElement.removeAttribute(node.nodeName);
            }
          } else if (node.parentNode) {
            node.parentNode.removeChild(node);
          }
        }
        fs.writeFileSync(
          filePath,
          new XMLSerializer().serializeToString(document)
        );
        break;

      case "replace":
      default:
        for (const node of nodes) {
          if (
            node.nodeType === XML_NODETYPE.ELEMENT_NODE &&
            replaceString !== null
          ) {
            const newNode = new DOMParser().parseFromString(
              replaceString
            ).documentElement;
            node.parentNode.replaceChild(newNode, node);
          }

          if (replaceString === null) {
            node.parentNode.removeChild(node);
          } else {
            if (!newValueString || newValueString.length === 0) {
              node.textContent = replaceString;
            } else {
              node.textContent = node.textContent.replace(
                replaceString,
                newValueString
              );
            }
          }
        }
        fs.writeFileSync(
          filePath,
          new XMLSerializer().serializeToString(document)
        );
        break;
    }
  }
} catch (error) {
  core.setFailed(error instanceof Error ? error.message : String(error));
}
