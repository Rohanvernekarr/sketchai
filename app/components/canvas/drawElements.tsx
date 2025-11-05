import { SystemElement } from "../../types";

export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: SystemElement,
) {
  ctx.save();
  ctx.translate(element.position.x, element.position.y);
  ctx.shadowColor = !element.selected ? "rgba(0,0,0,0.0)" : "#19762";
  ctx.shadowBlur = element.selected ? 18 : 5;
  ctx.shadowOffsetY = 2;

  switch (element.type) {
    case "box":
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, element.size.width, element.size.height);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, element.size.width, element.size.height);
      break;

    case "database":
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 10, element.size.width, element.size.height - 20);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 10, element.size.width, element.size.height - 20);
      ctx.beginPath();
      ctx.ellipse(
        element.size.width / 2,
        10,
        element.size.width / 2,
        8,
        0,
        0,
        2 * Math.PI,
      );
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(
        element.size.width / 2,
        element.size.height - 10,
        element.size.width / 2,
        8,
        0,
        0,
        Math.PI,
      );
      ctx.stroke();
      break;

    case "server":
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, element.size.width, element.size.height);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, element.size.width, element.size.height);
      break;

    case "cloud":
      const grad = ctx.createRadialGradient(100, 80, 20, 100, 80, 80);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, "#cfd9df");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(60, 80, 30, 0, Math.PI * 2);
      ctx.arc(100, 60, 40, 0, Math.PI * 2);
      ctx.arc(140, 80, 30, 0, Math.PI * 2);
      ctx.arc(100, 100, 35, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#7f8c8d";
      ctx.lineWidth = 4;
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(60, 70, 80, 25);
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.strokeRect(60, 70, 80, 25);

      ctx.fillStyle = "#000000";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Cloud", 100, 88);
      break;

    case "user":
      ctx.fillStyle = "#2d2d2d";
      ctx.beginPath();
      ctx.arc(element.size.width / 2, 40, 35, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(element.size.width / 2, 25, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(element.size.width / 2, 55, 22, Math.PI, 0, false);
      ctx.stroke();
      break;

    case "api":
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, element.size.width, element.size.height);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, element.size.width, element.size.height);
      ctx.beginPath();
      ctx.moveTo(15, 15);
      ctx.lineTo(10, 15);
      ctx.lineTo(10, element.size.height - 15);
      ctx.lineTo(15, element.size.height - 15);
      ctx.moveTo(element.size.width - 15, 15);
      ctx.lineTo(element.size.width - 10, 15);
      ctx.lineTo(element.size.width - 10, element.size.height - 15);
      ctx.lineTo(element.size.width - 15, element.size.height - 15);
      ctx.stroke();
      break;
  }

  if (element.text) {
    ctx.fillStyle = "#ffffff";
    ctx.font = `${element.fontSize || 14}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(element.text, element.size.width / 2, element.size.height / 2);
  }

  if (element.selected) {
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(-7, -7, element.size.width + 14, element.size.height + 14);
    ctx.setLineDash([]);
  }
  ctx.restore();
}
