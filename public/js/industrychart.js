(function() {
  var Network, industryNetwork, lcid;

  Network = function() {
    var allData, appendChartTitle, appendColRects, appendEntname, appendLinks, appendNodes, appendRowRects, appendXAxis, appendYAxis, biggerH, calculateHeight, color, colrects, colrectsGroup, colswidth, container, deepCompany, deepNum, drawInvestment, entNameGroup, entindustryArr, entnames, height, heightRange, heightValues, hideDetails, img_h, img_w, investmentGroup, investments, linkedByIndex, links, linksGroup, maxRectHeight, maxValue, minRectHeight, minValue, multiple, neighboring, network, nodePosition, nodes, nodesGroup, paddingLeft, paddingTop, paddinginner, place, rectWidthValues, rowrects, rowrectsGroup, setupData, shiftValues, shiftx, shifty, showDetails, titles, width, widthRange, widthValues;
    container = null;
    allData = null;
    width = 0;
    height = 800;
    img_w = 40;
    img_h = 40;
    biggerH = 800;
    paddingTop = 20;
    paddingLeft = 80;
    paddinginner = 20;
    multiple = 1;
    titles = [];
    entindustryArr = [];
    deepCompany = [];
    deepNum = null;
    colrects = null;
    rowrects = null;
    nodes = null;
    links = null;
    entnames = null;
    investments = null;
    minValue = null;
    maxValue = null;
    minRectHeight = null;
    maxRectHeight = null;
    colrectsGroup = null;
    rowrectsGroup = null;
    nodesGroup = null;
    linksGroup = null;
    entNameGroup = null;
    investmentGroup = null;
    widthRange = d3.scale.linear().range([10, 60]);
    heightRange = d3.scale.linear();
    widthValues = d3.map();
    heightValues = d3.map();
    rectWidthValues = d3.map();
    nodePosition = d3.map();
    shiftValues = d3.map();
    shiftx = paddingLeft;
    shifty = 0;
    linkedByIndex = {};
    colswidth = 0;
    calculateHeight = 0;
    color = d3.scale.category20();
    network = function(selection, data) {
      allData = data;
      setupData(data);
      widthRange.domain([minValue, maxValue]).nice();
      titles.forEach(function(t) {
        return width += widthRange(widthValues.get(t)) * 2 + paddinginner * 2;
      });
      width += paddingLeft;
      heightRange.range([0, height / deepNum - (height / (deepNum * 5))]);
      container = d3.select(selection).append("svg:svg").attr("width", width + 200).attr("height", height + 200);
      appendChartTitle();
      appendColRects();
      appendRowRects();
      appendXAxis();
      appendYAxis();
      place();
      appendLinks();
      appendNodes();
      return appendEntname();
    };
    setupData = function(data) {
      var j, max, min, num, obj, ref;
      data.nodes.forEach(function(n) {
        if (titles.indexOf(n.entindustry) < 0) {
          titles.push(n.entindustry);
        }
        if (!deepNum || n.deep > deepNum) {
          deepNum = Number(n.deep);
        }
        if (!minValue) {
          minValue = Number(n.regcap);
        } else {
          if (Number(n.regcap) < minValue) {
            minValue = Number(n.regcap);
          }
        }
        if (!maxValue) {
          return maxValue = Number(n.regcap);
        } else {
          if (Number(n.regcap) > maxValue) {
            return maxValue = Number(n.regcap);
          }
        }
      });
      titles.forEach(function(title) {
        var max, min, obj;
        min = null;
        max = null;
        obj = {};
        obj.entindustry = title;
        obj.children = [];
        data.nodes.forEach(function(n) {
          if (n.entindustry === title) {
            obj.children.push(n);
            if (!min) {
              min = Number(n.regcap);
            } else {
              if (Number(n.regcap) < min) {
                min = Number(n.regcap);
              }
            }
            if (!max) {
              max = Number(n.regcap);
            } else {
              if (Number(n.regcap) > max) {
                max = Number(n.regcap);
              }
            }
            return widthValues.set(title, max);
          }
        });
        obj.minregcap = min;
        obj.maxregcap = max;
        return entindustryArr.push(obj);
      });
      for (num = j = 1, ref = deepNum; 1 <= ref ? j <= ref : j >= ref; num = 1 <= ref ? ++j : --j) {
        min = null;
        max = null;
        obj = {};
        obj.deep = num;
        obj.children = [];
        data.nodes.forEach(function(n) {
          var rowDomain;
          if (Number(n.deep) === num) {
            obj.children.push(n);
            if (!min) {
              min = Number(n.regcap);
            } else {
              if (Number(n.regcap) < min) {
                min = Number(n.regcap);
              }
            }
            if (!max) {
              max = Number(n.regcap);
            } else {
              if (Number(n.regcap) > max) {
                max = Number(n.regcap);
              }
            }
            rowDomain = {};
            rowDomain.min = min;
            rowDomain.max = max;
            return heightValues.set(n.deep, rowDomain);
          }
        });
        obj.minregcap = min;
        obj.maxregcap = max;
        deepCompany.push(obj);
      }
      return data.links.forEach(function(l) {
        return linkedByIndex[l.entsource + ", " + l.enttarget] = 1;
      });
    };
    appendChartTitle = function() {
      return container.append("svg:text").attr("text-anchor", "middle").attr("x", width / 2).attr("y", paddingTop).text("投资图");
    };
    appendColRects = function() {
      colrectsGroup = container.append("svg:g").attr("class", "colrects");
      colrects = colrectsGroup.selectAll("g").data(entindustryArr).enter().append("svg:g").attr("transform", function(d, i) {
        var r, sfx, sortr, sorttitle, title, w;
        title = !i ? titles[i] : titles[i - 1];
        r = widthRange(widthValues.get(title));
        w = (r + paddinginner) * 2;
        shiftx += !i ? 0 : w;
        shiftValues.set(d.entindustry, shiftx);
        sorttitle = titles[i];
        sortr = widthRange(widthValues.get(sorttitle));
        sfx = shiftx + sortr + paddinginner;
        rectWidthValues.set(d.entindustry, sfx);
        return "translate(" + shiftx + ", " + (paddingTop * 3) + ")";
      }).attr("fill", "#fff");
      colrects.append("svg:text").attr("class", "industrytitle").attr("y", -10).attr("transform", function(d) {
        return "translate(20) rotate(-10)";
      }).attr("fill", "#000").text(function(d) {
        return d.entindustry;
      });
      colrects.append("svg:rect").attr("class", "colrect").attr("width", function(d) {}).attr("height", height);
      return colrects.append("svg:line").attr("class", "colrectline").attr("x1", function(d) {
        return (widthRange(widthValues.get(d.entindustry)) + paddinginner) * 2;
      }).attr("y1", 0).attr("x2", function(d) {
        return (widthRange(widthValues.get(d.entindustry)) + paddinginner) * 2;
      }).attr("y2", height - paddingTop * 3);
    };
    appendXAxis = function() {
      return container.append("svg:g").attr("class", "x axis").append("svg:line").attr("x1", paddingLeft).attr("y1", paddingTop * 3).attr("x2", width).attr("y2", paddingTop * 3);
    };
    appendRowRects = function() {
      rowrectsGroup = container.append("svg:g").attr("class", "rowrects");
      rowrects = rowrectsGroup.selectAll("g").data(deepCompany).enter().append("svg:g").attr("fill", "#fff").attr("opacity", 0.5).attr("transform", function(d) {
        shifty += d.deep === 1 ? paddingTop * 3 : (height - paddingTop * 3) / deepNum;
        return "translate(" + paddingLeft + ", " + shifty + ")";
      });
      rowrects.append("svg:rect").attr("width", colswidth).attr("height", (height - paddingTop * 3) / deepNum);
      return rowrects.append("svg:line").attr("class", "rowrectline").attr("x1", function(d) {
        return 0;
      }).attr("y1", function(d) {
        return (height - paddingTop * 3) / deepNum;
      }).attr("x2", width - paddingLeft).attr("y2", function(d) {
        return (height - paddingTop * 3) / deepNum;
      });
    };
    appendYAxis = function() {
      var hmax, hmin, j, num, ref, results, yAxis;
      rowrects.append("svg:g").attr("class", function(d) {
        return "yaxis yaxis" + d.deep;
      });
      results = [];
      for (num = j = 1, ref = deepNum; 1 <= ref ? j <= ref : j >= ref; num = 1 <= ref ? ++j : --j) {
        hmin = heightValues.get(num).min / multiple;
        hmax = heightValues.get(num).max / multiple;
        heightRange.domain([0, hmax]);
        yAxis = d3.svg.axis().scale(heightRange).orient("left").ticks(5);
        results.push(rowrectsGroup.select('.yaxis' + num).call(yAxis));
      }
      return results;
    };
    place = function() {
      return allData.nodes.forEach(function(n) {
        var domainH, key, needH, obj, r, x, y;
        key = n.lcid;
        obj = {};
        x = rectWidthValues.get(n.entindustry);
        domainH = heightValues.get(n.deep);
        heightRange.domain([0, domainH.max / multiple]);
        needH = ((height - paddingTop * 3) / deepNum) * (Number(n.deep) - 1) + heightRange(Number(n.regcap) / multiple);
        y = needH + paddingTop * 3;
        r = widthRange(n.regcap);
        obj.x = x;
        obj.y = y;
        obj.r = r;
        return nodePosition.set(key, obj);
      });
    };
    appendNodes = function() {
      nodesGroup = container.append("svg:g").attr("class", "nodes");
      nodes = nodesGroup.selectAll("circle.industrynode").data(allData.nodes);
      return nodes.enter().append("circle").attr("class", "industrynode").attr("r", function(d) {
        var r;
        r = widthRange(Number(d.regcap));
        return r;
      }).attr("cx", function(d) {
        return nodePosition.get(d.lcid).x;
      }).attr("cy", function(d) {
        return nodePosition.get(d.lcid).y;
      }).on('mouseover', showDetails).on('mouseout', hideDetails);
    };
    showDetails = function(d, i) {
      var center, clearInvestment;
      nodes.style("stroke-width", function(n) {
        if (neighboring(d, n)) {
          return 5.0;
        } else {
          return 1.0;
        }
      });
      entnames.style('opacity', function(n) {
        if (neighboring(d, n)) {
          return 1.0;
        } else {
          return 0.0;
        }
      });
      links.style("stroke-width", function(n) {
        if (n.enttarget === d.lcid || n.entsource === d.lcid) {
          return 5.0;
        } else {
          return 1.0;
        }
      });
      center = {};
      center.x = nodePosition.get(d.lcid).x;
      center.y = nodePosition.get(d.lcid).y;
      center.r = nodePosition.get(d.lcid).r;
      clearInvestment = d.investment.filter(function(invest) {
        return !linkedByIndex[invest.entsource + ', ' + invest.enttarget];
      });
      return drawInvestment(center, clearInvestment);
    };
    hideDetails = function(d, i) {
      d3.select('.investments').remove();
      nodes.style("stroke-width", 2.0);
      entnames.style('opacity', 1.0);
      return links.style("stroke-width", 1.0);
    };
    neighboring = function(a, b) {
      return linkedByIndex[a.lcid + ', ' + b.lcid] || linkedByIndex[b.lcid + ', ' + a.lcid] || a.lcid === b.lcid;
    };
    appendEntname = function() {
      entNameGroup = container.append("svg:g").attr("class", "entnames");
      entnames = entNameGroup.selectAll("text.entname").data(allData.nodes);
      return entnames.enter().append('text').attr("class", 'entnametext').attr('x', function(d) {
        return nodePosition.get(d.lcid).x;
      }).attr('y', function(d) {
        return nodePosition.get(d.lcid).y;
      }).attr('transform', function(d) {
        var entnamewidth;
        entnamewidth = d.entname.length * 10;
        return "translate(" + (-entnamewidth / 2) + ", " + (-nodePosition.get(d.lcid).r - 10) + ")";
      }).text(function(d) {
        return d.entname;
      });
    };
    appendLinks = function() {
      linksGroup = container.append("svg:g").attr("class", "links");
      links = linksGroup.selectAll('line.line').data(allData.links);
      return links.enter().append('line').attr("class", "industrylink").attr("stroke", "#ddd").attr("x1", function(d) {
        if (nodePosition.get(d.entsource)) {
          return nodePosition.get(d.entsource).x;
        }
      }).attr("y1", function(d) {
        if (nodePosition.get(d.entsource)) {
          return nodePosition.get(d.entsource).y;
        }
      }).attr("x2", function(d) {
        if (nodePosition.get(d.enttarget)) {
          return nodePosition.get(d.enttarget).x;
        }
      }).attr("y2", function(d) {
        if (nodePosition.get(d.enttarget)) {
          return nodePosition.get(d.enttarget).y;
        }
      });
    };
    drawInvestment = function(center, investment) {
      var angle, radialLocation, radius, startangle;
      d3.select('.investments').remove();
      startangle = 0;
      angle = 360 / investment.length;
      radius = 100;
      radialLocation = function(center, angle, radius) {
        var x, y;
        x = center.x + radius * Math.cos(angle * Math.PI / 180);
        y = center.y + radius * Math.sin(angle * Math.PI / 180);
        return {
          "x": x,
          "y": y
        };
      };
      investment.forEach(function(obj) {
        var coordinate;
        coordinate = radialLocation(center, startangle, radius);
        obj.x = coordinate.x;
        obj.y = coordinate.y;
        return startangle += angle;
      });
      investmentGroup = container.append("svg:g").attr("class", "investments");
      investments = investmentGroup.selectAll("g.investment").data(investment);
      investments.enter().append("svg:g").insert('image').attr("class", "investmentimage").attr("width", img_w).attr("height", img_h).attr("x", function(d) {
        return d.x - img_w / 2;
      }).attr("y", function(d) {
        return d.y - img_h / 2;
      }).attr("xlink:href", '/img/grayman.png');
      investments.enter().append("svg:g").insert('text').attr("class", "investmentname").attr("x", function(d) {
        return d.x - d.entpre.length * 10 / 2;
      }).attr("y", function(d) {
        return d.y - img_h / 2 - 10;
      }).text(function(d) {
        return d.entpre;
      });
      investmentGroup.append("defs").append("marker").attr("id", "arrowhead").attr("refX", 4).attr("refY", 2).attr("markerWidth", 6).attr("markerHeight", 4).attr("orient", "auto").append("path").attr("d", "M 0,0 V 4 L6,2 Z");
      investments.selectAll("path").data(investment).enter().append("svg:path").attr("class", "link").attr("d", function(d) {
        return "M" + d.x + "," + d.y + " L" + center.x + "," + center.y;
      }).attr("marker-end", "url(#arrowhead)");
      return investments.exit().remove();
    };
    return network;
  };

  industryNetwork = Network();

  lcid = $('#entname').data('lcid');

  d3.json('/v1/api/analysis/' + lcid + '/industrychart', function(json) {
    var data, entname;
    data = json.data;
    entname = null;
    data.nodes.forEach(function(n) {
      if (n.deep === 1) {
        return entname = n.entname;
      }
    });
    $('#entname>h3').html(entname);
    return industryNetwork("#industrychart", data);
  });

}).call(this);
