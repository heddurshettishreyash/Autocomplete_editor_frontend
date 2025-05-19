// export function setupCustomMode(editor, suggestions) {
//   if (!editor || !suggestions?.length) return;

//   const oop = ace.require("ace/lib/oop");
//   const JSMode = ace.require("ace/mode/javascript").Mode;
//   const JSRules = ace.require(
//     "ace/mode/javascript_highlight_rules"
//   ).JavaScriptHighlightRules;

//   function CustomHighlightRules() {
//     JSRules.call(this);

//     const names = suggestions.map((s) => s.variableName).join("|");
//     const fullRegex = new RegExp("(\\$\\{)(" + names + ")(\\})");

//     ["start", "jsx_expr", "template_string", "string"].forEach((state) => {
//       const rs = this.$rules[state];
//       if (!rs) return;
//       rs.unshift({
//         token: ["brackets.custom", "variable.custom", "brackets.custom"],
//         regex: fullRegex,
//       });
//     });

//     this.normalizeRules();
//   }
//   oop.inherits(CustomHighlightRules, JSRules);

//   function CustomMode() {
//     JSMode.call(this);
//     this.HighlightRules = CustomHighlightRules;
//   }
//   oop.inherits(CustomMode, JSMode);

//   editor.getSession().setMode(new CustomMode());

//   if (!document.getElementById("__ace_inline_styles")) {
//     const style = document.createElement("style");
//     style.id = "__ace_inline_styles";
//     style.textContent = `
//       .ace_variable.ace_custom {
//         color: #1abc9c !important;
//         font-weight: bold;
//       }
//       .ace_brackets.ace_custom {
//         color: #9999 !important;
//         font-weight: bold;
//       }
//     `;
//     document.head.appendChild(style);
//   }
// }

export function setupCustomMode(editor, suggestions) {
  if (!editor || !suggestions?.length) return;

  const oop = ace.require("ace/lib/oop");
  const JSMode = ace.require("ace/mode/javascript").Mode;
  const JSRules = ace.require(
    "ace/mode/javascript_highlight_rules"
  ).JavaScriptHighlightRules;

  function CustomHighlightRules() {
    JSRules.call(this);

    const names = suggestions.map((s) => s.variableName).join("|");
    const fullRegex = new RegExp("(\\$\\{)(" + names + ")(\\})");

    // This is where the change is needed
    const stringStates = [
      "string.quasi",
      "jsx_expr",
      "template_string",
      "string",
      "start",
    ];

    stringStates.forEach((state) => {
      if (!this.$rules[state]) return;

      // Find existing string rules and modify them
      for (let i = 0; i < this.$rules[state].length; i++) {
        const rule = this.$rules[state][i];

        // If it's a string rule or we're in a string state
        if (
          (rule.token &&
            typeof rule.token === "string" &&
            rule.token.includes("string")) ||
          state.includes("string") ||
          state === "jsx_expr"
        ) {
          // Add our custom highlighting as a higher priority rule
          this.$rules[state].unshift({
            token: ["brackets.custom", "variable.custom", "brackets.custom"],
            regex: fullRegex,
          });

          // Only add once per state
          break;
        }
      }

      // Also add to the beginning of the state rules to catch standalone patterns
      this.$rules[state].unshift({
        token: ["brackets.custom", "variable.custom", "brackets.custom"],
        regex: fullRegex,
      });
    });

    this.normalizeRules();
  }
  oop.inherits(CustomHighlightRules, JSRules);

  function CustomMode() {
    JSMode.call(this);
    this.HighlightRules = CustomHighlightRules;
  }
  oop.inherits(CustomMode, JSMode);

  editor.getSession().setMode(new CustomMode());

  if (!document.getElementById("__ace_inline_styles")) {
    const style = document.createElement("style");
    style.id = "__ace_inline_styles";
    style.textContent = ` 
      .ace_variable.ace_custom { 
        color: #1abc9c !important; 
        font-weight: bold; 
      } 
      .ace_brackets.ace_custom { 
        color: #9999 !important; 
        font-weight: bold; 
      } 
    `;
    document.head.appendChild(style);
  }
}
