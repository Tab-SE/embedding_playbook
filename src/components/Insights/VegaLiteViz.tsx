"use client";
import { useRef, useEffect } from 'react';
import { View, parse } from 'vega';
import { compile, TopLevelSpec } from 'vega-lite';
import { expressionFunction } from 'vega';
import { expressionInterpreter } from 'vega-interpreter';
import { Handler } from 'vega-tooltip';
import { v4 as uuid } from 'uuid';


// Register custom expression functions & manipulate spec configuration to activate formatting
const applyFormatConfig = (spec) => {
  const { customFormatterMaps } = spec;
  if (!customFormatterMaps) { return }
  const functionName = generateExpressionFunctionName();
  registerCustomFormatters(functionName, customFormatterMaps);
  _applyFormatConfig(spec, functionName);
}

// Generate expression function name
// NOTE: Must start with letter and only contain alphanumeric characters
const generateExpressionFunctionName = () => `chart${uuid().replace(/-/g, '')}`;

// Register vega-lite custom formatter functions using customFormatterMaps on spec
const registerCustomFormatters = (vizId, customFormatterMaps) => {
  expressionFunction(vizId, (datum, formatterName) => {
    const valueMap = customFormatterMaps[formatterName];
    if (!valueMap) {
      console.warn(`Unable to find custom formatter map for: '${formatterName}'`);
      return datum;
    }
    return valueMap[datum] || datum;
  });
}

function _applyFormatConfig(obj, formatterFunctionName) {
  for (var k in obj) {
    if (typeof obj[k] == 'object' && obj[k] !== null) {
      if (k === 'format' && 'custom' in obj[k]) {
        const { mapName } = obj[k];
        obj.format = mapName;
        obj.formatType = formatterFunctionName;
      }
      _applyFormatConfig(obj[k], formatterFunctionName);
    }
  }
}

export const VegaLiteViz = ({ spec, width, height, testId }: { spec: TopLevelSpec, width: string, height: string, testId?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const style = {
    width: width || '100%',
    height: height,
  };

  // Apply custom formatting config & expression functions
  useEffect(() => {
    applyFormatConfig(spec);
  }, [spec]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tooltip = new Handler({
      theme: 'custom',
    });

    const vegaSpec = compile(spec).spec;
    const runtimeSpec = parse(vegaSpec, undefined, { ast: true });
    const view = new View(runtimeSpec, {
      expr: expressionInterpreter,
      renderer: 'svg',
      container: containerRef.current,
      hover: true,
    });

    view.tooltip(tooltip.call);
    view.runAsync();

    return () => {
      view.finalize();
    };
  }, [spec]);

  return <div ref={containerRef} style={style} data-tb-test-id={testId} />;
};
