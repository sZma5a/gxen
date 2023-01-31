
import { ISettingYaml } from "../template/type";
import { Config, IConfig } from "./config";
import { ITyper, Typer } from "./type";
import { Dummy } from "./utils/dummy";
import { Filer } from "./utils/file";

export interface ICoder {
  create(type: string, namespace: string): void;
  generate(namespace: string): void;
  getSettingFilePath(name: string): string;
  getCreateCodePath(namespace: string): string;
  getGeneratedCodePath(namespace: string): string;
  getSetting(namespace: string): ISettingYaml;
}

export interface ICoderConfig {
  rootDir: string;
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


  constructor(config: IConfig, typer: ITyper) {
    this.config = config;
    this.typer = typer;
    this.rootDir = config.coderConfig.rootDir;
    this.settingExtention = config.coderConfig.settingExtension;
    this.generatedCodeExtention = config.coderConfig.generatedCodeExtension;
    this.testExtension = config.coderConfig.testExtension;
  }

  public create(type: string, namespace: string): void {
    const pascalName = Coder.getPascalNameFromNamespace(namespace);
    Filer.render(
      this.typer.getDefaultSettingFilePath(type),
      this.getCreateCodePath(namespace),
      {pascalName, namespace},
      true,
      true,
    );
  }

  public generate(namespace: string): void {
    const config = this.getSetting(namespace);
    const properties = config.properties;
    const pascalName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
    properties.pascalName = pascalName;
    properties.namespacePath = Coder.getPathFromNamespace(namespace);
    for (const c of config.generate_files) {
      let path = '';
      properties.dummy = Dummy;
      let templatePath = '';
      if (c.test) {
        templatePath = this.typer.getTestTemplateFilePath(c.type);
        path = this.getGeneratedTestCodePath(c.namespace);
      } else {
        templatePath = this.typer.getDefaultTemplateFilePath(c.type);
        path = this.getGeneratedCodePath(c.namespace);
      }
      Filer.render(templatePath, path, properties, true, !c.remake);
    }
  }

  public getSettingFilePath(namespace: string): string {
    const path = this.rootDir + Coder.getPathFromNamespace(namespace) + this.settingExtention;
    return this.config.getDirPath(path)
  }

  public getCreateCodePath(namespace: string): string {
    const path = this.rootDir + namespace.split('.').join('/') + this.settingExtention;
    return this.config.getDirPath(path)
  }

  public getGeneratedCodePath(namespace: string): string {
    const path = Coder.getPathFromNamespace(namespace) + this.generatedCodeExtention;
    return this.config.getGeneratedCodePath(path);
  }

  public getGeneratedTestCodePath(namespace: string): string {
    const path = Coder.getPathFromNamespace(namespace) + this.testExtension + this.generatedCodeExtention;
    return this.config.getGeneratedTestCodePath(path);
  }

  private static getPathFromNamespace(namespace: string): string {
    return namespace.split('.').join('/');
  }

  public getSetting(namespace: string): ISettingYaml {
    const path = this.getSettingFilePath(namespace);
    return Filer.readYaml(path) as ISettingYaml;
  }

  public static getPascalNameFromNamespace(namespace: string): string {
    const name = namespace.split('.').pop() || '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}