
import { ISettingYaml } from "../template/type";
import { Config, IConfig } from "./config";
import { ITyper, Typer } from "./type";
import { Dummy } from "./utils/dummy";
import { Filer } from "./utils/file";
import { Title } from "./utils/title";

export interface ICoder {
  create(type: string, namespace: string): void;
  generate(namespace: string, force: boolean): void;
  getSettingFilePaths(name: string): string[];
  getCreateCodePath(namespace: string): string;
  getGeneratedCodePath(namespace: string): string;
  getSettings(namespace: string): ISettingYaml[];
  replaceImport(properties: any, indexes: any[]): void;
}

export interface ICoderConfig {
  rootDir: string;
  tmpDir: string;
  settingExtension: string;
  generatedCodeExtension: string;
  testExtension: string;
}

export class Coder implements ICoder {
  private readonly rootDir: string;
  private readonly settingExtention: string;
  private readonly generatedCodeExtention: string;
  private readonly config: IConfig
  private readonly typer: ITyper;
  private readonly testExtension: string;
  private readonly fileLists: Object;
  private readonly fileListsPath: string;
  private readonly fileListsPathName: string = 'fileLists.json';

  constructor(config: IConfig, typer: ITyper) {
    this.config = config;
    this.typer = typer;
    this.rootDir = config.coderConfig.rootDir;
    this.settingExtention = config.coderConfig.settingExtension;
    this.generatedCodeExtention = config.coderConfig.generatedCodeExtension;
    this.testExtension = config.coderConfig.testExtension;
    this.fileListsPath = this.config.getDirPath(this.config.coderConfig.tmpDir) + this.fileListsPathName;
    if (!Filer.exist(this.fileListsPath)) {
      Filer.writeJson(this.fileListsPath, {}, true);
    }
    this.fileLists = Filer.readJson(this.fileListsPath) ?? {};
  }

  public create(type: string, namespace: string): void {
    const pascalName = Coder.getPascalNameFromNamespace(namespace);
    const dummy = Dummy;
    const titleUtils = Title;
    const typeArray = type.split('.');
    const namespacePart = namespace.split('.').map((n, i) => {
      if (n !== typeArray[i]) {
        return n;
      }
    }).filter(n => n !== undefined).join('.');
    Filer.render(
      this.typer.getDefaultSettingFilePath(type),
      this.getCreateCodePath(namespace),
      {pascalName, namespace, namespacePart, dummy, titleUtils},
      true,
      true,
    );
  }

  public updateProperties(namespace: string): any {
    const filepaths = this.fileLists[namespace];
    const properties = [];
    for (const filepath of filepaths) {
      const p = this.getSetting(filepath);
      properties.push({
        ...p.properties,
        pascalName: p.name.charAt(0).toUpperCase() + p.name.slice(1),
      });
    }
    return properties;
  }

  public generate(namespace: string, option: Object): void {
    const force = option['force'] ?? false;
    const configs = this.getSettings(namespace);
    for (const config of configs) {
      const properties = config.properties;
      const pascalName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
      for (const c of config.generate_files) {
        properties.pascalName = pascalName;
        properties.dummy = Dummy;
        properties.titleUtils = Title;
        if (c.update) {
          const name = c.namespace.split('.').pop();
          properties.pascalName = name.charAt(0).toUpperCase() + name.slice(1);
          properties.imports = this.updateProperties(c.namespace);
        }
        properties.namespace = c.namespace;
        properties.namespacePath = Coder.getPathFromNamespace(c.namespace);
        let path = '';
        let templatePath = '';
        if (c.test) {
          templatePath = this.typer.getTestTemplateFilePath(c.type);
          path = this.getGeneratedTestCodePath(c.namespace);
        } else {
          templatePath = this.typer.getDefaultTemplateFilePath(c.type);
          path = this.getGeneratedCodePath(c.namespace, c.extension);
        }
        if (c.remake || !Filer.exist(path) || force) {
          Filer.render(templatePath, path, properties, true, force ? false : !c.remake);
        }
      }
    }
    Filer.writeJson(this.fileListsPath, this.fileLists, true, false);
  }

  public getSettingFilePaths(namespace: string): string[] {
    const path = this.config.getDirPath(this.rootDir + Coder.getPathFromNamespace(namespace))
    if (Filer.exist(path + this.settingExtention)) {
      return [path + this.settingExtention]
    }
    return Filer.getFiles(path).filter((p) => p.endsWith(this.settingExtention));
  }

  public getCreateCodePath(namespace: string): string {
    const path = this.rootDir + namespace.split('.').join('/') + this.settingExtention;
    return this.config.getDirPath(path)
  }

  public getGeneratedCodePath(namespace: string, extension?: string): string {
    let ext = this.generatedCodeExtention;
    if (extension) {
      ext = extension;
    }
    const path = Coder.getPathFromNamespace(namespace) + ext;
    return this.config.getGeneratedCodePath(path);
  }

  public getGeneratedTestCodePath(namespace: string): string {
    const path = Coder.getPathFromNamespace(namespace) + this.testExtension + this.generatedCodeExtention;
    return this.config.getGeneratedTestCodePath(path);
  }

  private static getPathFromNamespace(namespace: string): string {
    if (namespace === '.') {
      return '';
    }
    return namespace.split('.').join('/');
  }

  public replaceImport(properties: any, indexes: any[]): any {
    let flag = false;
    for (const d in properties) {
      if (d === 'import') {
        const namespace = properties[d].split('.');
        const path = [];
        const datapath = [];
        let filepath = '';
        for (const n of namespace) {
          if (filepath === '' && Filer.exist(this.getCreateCodePath(path.join('.')))) {
            filepath = this.getCreateCodePath(path.join('.'));
          }
          if (filepath !== '') {
            datapath.push(n);
          } else {
            path.push(n);
          }
        }
        let data = this.getSetting(filepath);
        for (const d of datapath) {
          data = data[d];
        }
        // delete properties[d];
        properties[d] = data;
      }
      if (typeof properties[d] === 'object') {
        flag = true;
      }
      if (flag) {
        properties[d] = this.replaceImport(properties[d], indexes.concat([d]))
      }
    }
    return properties;
  }

  private getSetting(path: string): ISettingYaml {
    const data = Filer.readYaml<ISettingYaml>(path);
    for (const file of data.generate_files) {
      if (this.fileLists[file.namespace] === undefined) {
        this.fileLists[file.namespace] = [];
      }
      if (this.fileLists[file.namespace].indexOf(path) < 0) {
        this.fileLists[file.namespace].push(path);
      }
    }
    const properties = this.replaceImport(data.properties, []);
    data.properties = properties;
    return data;
  }

  public getSettings(namespace: string): ISettingYaml[] {
    const paths = this.getSettingFilePaths(namespace);
    return paths.map((p) => this.getSetting(p));
  }

  public static getPascalNameFromNamespace(namespace: string): string {
    const name = namespace.split('.').pop() || '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}