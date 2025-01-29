#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

// Domain models
class ComponentName {
    static validate(name) {
        if (!name) return { valid: false, message: 'Component name is required' };
        
        const isCamelCase = /^[a-z][a-zA-Z0-9]*$/.test(name);
        if (!isCamelCase) {
            return {
                valid: false,
                message: 'Component name must be camelCase',
                suggestion: this.convertToCamelCase(name)
            };
        }
        
        return { valid: true, value: name };
    }

    static convertToCamelCase(str) {
        return str
            .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
            .replace(/^([A-Z])/, c => c.toLowerCase());
    }

    static toDashCase(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
}

class ComponentGenerator {
    constructor(componentName, language = 'ts') {
        this.componentName = componentName;
        this.folderName = ComponentName.toDashCase(componentName);
        this.language = language;
    }

    generateTsContent() {
        return `
import { defineComponent } from "vue";

const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "${this.componentName}.component.html");
const htmlString = fs.readFileSync(htmlPath, { encoding: "utf8" });
const stylePath = path.join(__dirname, "${this.componentName}.component.style.html");
const styleString = fs.readFileSync(stylePath, { encoding: "utf8" });
const templateString = htmlString + styleString;

export const ${this.componentName} = defineComponent({
    props: {
        title: { type: String, default: "" },
    },
    template: templateString
});`.trim();
    }

    generateJsContent() {
        return `
import { defineComponent } from "vue";

const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "${this.componentName}.component.html");
const htmlString = fs.readFileSync(htmlPath, { encoding: "utf8" });
const stylePath = path.join(__dirname, "${this.componentName}.component.style.html");
const styleString = fs.readFileSync(stylePath, { encoding: "utf8" });
const templateString = htmlString + styleString;

export const ${this.componentName} = defineComponent({
    props: {
        title: {
            type: String,
            default: ""
        }
    },
    template: templateString
});`.trim();
    }

    generateHtmlContent() {
        return '<div>{{title}}</div>';
    }

    generateStyleContent() {
        return '<style></style>';
    }

    async create() {
        try {
            // Create component directory
            const dir = path.join(process.cwd(), this.folderName);
            
            if (fs.existsSync(dir)) {
                console.error(`${colors.red}❌ Error: Directory ${this.folderName} already exists${colors.reset}`);
                process.exit(1);
            }

            fs.mkdirSync(dir);
            console.log(`${colors.green}✓ Created directory: ${colors.reset}${this.folderName}`);

            // Create files
            const files = [
                {
                    name: `${this.componentName}.component.${this.language}`,
                    content: this.language === 'ts' ? this.generateTsContent() : this.generateJsContent()
                },
                {
                    name: `${this.componentName}.component.html`,
                    content: this.generateHtmlContent()
                },
                {
                    name: `${this.componentName}.component.style.html`,
                    content: this.generateStyleContent()
                }
            ];

            console.log('\n📝 Generating files:');
            for (const file of files) {
                fs.writeFileSync(path.join(dir, file.name), file.content);
                console.log(`${colors.green}✓ Created: ${colors.reset}${file.name}`);
            }
        } catch (error) {
            console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
            process.exit(1);
        }
    }
}

// CLI Application
function parseArgs() {
    const args = process.argv.slice(2);
    let componentName;
    let language = 'ts'; // default language

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-n' || args[i] === '--name') {
            componentName = args[i + 1];
        }
        if (args[i] === '-l' || args[i] === '--language') {
            const lang = args[i + 1]?.toLowerCase();
            if (lang === 'js' || lang === 'ts') {
                language = lang;
            } else {
                console.error(`${colors.red}Error: Invalid language. Use 'js' or 'ts'${colors.reset}`);
                process.exit(1);
            }
        }
    }

    return { componentName, language };
}

async function main() {
    try {
        const { componentName, language } = parseArgs();
        if (!componentName) {
            console.error(`${colors.red}Error: Component name is required. Use -n or --name flag.${colors.reset}`);
            console.log(`${colors.yellow}\nExample: node index.js -n myComponent${colors.reset}`);
            process.exit(1);
        }

        // Log initial parameters
        console.log('\n🚀 Starting Vue Component Generator...');
        console.log('----------------------------------------');
        console.log(`📝 Requested name: ${colors.blue}${componentName}${colors.reset}`);
        console.log(`🛠  Language: ${colors.blue}${language}${colors.reset}`);
        console.log('----------------------------------------\n');

        const validation = ComponentName.validate(componentName);
        
        if (!validation.valid) {
            console.warn(`${colors.yellow}⚠ Warning: ${validation.message}${colors.reset}`);
            
            if (validation.suggestion) {
                const suggestion = validation.suggestion;
                console.log(`${colors.blue}✓ Converting to: ${colors.green}${suggestion}${colors.reset}\n`);
                
                const generator = new ComponentGenerator(suggestion, language);
                await generator.create();
            } else {
                process.exit(1);
            }
        } else {
            const generator = new ComponentGenerator(componentName, language);
            await generator.create();
        }

        // Final success message
        console.log('\n✨ Generation Complete!');
        console.log('----------------------------------------');
        const componentPath = path.join(process.cwd(), ComponentName.toDashCase(componentName));
        console.log(`📁 Location: ${colors.green}${componentPath}${colors.reset}`);
        console.log(`📦 Component: ${colors.green}${ComponentName.toDashCase(componentName)}${colors.reset}`);
        console.log('----------------------------------------');
    } catch (error) {
        console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
        process.exit(1);
    }
}

main();