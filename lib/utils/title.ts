export interface ITitle { }

export class Title implements ITitle {
  public static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public static decapitalize(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  public static pascalize(str: string): string {
    return str.split('_').map((s) => Title.capitalize(s)).join('');
  }

  public static camelCase(str: string): string {
    return str.split('_').map((s, i) => i === 0 ? s : Title.capitalize(s)).join('');
  }

  public static snakeCase(str: string): string {
    return str.split(/(?=[A-Z])/).join('_').toLowerCase();
  }

  public static kebabCase(str: string): string {
    return str.split(/(?=[A-Z])/).join('-').toLowerCase();
  }

  public static pathCase(str: string): string {
    return str.split(/(?=[A-Z])/).join('/').toLowerCase();
  }

  public static constantCase(str: string): string {
    return str.split(/(?=[A-Z])/).join('_').toUpperCase();
  }

  public static dotCase(str: string): string {
    return str.split(/(?=[A-Z])/).join('.').toLowerCase();
  }

  public static sentenceCase(str: string): string {
    return str.split(/(?=[A-Z])/).join(' ').toLowerCase();
  }

  public static titleCase(str: string): string {
    return str.split(/(?=[A-Z])/).map((s, i) => i === 0 ? Title.decapitalize(s) : Title.capitalize(s)).join('');
  }

  public static getPathFromNamespace(namespace: string): string {
    if (namespace === '.') {
      return '';
    }
    return namespace.split('.').join('/');
  }

  public static getNameFromNamespace(namespace: string): string {
    if (namespace === '.') {
      return '';
    }
    return namespace.split('.').pop() as string;
  }
}