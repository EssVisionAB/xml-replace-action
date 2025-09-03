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
  let filePath = core.getInput("filepath", { required: true });
  let xpathString = core.getInput("xpath", { required: true });
  let replaceString = core.getInput("replace", { required: true });
  let newValueString = core.getInput("newvalue");

  writeFile(filePath, xpathString, replaceString, newValueString);
} catch (error) {
  core.setFailed(error.message);
}

function writeFile(filePath, xpathString, replaceString, newValueString) {
  const content = fs.readFileSync(filePath, "utf8");
  const document = new DOMParser().parseFromString(content);

  const nodes = xpath.select(xpathString, document);
  if (nodes.length === 0) {
    core.setFailed("No matching xml nodes found");
  } else {
    for (const node of nodes) {
      if (
        node.nodeType === XML_NODETYPE.ELEMENT_NODE &&
        replaceString !== null
      ) {
        const newNode = new DOMParser().parseFromString(replaceString);
        node.parentNode.replaceChild(newNode, node);
      }

      if (replaceString === null) {
        node.parentNode.removeChild(node);
      } else {
        if (newValueString.length == 0) {
          node.textContent = replaceString;
        } else {
          console.log(node.textContent, replaceString, newValueString);
          node.textContent = node.textContent.replace(
            replaceString,
            newValueString
          );
          console.log(node.textContent);
        }
      }
    }
    fs.writeFileSync(filePath, new XMLSerializer().serializeToString(document));
  }
}
