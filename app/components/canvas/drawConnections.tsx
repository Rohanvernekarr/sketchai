import { Connection, SystemElement, Point } from "../../types";

function getBezier(start: Point, end: Point, curveAmount: number = 0.3) {
  const dx = end.x - start.x,
    dy = end.y - start.y;
  return [
    { x: start.x + curveAmount * dx, y: start.y },
    { x: end.x - curveAmount * dx, y: end.y },
  ];
}

export function drawConnection(
  ctx: CanvasRenderingContext2D,
  connection: Connection,
  systemElements: SystemElement[],
  hovered?: boolean
) {
  const from = systemElements.find((el) => el.id === connection.from);
  const to = systemElements.find((el) => el.id === connection.to);
  if (!from || !to) return;
  const fromCenter = {
    x: from.position.x + from.size.width / 2,
    y: from.position.y + from.size.height / 2,
  };
  const toCenter = {
    x: to.position.x + to.size.width / 2,
    y: to.position.y + to.size.height / 2,
  };
  // Curved connection line
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = hovered ? "#ffffff" : "#ffffff";
  ctx.lineWidth = hovered ? 4 : 2;
  if (connection.type === "dashed") ctx.setLineDash([8, 6]);
  else ctx.setLineDash([]);
  const [cp1, cp2] = getBezier(fromCenter, toCenter, 0.22);
  ctx.moveTo(fromCenter.x, fromCenter.y);
  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, toCenter.x, toCenter.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Arrowhead for directional
  if (["arrow", "bidirectional"].includes(connection.type)) {
    const angle = Math.atan2(
      toCenter.y - fromCenter.y,
      toCenter.x - fromCenter.x
    );
    const arrowLength = 13;
    ctx.beginPath();
    ctx.moveTo(toCenter.x, toCenter.y);
    ctx.lineTo(
      toCenter.x - arrowLength * Math.cos(angle - Math.PI / 7),
      toCenter.y - arrowLength * Math.sin(angle - Math.PI / 7)
    );
    ctx.moveTo(toCenter.x, toCenter.y);
    ctx.lineTo(
      toCenter.x - arrowLength * Math.cos(angle + Math.PI / 7),
      toCenter.y - arrowLength * Math.sin(angle + Math.PI / 7)
    );
    ctx.stroke();
  }
  ctx.restore();
}
