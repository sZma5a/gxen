export const defaultSettingFile = (type: string) => {
  return {
    name: `{{pascalName}}`,
    description: `this is {{pascalName}} code`,
    type: type,
    namespace: `{{namespace}}`,
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
  properties: any;
}