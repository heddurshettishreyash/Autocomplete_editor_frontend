import { templateLiteralUtils } from "../utils/templateLiteralUtils.js";
export function setupEditorBehavior(editor) {
  if (!editor) return;

  let lastEditorContent = editor.getValue();
  let validTemplatePositions = [];

  editor.commands.on("afterExec", function (e) {
    if (e.command.name === "insertstring") {
      const isInTemplateLiteral =
        templateLiteralUtils.isInsideTemplateLiteral(editor);

      if (
        e.args === "{" &&
        editor.session
          .getLine(editor.getCursorPosition().row)
          .endsWith("${", editor.getCursorPosition().column)
      ) {
        editor.execCommand("startAutocomplete");
      } else if (isInTemplateLiteral && /[a-zA-Z0-9_]/.test(e.args)) {
        editor.execCommand("startAutocomplete");
      }
    }
  });

  editor.getSession().on("change", function (e) {
    setTimeout(() => {
      const currentContent = editor.getValue();

      const oldValidTemplates = validTemplatePositions;
      const newValidTemplates =
        templateLiteralUtils.findValidTemplateLiterals(currentContent);

      validTemplatePositions = newValidTemplates;

      if (
        oldValidTemplates.length > 0 &&
        oldValidTemplates.length !== newValidTemplates.length
      ) {
        templateLiteralUtils.validateTemplateLiterals(editor);
      }

      lastEditorContent = currentContent;
    }, 0);
  });

  editor.commands.addCommand({
    name: "preventNewLine",
    bindKey: { win: "Enter", mac: "Enter" },
    exec: function (editor) {
      editor.preventDefault = true;
      return false;
    },
    readOnly: true,
  });

  editor.container.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}
