
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
  getGeneratedTestCodePath(path: string): string;
}

export class Config implements IConfig {
  private static readonly settingFile = 'gxen.config.yaml';
  private readonly workingRootDir: string;
  private readonly generatedCodeRootDir: string;
  private readonly generatedTestCodeRootDir: string;
  private readonly config: IConfigFile;

  public readonly coderConfig: ICoderConfig;
  public readonly typerConfig: ITyperConfig;

  constructor() {
    this.config = Filer.readYaml<IConfigFile>(Config.settingFile);
    this.workingRootDir = this.config.config.workingRootDir;
    this.generatedCodeRootDir = this.config.code.generatedCodeRootDir;
    this.generatedTestCodeRootDir = this.config.code.generatedTestCodeRootDir;
    this.coderConfig = {
      ...this.config.code,
      tmpDir: this.config.tmpDir,
      settingExtension: this.config.extension.settingExtension,
      generatedCodeExtension: this.config.extension.generatedCodeExtension,
      testExtension: this.config.extension.testExtension,
    };
    this.typerConfig = {
      ...this.config.type,
      templateExtension: this.config.extension.templateExtension,
      settingExtension: this.config.extension.settingExtension,
      testExtension: this.config.extension.testExtension,
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

  public getGeneratedTestCodePath(path: string): string {
    return this.generatedTestCodeRootDir + path;
  }
}