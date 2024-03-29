import * as fs from 'fs';
import glob from 'glob';
import { renderFile } from 'swig';
import { parse, stringify } from "yaml";

export interface IFiler { }

export class Filer implements IFiler {
  constructor() { }

  static mkdir(path: string, recursive?: boolean, existError?: true): void {
    if (Filer.exist(path)) {
      if (existError) {
        throw new Error(`path: ${path} already exists`);
      } else {
        return;
      }
    }
    fs.mkdirSync(path, { recursive: recursive });
  }

  static read(path: string): string {
    return fs.readFileSync(path, 'utf8');
  }

  static readYaml<T>(path: string): T {
    const data = parse(Filer.read(path));
    return data;
  }

  static readJson<T>(path: string): T {
    const data = JSON.parse(Filer.read(path));
    return data;
  }

  static write(path: string, content: string, recursiveDirectory?: boolean, existError?: boolean): void {
    if (Filer.exist(path)) {
      if (existError) {
        throw new Error(`path: ${path} already exists`);
      }
    }
    if (recursiveDirectory) {
      const dir = path.split('/');
      dir.pop();
      Filer.mkdir(dir.join('/'), true);
    }
    fs.writeFileSync(path, content, 'utf8');
  }

  static writeYaml(path: string, content: Object, recursiveDirectory?: boolean, existError?: boolean): void {
    const c = stringify(content);
    Filer.write(path, c, recursiveDirectory, existError);
  }

  static writeJson(path: string, content: Object, recursiveDirectory?: boolean, existError?: boolean): void {
    const c = JSON.stringify(content, null, 2);
    Filer.write(path, c, recursiveDirectory, existError);
  }

  static render<T>(templatePath: string, outputPath: string, properties: T, recursiveDirectory?: boolean, existError?: boolean) {
    const code = renderFile(templatePath, properties);
    Filer.write(outputPath, Filer.fixCode(code), recursiveDirectory, existError);
  }

  static exist(path: string): boolean {
    return fs.existsSync(path);
  }

  static fixCode(code: string) {
    const codeArray = code.split('\n');
    const fixedCode = codeArray.filter((c, i) => {
      if (c.trim() === '') {
        if (codeArray[i - 1]) {
          if (i > 0 && codeArray[i - 1].trim() === '' || codeArray[i - 1].trim().slice(-1) === ',') {
            return false;
          }
        }
      }
      return true;
    }).join('\n');
    return fixedCode;
  }

  static getFiles(path: string): string[] {
    return glob.sync(path+"/**/*");
  }
}