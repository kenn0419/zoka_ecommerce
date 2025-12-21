import slugify from 'slugify';

export class SlugifyUtil {
  static createSlug(name: string) {
    if (!name) {
      name = '';
    }
    return slugify(name, { lower: true }) + '-' + crypto.randomUUID();
  }
}
