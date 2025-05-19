import ace from "ace-builds";
import { templateLiteralUtils } from "../utils/templateLiteralUtils.js";

export function setupAutocomplete(editor, suggestions) {
  if (!editor || suggestions.length === 0) return;

  const langTools = ace.require("ace/ext/language_tools");

  const customCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      //editor:current editor instance
      //session: current file/session being edited
      //pos:current cursor position
      //prefix:text typed before cursor
      //callback:calls autocomplete suggestions
      const isInTemplateLiteral =
        templateLiteralUtils.isInsideTemplateLiteral(editor);

      let filterText = prefix; //take text after ${na|  take na
      if (isInTemplateLiteral) {
        filterText = templateLiteralUtils.getFilterText(editor);
      }

      const lineUntilCursor = session.getLine(pos.row).substring(0, pos.column);
      const triggerAfterDollarBrace = lineUntilCursor.endsWith("${");
      const shouldShowCompletions =
        isInTemplateLiteral || triggerAfterDollarBrace;

      if (shouldShowCompletions) {
        callback(
          null,
          suggestions.map(function (suggestion) {
            const variableName = suggestion.variableName;
            const value = suggestion.value;
            return {
              caption: variableName + " - " + value, //What shows in the dropdown
              value: isInTemplateLiteral //	What gets inserted in the editor
                ? variableName
                : "${" + variableName + "}",
              meta: "variable", //A label like "variable", "method", etc.
              score: 2000, //	Higher = more priority
              completer: {
                //	A function to insert the value on selection
                insertMatch: function (editor, data) {
                  if (isInTemplateLiteral) {
                    templateLiteralUtils.replacePatternWithValue(
                      editor,
                      variableName
                    );
                  } else {
                    const cursor = editor.getCursorPosition();
                    const line = editor.session.getLine(cursor.row);
                    let start = cursor.column;

                    while (start > 0 && /\w/.test(line.charAt(start - 1)))
                      start--;

                    editor.session.replace(
                      {
                        start: { row: cursor.row, column: start },
                        end: cursor,
                      },
                      data.value
                    );

                    const newCursorColumn = start + data.value.length;
                    editor.moveCursorTo(cursor.row, newCursorColumn);
                    editor.clearSelection();
                  }
                },
              },
              //	Custom HTML to display in the dropdown
              renderHtml:
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                variableName +
                "</span>" +
                '<span  margin-left: 20px;">' +
                value +
                "</span>" +
                "</div>",
            };
          })
        );
      } else {
        callback(null, []);
      }
    },
  };

  langTools.addCompleter(customCompleter);

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
  });
}
