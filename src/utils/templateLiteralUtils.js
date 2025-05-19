export const templateLiteralUtils = {
  isInsideTemplateLiteral: function (editor) {
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();
    const line = session.getLine(cursor.row);
    //get current line cursor position
    const lineUntilCursor = line.substring(0, cursor.column);
    //if cursor is not inside ${
    const lastOpeningBrace = lineUntilCursor.lastIndexOf("${");
    if (lastOpeningBrace === -1) return false;
    //look for }  or not found then we may be inside ${ }
    const textAfterOpening = line.substring(lastOpeningBrace);
    const closingBracePos = textAfterOpening.indexOf("}");
    //true if inside${}
    return (
      closingBracePos === -1 ||
      closingBracePos + lastOpeningBrace >= cursor.column
    );
  },
  //get text after ${ ...
  getFilterText: function (editor) {
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();
    const line = session.getLine(cursor.row);
    const lineUntilCursor = line.substring(0, cursor.column);

    const lastOpeningBrace = lineUntilCursor.lastIndexOf("${");
    if (lastOpeningBrace === -1) return "";

    return lineUntilCursor.substring(lastOpeningBrace + 2);
  },

  //checks which pattern is activeACC12345
  getActivePatternStartPosition: function (editor) {
    const cursor = editor.getCursorPosition();
    const session = editor.getSession();
    const line = session.getLine(cursor.row);
    const lineUntilCursor = line.substring(0, cursor.column);

    const lastOpeningBrace = lineUntilCursor.lastIndexOf("${");
    if (lastOpeningBrace === -1) return null;

    return { row: cursor.row, column: lastOpeningBrace };
  },
  //checks for }
  findMatchingClosingBrace: function (editor, startPos) {
    const session = editor.getSession();
    const line = session.getLine(startPos.row);

    const textAfterOpening = line.substring(startPos.column);
    const closingBracePos = textAfterOpening.indexOf("}");

    if (closingBracePos === -1) return null;

    return { row: startPos.row, column: startPos.column + closingBracePos };
  },
  //replace text inside ${ ...} with value and place cursor at right pos
  replacePatternWithValue: function (editor, selectedValue) {
    const startPos = this.getActivePatternStartPosition(editor);
    if (!startPos) return;

    const cursor = editor.getCursorPosition();
    const session = editor.getSession();
    const cursorLine = session.getLine(cursor.row);

    const range = {
      start: { row: startPos.row, column: startPos.column + 2 },
      end: cursor,
    };

    editor.session.replace(range, selectedValue);

    const newCursorPos = {
      row: startPos.row,
      column: startPos.column + 2 + selectedValue.length,
    };

    const textAfterInsert = session
      .getLine(newCursorPos.row)
      .substring(newCursorPos.column);
    const nextClosingBrace = textAfterInsert.indexOf("}");

    if (
      nextClosingBrace === -1 ||
      textAfterInsert.substring(0, nextClosingBrace).trim() !== ""
    ) {
      editor.moveCursorTo(newCursorPos.row, newCursorPos.column);
      editor.insert("}");

      editor.moveCursorTo(newCursorPos.row, newCursorPos.column + 1);
    } else {
      editor.moveCursorTo(newCursorPos.row, newCursorPos.column);
    }
  },

  validateTemplateLiterals: function (editor) {
    const session = editor.getSession();
    const doc = session.getDocument();
    const lines = doc.getAllLines();
    const toRemove = [];

    lines.forEach((line, row) => {
      const openStack = [];
      const unmatchedClosings = [];

      // 1) Single‐pass scan to match ${ … } pairs
      for (let col = 0; col < line.length; col++) {
        // opening “${”
        if (line[col] === "$" && line[col + 1] === "{") {
          openStack.push(col);
          col++; // skip the '{'
        }
        // closing “}”
        else if (line[col] === "}") {
          if (openStack.length) {
            openStack.pop(); // matched one
          } else {
            unmatchedClosings.push(col);
          }
        }
      }

      // 2) Any unmatched “${” → remove from "${" through the identifier
      openStack.forEach((startCol) => {
        // find end of identifier: letters, digits or underscore
        let endCol = startCol + 2;
        while (endCol < line.length && /[\w]/.test(line[endCol])) {
          endCol++;
        }
        // remove from “${” up to that point
        toRemove.push({
          start: { row, column: startCol },
          end: { row, column: endCol },
        });
      });
    });

    //apply reverse sort and remove from right side
    toRemove
      .sort((a, b) => {
        if (a.start.row !== b.start.row) {
          return b.start.row - a.start.row;
        }
        return b.start.column - a.start.column;
      })
      .forEach((range) => session.remove(range));
  },

  findValidTemplateLiterals: function (text) {
    const regex = /\${[^{}]*}/g;
    const positions = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      positions.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }

    return positions;
  },
};
