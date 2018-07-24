
var pointsX

function line ({context, valueY, width, height, rpx, lineColor = '#eeeeee'}) {
  var points = pointsX.slice(1)
  var width = width * rpx
  var height = height * rpx
  var eachSpacing = (width - 35) / 7
  var startX = 25;
  var valueYLength = height - 40
  context.beginPath()
  context.setStrokeStyle(lineColor)
  context.setLineWidth(4)
  context.moveTo(startX + 0.33 * eachSpacing, valueYLength - valueYLength * valueY[0] + 10)
  valueY.forEach(function(item, index) {
    if (index > 0) {
      context.lineTo(points[index - 1], valueYLength - valueYLength * item  + 10)
    }
  })
  context.stroke()

  context.setFillStyle(lineColor)
  valueY.forEach(function(item, index) {
    if ((index != valueY.length - 1 || valueY.length <= 7) && index > 0) {
      context.beginPath()
      context.arc(points[index - 1], valueYLength - valueYLength * item  + 10, 5, 0, 2 * Math.PI)
      context.fill()
    }
  })
}

function axisY ({context, width, height, axisY, rpx}) {
  var width = width * rpx
  var height = height * rpx
  var axisY = axisY
  var points = [];
  var eachSpacing = (height - 40) / (axisY.length)

  var startX = 25;
  var startY = height - 30;
  var endY = 10;

  var endX = 32; // 突起坐标
  axisY.forEach(function(item, index) {
    points.push(startY - (index + 0.5) * eachSpacing)
    points.push(startY - (index + 1) * eachSpacing)
  })
  console.log(points)
  context.beginPath()
  context.setStrokeStyle("#cccccc")
  context.setLineWidth(2)

  context.moveTo(startX, startY)
  context.lineTo(startX, endY)

  points.forEach(function(item, index) {
    if (index % 2 == 1) {
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
    context.fillText(item, startX - 5, points[index * 2 + 1]);
  })
  context.closePath()
  context.stroke()
}
function axisX ({context, width, height, axisX, rpx}) {
  var width = width * rpx
  var height = height * rpx
  var axisX = axisX
  var points = [];
  var eachSpacing = (width - 35) / (axisX.length - 1)

  var startX = 25;
  var startY = height - 30;
  var endX = width - 10;

  var endY = height - 37; // X突起坐标

  axisX.forEach(function(item, index) {
    points.push(startX + index * eachSpacing)
  })
  pointsX = points
  context.beginPath()
  context.setStrokeStyle("#cccccc")
  context.setLineWidth(2)

  context.moveTo(startX, startY)
  context.lineTo(endX, startY)
  points.forEach(function(item, index) {
    context.moveTo(item, startY)
    context.lineTo(item, endY)
  })
  context.closePath()
  context.stroke()

  context.beginPath()
  context.setFontSize(11)
  context.setFillStyle('#666666')
  context.setTextBaseline('top')
  context.setTextAlign('center')
  axisX.forEach(function(item, index) {
    context.fillText(item, points[index], startY + 5);
  })

  context.setFillStyle('#e1e1e1')
  context.setTextAlign('right')
  context.fillText('单位：天', points[points.length - 1], startY - 30)

  context.closePath()
  context.stroke()
}
module.exports = {
  axisX,
  axisY,
  line
}