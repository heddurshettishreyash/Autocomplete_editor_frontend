export function setupTooltip(editor) {
  if (!editor) return;

  const tooltip = document.createElement("div");
  tooltip.className = "ace-tooltip";

  Object.assign(tooltip.style, {
    position: "absolute",
    zIndex: "1000",
    backgroundColor: "#ffffff",
    border: "1px solid black",
    borderRadius: "4px",
    fontSize: "14px",
    lineHeight: "2",
    fontFamily: "Menlo, Monaco, 'Courier New', monospace",
    fontWeight: "400",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "300px",
    whiteSpace: "pre-wrap",
    display: "none",
    pointerEvents: "none",
  });

  document.body.appendChild(tooltip);

  editor.container.addEventListener("mousemove", (e) => {
    const renderer = editor.renderer;
    const pos = renderer.screenToTextCoordinates(e.clientX, e.clientY);
    const session = editor.getSession();
    const token = session.getTokenAt(pos.row, pos.column);

    if (token) {
      const line = session.getLine(pos.row);
      tooltip.textContent = line;

      tooltip.style.top = `${e.pageY + 15}px`;
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.display = "block";
    } else {
      tooltip.style.display = "none";
    }
  });

  editor.container.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });

  return tooltip;
}
