type pluginManifestTypes = {
  title: string;
  description: string;
  url: string;
  image: string;
  tags: Array<string>;
};

/**
 * Add any plugins/tools to the pluginManifest that should be found within the
 * plugins page.
 */
export const pluginManifest: pluginManifestTypes[] = [
         {
           title: 'Starter Guide',
           description:
             "Start here if you're new to the Lighthouse developer portal!",
           url: '/starter-guide',
           image: '',
           tags: ['getting-started', 'doc'],
         },
         {
           title: 'Feature-Flags',
           description:
             'Allows users to toggle client-side features on the Lighthouse developer portal',
           url: '/feature-flags',
           image: '',
           tags: ['feature-flag'],
         },
         {
           title: 'Provider Dashboard',
           description:
             'Dashboard offers a set of tools to view/manage provider configurations, specifications, and automated test results.',
           url: '/provider-dashboard',
           image: '',
           tags: ['dashboard'],
         },
         {
           title: 'Tech Radar',
           description:
             'Tech Radar is a list of technologies, complemented by an assessment result, called ring assignment.',
           url: '/tech-radar',
           image:
             'https://storage.googleapis.com/wf-blogs-engineering-media/2018/09/fe13bb32-wf-tech-radar-hero-1024x597.png',
           tags: ['standards', 'landscape'],
         },
       ];
