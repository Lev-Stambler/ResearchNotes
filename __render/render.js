const fs = require("fs");
const path = require("path");

// const mdLatex = require("markdown-it-latex").default;
// enable everything
const { marked } = require("marked");

const markedKatex = require("marked-katex-extension");
function extractOutCommands(commandFile) {
  const latex = fs.readFileSync(commandFile, "utf8");
  let commands = [];
  let commandStartIndex = latex.indexOf("\\newcommand{");

  while (commandStartIndex !== -1) {
    let stack = [];
    let index = commandStartIndex + "\\newcommand".length;
    let seenCommandName = false;

    while (index < latex.length) {
      if (latex[index] === "{" && !isEscaped(latex, index)) {
        stack.push(index);
      } else if (latex[index] === "}" && !isEscaped(latex, index)) {
        if (stack.length > 0) {
          let startIndex = stack.pop();
          if (stack.length === 0) {
            if (seenCommandName) {
              let command = latex.substring(commandStartIndex, index + 1);
              commands.push(parseCommand(command));
              seenCommandName = false;
              break;
            } else {
              seenCommandName = true;
            }
          }
        }
      }
      index++;
    }

    commandStartIndex = latex.indexOf("\\newcommand{", index);
  }
  console.log(commands);
  return commands;
}

function isEscaped(string, index) {
  let slashes = 0;
  while (string[index - 1] === "\\" && index > 0) {
    slashes++;
    index--;
  }
  // If the number of consecutive slashes is odd, the brace is escaped
  return slashes % 2 !== 0;
}

function parseCommand(commandString) {
  const nameRegex = /\\newcommand\{\\(\w+)\}/;
  let nameMatch = nameRegex.exec(commandString);
  let name = nameMatch ? nameMatch[1] : null;

  // Start after the full match of the name to find the definition
  let definitionStartIndex = nameMatch.index + nameMatch[0].length;
  let definition = null;

  // console.log(commandString, commandString.length, definitionStartIndex);
  // Find the first non-escaped opening brace after the command name
  while (
    definitionStartIndex < commandString.length &&
    (commandString[definitionStartIndex] !== "{" ||
      isEscaped(commandString, definitionStartIndex))
  ) {
    definitionStartIndex++;
  }
  console.log(commandString.length, definitionStartIndex);

  if (definitionStartIndex < commandString.length) {
    let stack = [definitionStartIndex]; // Push the index of the opening brace
    let index = definitionStartIndex + 1; // Start searching after the opening brace

    while (index < commandString.length) {
      if (commandString[index] === "{" && !isEscaped(commandString, index)) {
        stack.push(index);
      } else if (
        commandString[index] === "}" &&
        !isEscaped(commandString, index)
      ) {
        let lastIndex = stack.pop();
        if (stack.length === 0) {
          // We found the matching closing brace
          definition = commandString.substring(definitionStartIndex + 1, index);
          break;
        }
      }
      index++;
    }
  }

  return {
    name: name,
    definition: definition,
  };
}

/**
 *
 * @param {string} file_path
 * @returns
 */
const createPdf = (file_path) => {
  return (async () => {
    const p = path.join(__dirname, "../", file_path);
    const preamblePath = path.join(__dirname, "../", "preamble.tex");
    console.log(preamblePath);
    const commands = extractOutCommands(preamblePath);
    const macros = {};
    commands.forEach((command) => {
      macros["\\" + command.name] = command.definition;
    });

    const options = {
      throwOnError: false,
      globalGroup: true,
      macros,
    };
    marked.use(markedKatex(options));

    if (!p.endsWith(".md")) {
      throw new Error("File is not a markdown file");
    }
    const content = fs.readFileSync(p, "utf8");
    // console.log(md.render(content), cssLatex);
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
	<script src="https://cdn.jsdelivr.net/npm/marked/lib/marked.umd.js"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
</head>
	<body>
	   <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

		<div>
		${marked.parse(content)}
		</div>
		</body>
</html>`;
    const htmlPath = file_path.replace(new RegExp(".md$"), ".html");
    fs.writeFileSync(htmlPath, html);

    // const pdf = await mdToPdf({ path: p }).catch(console.error);
    // if (pdf) {
    //   fs.writeFileSync(
    //     file_path.replace(new RegExp(".md$"), ".pdf"),
    //     pdf.content
    //   );
    // }
  })();
};

if (process.argv.length > 2) {
  createPdf(process.argv[2]);
} else {
  throw new Error("No path provided");
}
