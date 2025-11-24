const fs = require('fs');
const path = require('path');

// Source and destination directories
const SVG_SOURCE_DIR = path.join(__dirname,  '..', '..' , 'undraw-svg-collection', 'svgs');
const OUTPUT_DIR = path.join(__dirname, '..' , 'registry', 'new-york', 'illustrations');

// for handling file names like 3DModels -> ThreeDModels
// Map of numbers to words
const numberToWord = {
  '0': 'Zero',
  '1': 'One',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine'
};

// Convert leading numbers to words
function convertLeadingNumbers(str) {
  // Replace leading digits with their word equivalents
  return str.replace(/^(\d+)/, (match) => {
    return match.split('').map(digit => numberToWord[digit]).join('');
  });
}

// Convert kebab-case to PascalCase
function toPascalCase(str) {
  // First convert any leading numbers to words
  str = convertLeadingNumbers(str);

  return str
    .split('-')
    .map(word => {
      // Convert leading numbers in each word part
      word = convertLeadingNumbers(word);
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

// Convert CSS property name from kebab-case to camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Parse CSS style string and convert to JSX style object
function parseStyleAttribute(styleString) {
  const styles = {};
  const declarations = styleString.split(';').filter(d => d.trim());

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map(s => s.trim());
    if (property && value) {
      const camelCasedProperty = toCamelCase(property);
      styles[camelCasedProperty] = value;
    }
  }

  return styles;
}

// Convert SVG attributes to camelCase for React
function convertSVGAttributes(content) {
  const attributeMap = {
    'stroke-width': 'strokeWidth',
    'stroke-miterlimit': 'strokeMiterlimit',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'fill-opacity': 'fillOpacity',
    'stroke-opacity': 'strokeOpacity',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-weight': 'fontWeight',
    'text-anchor': 'textAnchor',
    'text-decoration': 'textDecoration',
    'clip-path': 'clipPath',
    'clip-rule': 'clipRule',
    'fill-rule': 'fillRule',
  };

  Object.entries(attributeMap).forEach(([kebab, camel]) => {
    const regex = new RegExp(`\\s${kebab}="([^"]*)"`, 'g');
    content = content.replace(regex, ` ${camel}="$1"`);
  });

  return content;
}

// Convert isolation attributes to style format
function convertCSSAttributes(content) {
  // Handle isolation before style (with possible whitespace/attributes between)
  content = content.replace(
    /isolation="isolate"\s+([^>]*?)style="([^"]*)"/g,
    (match, between, styleValue) => {
      const newStyleValue = `isolation: isolate; ${styleValue}`;
      return `${between}style="${newStyleValue}"`;
    }
  );

  // Handle style before isolation (with possible whitespace/attributes between)
  content = content.replace(
    /style="([^"]*)"\s+([^>]*?)isolation="isolate"/g,
    (match, styleValue, between) => {
      const newStyleValue = `isolation: isolate; ${styleValue}`;
      return `style="${newStyleValue}"${between}`;
    }
  );

  // Convert remaining isolation attributes (no existing style) to style
  content = content.replace(
    /isolation="isolate"/g,
    'style="isolation: isolate"'
  );

  return content;
}

// Convert style attributes to JSX format
function convertStyleAttributes(content) {
  return content.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleObj = parseStyleAttribute(styleString);
    const styleEntries = Object.entries(styleObj)
      .map(([key, value]) => `${key}: "${value}"`)
      .join(', ');
    return `style={{${styleEntries}}}`;
  });
}

// Extract SVG attributes and content
function parseSVG(svgContent) {
  // Remove XML declaration if present
  svgContent = svgContent.replace(/<\?xml[^?]*\?>/g, '');

  // Extract viewBox from the SVG tag
  const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';

  // Extract the content between <svg> tags
  const contentMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  let innerContent = contentMatch ? contentMatch[1].trim() : '';

  // Convert SVG attributes to camelCase (before style conversion)
  innerContent = convertSVGAttributes(innerContent);

  // Convert isolation attributes to style format (before style conversion)
  innerContent = convertCSSAttributes(innerContent);

  // Convert style attributes to JSX format
  innerContent = convertStyleAttributes(innerContent);

  return { viewBox, innerContent };
}

// Generate React component
function generateComponent(fileName, svgContent) {
  const componentName = toPascalCase(fileName.replace('.svg', ''));
  const { viewBox, innerContent } = parseSVG(svgContent);
  const processedContent = innerContent;

  // Create a readable title from filename
  const title = fileName
    .replace('.svg', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `import { cn } from "@/lib/utils"
import { type SVGProps } from "react"

export interface ${componentName}Props extends SVGProps<SVGSVGElement> {}

export const ${componentName} = (props: ${componentName}Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${viewBox}"
      {...props}
      className={cn("w-full h-auto", props.className)}
      role="img"
    >
      <title>${title}</title>
      ${processedContent}
    </svg>
  )
}
`;
}

// Generate registry entry for a component
function generateRegistryEntry(fileName) {
  const title = fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    name: fileName,
    type: "registry:component",
    title: title,
    files: [
      {
        path: `registry/new-york/illustrations/${fileName}/${fileName}.tsx`,
        type: "registry:component"
      }
    ]
  };
}

// Main conversion function
async function convertAllSVGs() {
  try {
    // Read all SVG files
    const files = fs.readdirSync(SVG_SOURCE_DIR);
    const svgFiles = files.filter(file => file.endsWith('.svg')).sort();

    console.log(`Found ${svgFiles.length} SVG files to convert`);

    let converted = 0;
    let skipped = 0;
    let errors = 0;
    const registryItems = [];

    for (const file of svgFiles) {
      try {
        const fileName = file.replace('.svg', '');
        const componentName = toPascalCase(fileName);

        // Read SVG content
        const svgPath = path.join(SVG_SOURCE_DIR, file);
        const svgContent = fs.readFileSync(svgPath, 'utf-8');

        // Generate React component
        const componentCode = generateComponent(file, svgContent);

        // Create output directory
        const outputDir = path.join(OUTPUT_DIR, fileName);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write component file
        const outputPath = path.join(outputDir, `${fileName}.tsx`);
        fs.writeFileSync(outputPath, componentCode, 'utf-8');

        // Add to registry items
        registryItems.push(generateRegistryEntry(fileName));

        converted++;
        if (converted % 100 === 0) {
          console.log(`Converted ${converted}/${svgFiles.length} files...`);
        }
      } catch (err) {
        console.error(`Error converting ${file}:`, err.message);
        errors++;
      }
    }

    // Update registry.json in both locations
    console.log('\nUpdating registry.json...');
    const registry = {
      "$schema": "https://ui.shadcn.com/schema/registry.json",
      "name": "undraw-cn",
      "homepage": "https://undraw-cn.vaatun.com",
      "items": registryItems
    };

    // Update root registry.json
    const registryPath = path.join(__dirname, '..', 'registry.json');
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8');

    // Update public/r/registry.json
    const publicRegistryPath = path.join(__dirname, '..', 'public', 'r', 'registry.json');
    fs.mkdirSync(path.dirname(publicRegistryPath), { recursive: true });
    fs.writeFileSync(publicRegistryPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8');

    console.log('Registry updated successfully!');

    console.log('\nConversion complete!');
    console.log(`✓ Converted: ${converted}`);
    console.log(`✗ Errors: ${errors}`);
    console.log(`- Skipped: ${skipped}`);

  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

// Run the conversion
convertAllSVGs();
