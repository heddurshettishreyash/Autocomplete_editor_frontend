# 📝 Autocomplete Editor

A smart, user-friendly web-based editor that supports **autocomplete**, **syntax highlighting**, and **tooltip previews** for dynamic template-like variables using `${}` syntax.

🔗 **Live Demo**: [Autocomplete Editor on Render](https://autocomplete-editor-frontend.onrender.com)

---

## 🚀 Features

### ✅ Autocomplete on `${`
- Start typing `${` and the editor will automatically suggest predefined dynamic variables such as:
  - `first_name`
  - `last_name`
  - `middle_name`
- Use keyboard or mouse to select from the suggestion list.

### 🎨 Syntax Highlighting
- Once a variable is selected (e.g., `${first_name}`), it is styled with custom syntax highlighting.
- Makes dynamic placeholders visually distinct from regular text.

###  Smart Cleanup
- If you remove part of the `${...}` block (e.g., delete `{` or `}`), the entire dynamic block is automatically deleted.
- Keeps the editor clean and avoids broken variable syntax.

### 🛠 Tooltip on Hover
- Hover over any `${...}` block to see a **tooltip** showing the full variable or sample text inside the block.
- Useful for previewing variable content or meanings without editing.

---

## 🧑‍💻 Technologies Used

- **Frontend:** React
- **Backend:** Spring Boot, PostgreSQL  
- **Editor:** Ace Editor
- **Deployment:** Render

---



