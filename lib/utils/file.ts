import * as fs from 'fs';
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
    return parse(Filer.read(path));
  }

  static write(path: string, content: string, recursiveDirectory?: boolean, existError?: boolean): void {
    if (Filer.exist(path)) {
      if (existError) {
        throw new Error(`path: ${path} already exists`);
      } else {
        return;
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

  static render<T>(templatePath: string, outputPath: string, properties: T, recursiveDirectory?: boolean, existError?: boolean) {
    const code = renderFile(templatePath, properties);
    Filer.write(outputPath, code, recursiveDirectory, existError);
  }

  static exist(path: string): boolean {
    return fs.existsSync(path);
  }

  static getFileList(path: string) {}
}