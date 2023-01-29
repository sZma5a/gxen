import { stringify } from "yaml";
import { defaultTemplateFile, defaultSettingFile } from "../template/type";
import { Filer } from "./utils/file";
import { Config, IConfig } from "./config";
import { renderFile } from 'swig';

export interface ITyper {
  create(name: string): void
  readConfig(name: string): string
  getDefaultTemplateFilePath(name: string): string
  getDefaultSettingFilePath(name: string): string
}

export interface ITyperConfig {
  defaultTemplateFileRootDir: string;
  defaultSettingFileRootDir: string;
  templateExtension: string;
  settingExtention: string;
}

export class Typer implements ITyper {
  private readonly defaultTemplateFileRootDir: string;
  private readonly defaultSettingFileRootDir: string;
  private readonly templateExtension: string;
  private readonly settingExtention: string;

  private readonly config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
    this.defaultTemplateFileRootDir = config.typerConfig.defaultTemplateFileRootDir;
    this.defaultSettingFileRootDir = config.typerConfig.defaultSettingFileRootDir;
    this.templateExtension = config.typerConfig.templateExtension;
    this.settingExtention = config.typerConfig.settingExtention;
  }

  public create(name: string): void {
    const yamlPath = this.getDefaultSettingFilePath(name);
    const templateFilePath = this.getDefaultTemplateFilePath(name);
    const yaml = defaultSettingFile(name);
    const tmpl = defaultTemplateFile;
    Filer.writeYaml(yamlPath, yaml, true, true);
    Filer.write(templateFilePath, tmpl, true, true);
  }

  public readConfig(name: string): string { 
    return Filer.read(this.getDefaultSettingFilePath(name));
  }

  public getDefaultTemplateFilePath(name: string): string {
    const path = this.defaultTemplateFileRootDir + name.split('.').join('/') + this.templateExtension;
    return this.config.getDirPath(path);
  }

  public getDefaultSettingFilePath(name: string): string {
    const path = this.defaultSettingFileRootDir + name.split('.').join('/') + this.settingExtention;
    return this.config.getDirPath(path);
  }
}