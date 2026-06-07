import * as migration_20260606_151455_init from './20260606_151455_init';
import * as migration_20260606_193528_drop_post_gallery from './20260606_193528_drop_post_gallery';

export const migrations = [
  {
    up: migration_20260606_151455_init.up,
    down: migration_20260606_151455_init.down,
    name: '20260606_151455_init',
  },
  {
    up: migration_20260606_193528_drop_post_gallery.up,
    down: migration_20260606_193528_drop_post_gallery.down,
    name: '20260606_193528_drop_post_gallery'
  },
];
