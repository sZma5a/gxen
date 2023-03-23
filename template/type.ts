export const defaultSettingFile = (type: string) => {
  return {
    name: `{{pascalName}}`,
    description: `this is {{pascalName}} code`,
    generate_files: [
      {
        type: type,
        namespace: `{{namespace}}`,
        remake: true,
      },
      {
        type: type,
        namespace: `{{namespace}}`,
        test: true,
        remake: true,
      }
    ],
    properties: {
      required: true
    },
  } as ISettingYaml;
}

export const defaultTemplateFile = `
This is tmplate
We can use 
for 
if
`;

export interface ISettingYaml {
  name: string;
  description: string;
  type: string;
  namespace: string;
  generate_files: IGenerateFile[];
  properties: any;
}

export interface IGenerateFile {
  type: string;
  namespace: string;
  test?: boolean;
  remake?: boolean;
  update?: boolean;
  extension?: string;
}
