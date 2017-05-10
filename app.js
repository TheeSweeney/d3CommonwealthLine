var w = 850;
var h = 525;
var margin = {
  top: 100,
  bottom: 125,
  left: 40,
  right: 190
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
      .attr("id", "chart")
      .attr("width", w)
      .attr("height", h);
var chart = svg.append("g")
      .classed("display", true)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var x = d3.scale.linear()
          .domain([1980, 2014])
          .range([0, width])
var y = d3.scale.linear()
          .domain([0, 18])
          .range([height, 0])
var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom')
              .ticks(12)
              .tickSize(0)
              .tickFormat(function(d){
                return d.toString()
              })
var yAxis = d3.svg.axis()
              .scale(y)
              .orient('left')
var yGridlines = d3.svg.axis()
                  .scale(y)
                  .tickSize(-width, 0, 0)
                  .tickFormat('')
                  .orient('left')
var line = d3.svg.line()
            .x(function(d){
              return x(d.year)
            })
            .y(function(d){
              return y(d.value)
            })


function plotAxes(params){//TODO duplicated in ex4
  
  svg.insert('text')//Title
    .attr('x', 20)
    .attr('y', 40)
    .attr('id', 'chartTitle')
    .html("Health Care Spending as a Percentage of GDP, 1980-2014")
  
  d3.select('.display')//Note  TODO must be more efficient way to add multiline notes
    .append('text')
    .classed('note', true)
    .attr('x', -30)
    .attr('y', height + 70)
    .classed('alignLeft', true)
    .html('GDP refers to gross domestic product.')
  d3.select('.display')//Note
    .append('text')
    .classed('note', true)
    .attr('x', -30)
    .attr('y', height + 80)
    .classed('alignLeft', true)
    .html('Source: OECD Health Data 2016. Note: Australia, Germany, Japan, Netherlands and Switzerland data is for current spending only, and excludes spending on capital formation of health care')
  d3.select('.display')//Note
    .append('text')
    .classed('note', true)
    .attr('x', -30)
    .attr('y', height + 90)
    .classed('alignLeft', true)
    .html('providers.')

  this.append('g')
      .classed('gridline y', true)
      .attr('transform','translate(0,0)')
      .call(params.axis.gridlines)
  this.append('g')
      .classed('x axis', true)
      .attr('transform','translate(0,' + (height + 10)+ ')')
      .call(params.axis.x)
  this.append('g')
      .classed('y axis', true)
      .call(params.axis.y)

  this.select('.y.axis')//Top Label
        .append('text')
        .attr('x', 0)
        .attr('y',-20)
        .text('Percent')
}

function mouseOverFade(params){
    var countryName;
    params.country.includes(' ') ? countryName = params.country.replace(' ', ''): countryName = params.country

    if(!clicked.length){
      d3.selectAll('.trendline').style('stroke-opacity', '.1')
      d3.selectAll('.keyText').style('fill-opacity', '.1')
      d3.selectAll('.key').style('fill-opacity', '.1')
    
      d3.select('#' + countryName + 'line' ).style('stroke-opacity', '1')
      d3.select('#' + countryName + 'keyText' ).style('fill-opacity', '1')
      d3.select('#' + countryName + 'key' ).style('fill-opacity', '1')

      if(countryName.includes('1') || countryName.includes('2')){//if line is part of a split dataset
        var prefix = countryName.replace('1','').replace('2','')
        for(var i = 1; i < 3; i++){
          d3.select('#' + prefix + i + 'line').style('stroke-opacity', '1')
        }
      }
    } else if(!clicked.includes(countryName)){
      d3.select('#' + countryName + 'line' ).style('stroke-opacity', '.1')
      d3.select('#' + countryName + 'keyText' ).style('fill-opacity', '.1')
      d3.select('#' + countryName + 'key' ).style('fill-opacity', '.1')
    } else {
      d3.select('#' + countryName + 'line' ).style('stroke-opacity', '1')
      d3.select('#' + countryName + 'keyText' ).style('fill-opacity', '1')
      d3.select('#' + countryName + 'key' ).style('fill-opacity', '1')
    }
}

function mouseOutFade(d){
   if(!clicked.length){ 
    d3.selectAll('.trendline').style('stroke-opacity', '1')
       d3.selectAll('.keyText').style('fill-opacity', '1')
       d3.selectAll('.key').style('fill-opacity', '1')
     }
}

function infoHover(d, country){
  this.selectAll('#infoBubble')
    .data([d])
    .enter()
      .append('rect')
      .attr('x', function(d){
        return x(d.year) - 80;
      })
      .attr('y', function(d){
        return y(d.value) - 60;
      })
      .attr('rx', 5)
      .attr('ry', 5)        
      .attr('height', 50)
      .attr('width', 135)
      .attr('id', 'infoBubble')
      .classed( country + 'InfoBox', true)

  this.selectAll('#infoBubbleYear')
    .data([d])
    .enter()
      .append('text')
      .attr('x', function(d){
        return x(d.year) - 78;
      })
      .attr('y', function(d){
        return y(d.value) - 20;
      })  
      .attr('id', 'infoBubbleYear')
      .text(function(d){
        return d.year + ':';
      })
      .classed('infoBubbleData', true)

  this.selectAll('#infoBubbleGDP') 
    .data([d])
    .enter()
      .append('text')
      .attr('x', function(d){
        return x(d.year) - 50;
      })
      .attr('y', function(d){
        return y(d.value) - 20;
      })  
      .attr('id', 'infoBubbleGDP')
      .text(function(d){
        return d.value.toString().slice(0,5) + '%';
      })
      .classed('infoBubbleData', true)

}

function infoHoverOut(){
  this.selectAll('#infoBubble')
      .remove();
  this.selectAll('#infoBubbleGDP')
      .remove();
  this.selectAll('#infoBubbleYear')
      .remove();

}

var index = 0;
var clicked = [];
function plotKey(params){
  var countryName;
  params.country.includes(' ') ? countryName = params.country.replace(' ', ''): countryName = params.country
  if(!params.country.includes('2')){//build lines over


    this.selectAll('.key' + countryName)
        .data([params.data])
        .enter()
          .append('rect')
          .classed('key', true)
          .attr('id', countryName + 'key')
          .attr('y', index*12)
          .attr('x', width + 50)
          .attr('height', 2)
          .attr('width', 12)
          .on('mouseover', function(d, i){
            mouseOverFade.call(this, params);
          })
          .on('mouseout', function(d, i){
            mouseOutFade(d);
          })
          .on('click', function(d,i){
            clicked.includes(countryName) ? clicked.splice(clicked.indexOf(countryName), 1) : clicked.push(countryName);
            mouseOverFade.call(this, params, d)
          })

    this.selectAll('.keyText' + countryName)
        .data([params.data])
        .enter()
          .append('text')
          .classed('keyText', true)
          .attr('id', countryName + 'keyText')
          .attr('y', (index*12) + 5)
          .attr('x', width + 70)
          .text(function(){
            if(params.country.includes('1')){
              return params.country.replace('1','')
            }
            return params.country
          })
          .on('mouseover', function(d, i){
            mouseOverFade.call(this, params);
          })
          .on('mouseout', function(d, i){
            mouseOutFade(d);
          })
          .on('click', function(d,i){
            clicked.includes(countryName) ? clicked.splice(clicked.indexOf(countryName), 1) : clicked.push(countryName);
            mouseOverFade.call(this, params, d)
          })

  
    index++;
  }

}
function plotLineAndPoints(params){
    
  var countryName;
  params.country.includes(' ') ? countryName = params.country.replace(' ', ''): countryName = params.country
    //enter
  this.selectAll('.trendline' + countryName)
    .data([params.data])
    .enter()
      .append('path')
      .classed('trendline', true)
      .attr('id', countryName + 'line')
      .on('mouseover', function(d, i){
            mouseOverFade.call(this, params);
        })
      .on('mouseout', function(d, i){
        mouseOutFade(clicked);
      })


  this.selectAll('.points' + countryName)
    .data(params.data)
    .enter()
      .append('circle')
      .attr('r', 4)
      .classed(countryName + 'points point', true)
  //update
  this.selectAll('.trendline')
      .attr('d', function(d){
        return line(d)
      })
  this.selectAll('.point')
      .style('fill-opacity', '0')//keep the points hidden
      .attr('cx', function(d){
        return x(d.year)
      })
      .attr('cy', function(d){
        return y(d.value)
      })
      .on('mouseover', function(d){
            params.country = d3.select(this)[0][0].classList[0].slice(0, d3.select(this)[0][0].classList[0].length - 6);
            mouseOverFade.call(this, params);
            infoHover.call(chart, d, params.country)
        })
      .on('mouseout', function(){
        mouseOutFade(clicked);
        infoHoverOut.call(chart)
      })
}

function resize(){
  w = window.outerWidth - 50;
  h = .617647 * w - 50;

  width = w - margin.left - margin.right;
  height = h - margin.top - margin.bottom; 

  x = d3.scale.linear()
              .domain([1980, 2014])
              .range([0, width])
  y = d3.scale.linear()
              .domain([0, 18])
              .range([height, 0])
  xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .ticks(12)
                .tickSize(0)
                .tickFormat(function(d){
                  return d.toString()
                })
  yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')

  d3.select(this.node().parentNode)//resize SVG element
        .attr('height', h + 50)
        .attr('width', w)

  this.selectAll('g')//remove axes
      .remove();
  this.selectAll('.note')//remove notes and header
      .remove();
  // this.selectAll('.key')//remove key line
  //     .remove();
  // this.selectAll('.keyText')//remove key labels
  //     .remove();
  this.selectAll('.trendline')
      .remove();
  this.selectAll('.points')
      .remove();  
  
  plotAxes.call(chart, {
    axis: {
      x: xAxis,
      y: yAxis,
      gridlines: yGridlines
    }
  })

  for( var Country in data){
    plotLineAndPoints.call(chart, {//TODO factor out params obj? somewhat duplicated with plotAxes
      country: Country,
      data: data[Country],
      axis: {
        x: xAxis,
        y: yAxis
      }
    })

    // plotKey.call(chart, {
    //   country: Country,
    //   data: data[Country]
    // })
  }
}

resize.call(chart, {
  axis: {
    x: xAxis,
    y: yAxis,
    gridlines: yGridlines
  }
})

for( var Country in data){
  // plotLineAndPoints.call(chart, {//TODO factor out params obj? somewhat duplicated with plotAxes
  //   country: Country,
  //   data: data[Country],
  //   axis: {
  //     x: xAxis,
  //     y: yAxis
  //   }
  // })

  plotKey.call(chart, {
    country: Country,
    data: data[Country]
  })
}

window.addEventListener('resize', function(e){
  resize.call(chart)
})                  

