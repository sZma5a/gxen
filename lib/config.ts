
import { stringify } from 'yaml';
import { defaultConfig, IConfigFile } from '../template/config';
import { ICoderConfig } from './code';
import { ITyperConfig } from './type';
import { Filer, IFiler } from "./utils/file";

export interface IConfig {
  coderConfig: ICoderConfig;
  typerConfig: ITyperConfig;
  initGxen(): void;
  getDirPath(path: string): string;
  getConfigPath(): string;
  getGeneratedCodePath(path: string): string;
}

export class Config implements IConfig {
  private static readonly settingFile = 'gxen.config.yaml';
  private readonly workingRootDir: string;
  private readonly generatedCodeRootDir: string;
  private readonly config: IConfigFile;

  public readonly coderConfig: ICoderConfig;
  public readonly typerConfig: ITyperConfig;

  constructor() {
    this.config = Filer.readYaml<IConfigFile>(Config.settingFile);
    this.workingRootDir = this.config.workingRootDir;
    this.generatedCodeRootDir = this.config.config.generatedCodeRootDir;
    this.coderConfig = {
      ...this.config.code,
      settingExtension: this.config.extension.settingExtention,
      generatedCodeExtension: this.config.extension.generatedCodeExtention,
    };
    this.typerConfig = {
      ...this.config.type,
      templateExtension: this.config.extension.templateExtention,
      settingExtention: this.config.extension.settingExtention,
    };
  }

  public initGxen(): void {
    for (const i of [this.config.type.rootDir, this.config.code.rootDir]) {
      const path = this.getDirPath(i);
      Filer.mkdir(path, true);
    }
  }
  
  public static initConfigFile(): void {
    if (Filer.exist(Config.settingFile)) {
      return;
    }
    Filer.writeYaml(Config.settingFile, defaultConfig, false, true);
  }

  public getDirPath(path: string): string {
    return this.workingRootDir + path;
  }

  public getConfigPath(): string {
    return this.workingRootDir + Config.settingFile;
  }

  public getGeneratedCodePath(path: string): string {
    return this.generatedCodeRootDir + path;
  }
}