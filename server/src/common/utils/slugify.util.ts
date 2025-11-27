import slugify from 'slugify';

export class SlugifyUtil {
  static createSlug(name: string) {
    return slugify(name, { lower: true }) + '-' + crypto.randomUUID();
  }
}
