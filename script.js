const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url)
  .then((data) => {

    const width = (d3.extent(data, (d) => d.Year).reduce((acc, current) => current - acc) + 1) * 40;
    const height = width * 9/16;
    const padding = {
      top: 200,
      right: 100,
      bottom: 200,
      left: 100
    };
    
    const xScale = d3.scaleTime()
      .domain([
        d3.min(data, (d) => new Date(d.Year - 1, 0, 1)),
        d3.max(data, (d) => new Date (d.Year + 1, 0, 1))
      ])
      .range([0, width]);
    
    const yScale = d3.scaleTime()
      .domain([
        d3.min(data,(d) => new Date(0,0,0,0,d.Time.split(':')[0],d.Time.split(':')[1])),
        d3.max(data,(d) => new Date(0,0,0,0,d.Time.split(':')[0],d.Time.split(':')[1]))
      ])
      .range([0, height]);

    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat("%M:%S"));
    
    const svg = d3.select('body')
      .append('svg')
      .attr('class', 'graph')
      .attr('width', padding.left + width + padding.right)
      .attr('height', padding.top + height + padding.bottom);

    svg
      .append('text')
      .attr('id', 'title')
      .attr('class', 'title')
      .attr('transform', 'translate(' + (padding.left + (width / 2)) + ',50)')
      .text('Doping in Professional Bicycle Racing')
      .style('font-size', '30px')
      .style('text-anchor', 'middle');
    
    svg
      .append('text')
      .attr('transform', 'translate(' + (padding.left + (width / 2)) + ',75)')
      .text('35 Fastest times up Alpe d\'Huez')
      .style('font-size', '20px')
      .style('text-anchor', 'middle');

    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(' + padding.left + ',' + (height + padding.top) + ')')
      .call(xAxis);
    
    svg
      .append('text')
      .attr('transform', 'translate(' + padding.left / 2 + ',' + (padding.top + 100) + ') rotate(-90)')
      .text('Time in Minutes')
      .style('font-size', '18px')
      .style('text-anchor', 'middle');

    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      .call(yAxis);

    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const color = d3.scaleOrdinal(d3.schemeSet1);

    svg
      .append('g')
      .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', (d) => new Date(d.Year, 0, 1).getFullYear())
      .attr('data-yvalue', (d) => new Date(0,0,0,0,d.Time.split(':')[0],d.Time.split(':')[1]).toISOString())
      .attr('r', 5)
      .attr('cx', (d) => xScale(new Date(d.Year, 0, 1)))
      .attr('cy', (d) => yScale(new Date(0,0,0,0,d.Time.split(':')[0],d.Time.split(':')[1])))
      .style('fill', (d) => color(d.Doping !== ''))
      .on('mouseover', (event, d) => {
        const content = 
          d.Name + ': ' + d.Nationality +
          '<br/>' +
          'Year: ' + new Date(d.Year, 0, 1).getFullYear() + ', Time: ' + d3.timeFormat("%M:%S")(new Date(0,0,0,0,d.Time.split(':')[0],d.Time.split(':')[1])) +
          (d.Doping ? '<br/><br/>' + d.Doping : '');

        tooltip
          .html(content)
          .attr('data-year', new Date(d.Year, 0, 1).getFullYear())
          .style('opacity', 0.9)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', (event, d) => {
          tooltip.style('opacity', 0);
      });

    const legendContainer = svg
      .append('g')
      .attr('id', 'legend')

    const legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', (d, i) => 'translate(' + padding.right + ',' + (padding.top + height / 2 - i * 20) + ')');

    legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text((d) => {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });
      
      
  })
  .catch((err) => console.error(err));