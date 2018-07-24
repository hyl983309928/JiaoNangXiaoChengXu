
function drawRader({context, width, height, circleNum, rpx, axisY}) {
  var width = width * rpx
  var height = height * rpx

  var radius = width * 0.25 // 半径
  var centerX = 0.5 * width
  var centerY = 0.5 * height + 30
  context.setStrokeStyle('#eeeeee')
  context.setLineWidth(3)
  for (let i = 1; i <= circleNum; i++) {
    context.beginPath()
    context.arc(centerX, centerY, (i / circleNum) * radius, 0, 2 * Math.PI)
    context.stroke()
  }
  context.beginPath()
  context.setStrokeStyle('#eeeeee')
  context.setLineWidth(2)
  for (let i = 0; i < axisY.length; i++) {
    context.moveTo(centerX, centerY)
    context.setStrokeStyle('#eeeeee')
    context.setLineWidth(2)
    let angle = (2*Math.PI/axisY.length) * i
    let x = centerX +  -1 * Math.sin(angle) * radius
    let y = centerY + -1 * Math.cos(angle) * radius
    context.lineTo(x, y)
  }
  context.stroke()

  context.beginPath()
  context.setStrokeStyle('#42D1D9')
  context.setFillStyle('rgba(160, 232, 236, 0.4)')
  for (let i = 0; i < axisY.length; i++) {
    let angle = (2*Math.PI/axisY.length) * i
    let x = centerX +  -1 * Math.sin(angle) * radius * axisY[i].value
    let y = centerY + -1 * Math.cos(angle) * radius * axisY[i].value
    context.lineTo(x, y)
  }
  context.closePath()
  context.fill()
  context.stroke()
  context.setFillStyle('#42D1D9')
  for (let i = 0; i < axisY.length; i++) {
    context.beginPath()
    let angle = (2*Math.PI/axisY.length) * i
    let x = centerX +  -1 * Math.sin(angle) * radius * axisY[i].value
    let y = centerY + -1 * Math.cos(angle) * radius * axisY[i].value
    context.arc(x, y, 4, 0, 2*Math.PI)
    context.fill()
    context.closePath()
  }
  context.beginPath()
  for (let i = 0; i < axisY.length; i++) {
    let angle = (2*Math.PI/axisY.length) * i
    let x = centerX +  -1 * Math.sin(angle) * radius
    let y = centerY + -1 * Math.cos(angle) * radius
    context.setFillStyle(axisY[i].color)
    context.setStrokeStyle(axisY[i].color)
    context.setTextBaseline('bottom')
    context.setFontSize(28 * rpx)
    var textX = x
    var textY = y
    if (x > centerX) {
      textX += 20
      context.setTextAlign('left')
    } else if (x == centerX) {
      textY += 20 * rpx
      context.setTextAlign('center')
    } else {
      textX -= 20
      context.setTextAlign('right')
    }
    if (y > centerY) {
      textY += 20
    } else {
      textY -= 20
    }
    context.fillText(axisY[i].label, textX, textY)
    context.drawImage(axisY[i].url, x - axisY[i].imgX * rpx, y -  axisY[i].imgY * rpx, 60 * rpx, 60 * rpx)
  }
  context.closePath()
  context.stroke()
}

module.exports = {
  drawRader
}