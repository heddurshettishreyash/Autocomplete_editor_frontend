import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export function EditorSetup(editorDiv) {
  const editorElement = editorDiv || document.getElementById("editor");
  const editor = ace.edit(editorElement);

  editor.setTheme("ace/theme/textmate");
  editor.session.setMode("ace/mode/javascript");

  editor.setShowPrintMargin(false);
  editor.renderer.setShowGutter(false);
  editor.setHighlightActiveLine(false);

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: false,
    useWorker: false,
    wrap: false,
  });
  return editor;
}
