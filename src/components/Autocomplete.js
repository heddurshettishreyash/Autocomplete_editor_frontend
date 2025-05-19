import { LitElement, html } from "lit";
import { FetchDataset } from "../services/FetchDataset.js";
import { EditorSetup } from "./EditorSetup.js";
import { outerEditorStyle, innerEditorStyle } from "../styles/editorStyles.js";
import { setupAutocomplete } from "../utils/SetupAutocomplete.js";
import { setupEditorBehavior } from "../utils/SetupEdiorBehaviour.js";
import { setupCustomMode } from "../utils/setupCustomMode.js";
import { setupTooltip } from "../utils/setupTooltip.js";

export default class Autocomplete extends LitElement {
  static properties = {
    suggestions: { type: Array },
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.suggestions = [];
  }

  async firstUpdated() {
    const editorDiv = this.renderRoot.querySelector(".editor");
    const editor = EditorSetup(editorDiv);
    try {
      const data = await FetchDataset();
      this.suggestions = data;
      setupAutocomplete(editor, this.suggestions);
      setupEditorBehavior(editor);
      setupCustomMode(editor, this.suggestions);
      setupTooltip(editor);
    } catch (error) {
      console.error("Error fetching dataset:", error);
    }
  }
  render() {
    return html`
      <div style="${outerEditorStyle}">
        <div class="editor" style="${innerEditorStyle}"></div>
      </div>
    `;
  }
}

customElements.define("autocomplete-editor", Autocomplete);
