import { test, expect } from '@playwright/test';

test('Test {{archetype.plugin.name}}', async ({ page }) => {
  await page.goto('/test/playwright/ol/{{archetype.plugin.id}}-ol.html');
  await page.evaluate(() => {
    const map = IDEE.map({
      container: 'mapjs',
    });
    window.mapjs = map;

    const mp = new IDEE.plugin.{{archetype.plugin.name}}({
      position: 'right',
      collapsed: true,
      order: 0,
      tooltip: 'Plantilla',
    });
    window.mp = mp;

    map.addPlugin(mp);
  });

  const nPlugins = await page.evaluate(() => window.mapjs.getPlugins().length);
  expect(nPlugins).toBe(1);
});
