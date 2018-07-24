var pointsX
function axisY ({context, width, height, axisY, rpx}) {
  var width = width * rpx
  var height = height * rpx
  var axisY = axisY
  var points = [];
  var eachSpacing = (height - 40) / (axisY.length - 1)

  var startX = 50;
  var startY = height - 30;
  var endY = 10;

  var endX = 57; // 突起坐标
  axisY.forEach(function(item, index) {
    points.push(startY - (index) * eachSpacing)
    points.push(startY - (index + 0.5) * eachSpacing)
  })
  console.log(points)
  context.beginPath()
  context.setStrokeStyle("#cccccc")
  context.setLineWidth(2)

  context.moveTo(startX, startY)
  context.lineTo(startX, endY)

  points.forEach(function(item, index) {
    if (index % 2 == 0) {
      context.moveTo(startX, item)
      context.lineTo(endX, item)
    } else {
      context.moveTo(startX, item)
      context.lineTo(0.5 * (endX + startX), item)
    }
  })
  context.closePath()
  context.stroke()

  context.beginPath()
  context.setFontSize(11)
  context.setFillStyle('#666666')
  context.setTextBaseline('middle')
  context.setTextAlign('right')

  axisY.forEach(function(item, index) {
    context.fillText(item, startX - 5, points[(index) * 2]);
  })
  context.closePath()
  context.stroke()
}
function axisX ({context, width, height, axisX, rpx}) {
  var width = width * rpx
  var height = height * rpx
  var axisX = axisX
  var points = [];
  var eachSpacing = (width - 65 - 120) / (axisX.length + 1)

  var startX = 50;
  var startY = height - 30;
  var endX = width - 15;

  var endY = height - 37; // X突起坐标

  axisX.forEach(function(item, index) {
    points.push(startX + (index + 1) * eachSpacing + (2 * index + 1) * 20)
  })
  pointsX = points
  context.beginPath()
  context.setStrokeStyle("#cccccc")
  context.setLineWidth(2)

  context.moveTo(startX, startY)
  context.lineTo(endX, startY)
  context.lineTo(endX, endY)
  // points.forEach(function(item, index) {
  //   context.moveTo(item, startY)
  //   context.lineTo(item, endY)
  // })
  context.stroke()

  context.beginPath()
  context.setFontSize(11)
  context.setFillStyle('#666666')
  context.setTextBaseline('top')
  context.setTextAlign('center')
  axisX.forEach(function(item, index) {
    context.fillText(item, points[index], startY + 5);
  })

  context.closePath()
  context.stroke()
}
function drawBar ({context, width, height, valueY, rpx}) {
  var points = pointsX
  var width = width * rpx
  var height = height * rpx
  var startX = 50;
  var startY = height - 30;
  var valueYLength = height - 40



  for (let i = 0; i < valueY.length; i++) {
    context.beginPath()
    context.setLineWidth(40)
    context.setStrokeStyle(valueY[i].color)
    context.moveTo(points[i], startY)
    context.lineTo(points[i], startY - valueYLength * valueY[i].value)
    context.stroke()
  }
}
module.exports = {
  axisX,
  axisY,
  drawBar
}