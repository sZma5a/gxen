export const defaultConfig = {
  config: {
    workingRootDir: 'gxen/',
  },
  type: {
    rootDir: 'seed/',
    defaultTemplateFileRootDir: 'seed/tmpl/',
    defaultSettingFileRootDir: 'seed/yaml/',
  },
  code: {
    rootDir: 'template/',
    generatedTestCodeRootDir: '__test__/',
    generatedCodeRootDir: 'app/',
  },
  extension: {
    settingExtension: '.yaml',
    generatedCodeExtension: '.ts',
    templateExtension: '.tmpl',
    testExtension: '.test',
  }
} as IConfigFile

export interface IConfigFile {
  config: {
    workingRootDir: string;
  };
  type: {
    rootDir: string;
    defaultTemplateFileRootDir: string;
    defaultSettingFileRootDir: string;
  };
  code: {
    rootDir: string;
    generatedTestCodeRootDir: string;
    generatedCodeRootDir: string;
  };
  extension: {
    templateExtension: string;
    settingExtension: string;
    generatedCodeExtension: string;
    testExtension: string;
  }
}