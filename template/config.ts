export const defaultConfig = {
  workingRootDir: 'gxen/',
  config: {
    generatedCodeRootDir: 'app/',
  },
  type: {
    rootDir: 'seed/',
    defaultTemplateFileRootDir: 'seed/tmpl/',
    defaultSettingFileRootDir: 'seed/yaml/',
  },
  code: {
    rootDir: 'template/',
  },
  extension: {
    settingExtention: '.yaml',
    generatedCodeExtention: '.ts',
    templateExtention: '.tmpl',
  }
} as IConfigFile

export interface IConfigFile {
  workingRootDir: string;
  config: {
    generatedCodeRootDir: string;
  };
  type: {
    rootDir: string;
    defaultTemplateFileRootDir: string;
    defaultSettingFileRootDir: string;
  };
  code: {
    rootDir: string;
    settingExtention: string;
  };
  extension: {
    templateExtention: string;
    settingExtention: string;
    generatedCodeExtention: string;
  }
}