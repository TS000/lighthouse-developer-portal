# [RFC] Entity Search Comparisons

## Summary

Site-wide search can make or break a website, and having a bad search experience can turn users off to use our application, in addition to making the overall view of the application negative.

Having a quick clean search that can return relevant searches can enhance a user's experience, in addition to helping users locate what they're searching for.

## Background

Backstage has a built-in [search plugin](https://backstage.io/docs/features/search/getting-started#docsNav) that supports [Lunr](https://lunrjs.com/), [ElasticSearch](https://www.elastic.co/what-is/elasticsearch), and [Postgres](https://www.educba.com/postgresql-text-search/). These search options are fine. However, other search optimization tools exist. Popular search optimization tools like Algolia and Postgresql Text Search could also be potential wins for assisting users in quickly locating what they need within the Lighthouse developer portal.

Provided search engine implementations have their way of constructing queries, which may be something you want to modify. Alterations to the querying logic of a search engine can be made by providing your implementation of a QueryTranslator interface. This modification can be done without touching provided search engines by using the exposed setter to set the modified query translator into the instance.

## Goal

To compare alternative search optimization options to provide the best possible search experience on the Lighthouse developer portal.

## Findings

### Algolia

https://www.algolia.com/

> Algolia is a hosted search engine, offering full-text, numerical, and faceted search, capable of delivering real-time results from the first keystroke. Algolia's powerful API lets you quickly and seamlessly implement search within your websites and mobile applications.

Algolia is a hosted SaaS (Software as a Service) option, which means that they handle the hosting of the indexing system and the storage of all the data themselves.

Pros:

- Supports multiple languages.
- Provides APIs and UI components for quickly building a usable search. (Customizable)
- Team members have previous experience working with Algolia.
- Detailed documentation and quick support for questions.
- Has a great developer view for quick management, updates to items, and views.
- Facetable search options.
- Has a free plan.

Cons:

- Not included within Backstage.
- Indexing multiple item types can be a pain.
- Price can go up if we exceed free plan limits. [Pricing](https://www.algolia.com/pricing/)

### Elastic Search

https://www.elastic.co/what-is/elasticsearch

[Backstage Elastic](https://backstage.io/docs/features/search/search-engines#elasticsearch)

> Elasticsearch is a distributed, free and open search and analytics engine for all types of data, including textual, numerical, geospatial, structured, and unstructured.

Elasticsearch is widely used and allows the developer fine-grained control down to the server level.

Pros:

- Included in Backstage by using a search plugin.
- Backstage supports ElasticSearch search engine connections, indexing, and querying out of the box.
- Available configuration options enable usage of either AWS or Elastic. co-hosted solutions, or a custom self-hosted solution.
- Lots of example configurations within backstage documentation.
- Other ElasticSearch instances can be connected to by using standard ElasticSearch authentication methods and exposed URL

Cons:

- ElasticSearch client version `7.x` is the only version confirmed to be supported.
- Requires additional configuration before it is ready to use within our instance.
- Can be complicated to set up.

### Lunr

https://lunrjs.com/

[Backstage Lunr](https://backstage.io/docs/features/search/search-engines#lunr)

> For web applications with all their data already sitting in the client, it makes sense to search that data on the client too. It saves adding extra, compacted services on the server. A local search index will be quicker, there is no network overhead, and will remain available and usable even without a network connection.

Lunr allows pre-building indexes to speed-up search on the client-side much quicker.

Pros:

- Included within Backstage search plugin and is the default search.
- Has a lot of built-in code existing on Backstage.
- Works without a network connection.
- Allows index pre-building to speed up client search.

Cons:

- Items are either indexed on the frontend.

### Postgres

https://www.educba.com/postgresql-text-search/

The Postgres based search engine only requires that Postgres be configured as the database engine for Backstage.

[Backstage Postgres](https://backstage.io/docs/features/search/search-engines#postgres)

Pros:

- Included within Backstage.
- Only requires that Postgres is the configured database engine for the Lighthouse developer portal.
- Provides decent results and performs well with ten thousand indexed documents.
- The connection to Postgres is established via the database manager, which is also used by other plugins.

Usage:

- Add a dependency on @backstage/plugin-search-backend-module-pg to your backend's package.json.
- Initialize the search engine. It is recommended to initialize it with a fallback to the Lunr search engine if you are running Backstage for development locally with SQLite:

```js
// In packages/backend/src/plugins/search.ts

// Initialize a connection to a search engine.
const searchEngine = (await PgSearchEngine.supported(database))
  ? await PgSearchEngine.from({ database })
  : new LunrSearchEngine({ logger });
```

## Recommendation

Using Lunr, ElasticSearch, or Postgres will be our best option for optimized search, assuming that items being searched for remain simple (Title or Body text search) and we don't have a ton of data to index. Backstage already has a lot of support for these three search optimizers, so it's a lot of work that we won't even have to do. Any tweaks or bug fixes should be easy to implement.

By default, Backstage uses Lunr as its primary search, and I think we should stick with it as it's worked reasonably well for us already. Backstage already loads a [pre-indexed](https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/IndexBuilder.ts) file when the app loads.

However, if we find that searching for items becomes more complicated (Tags, Teams, Ratings, usage, content, etc.) or grows to a number that causes pre-indexing to become slow, Algolia would be the preferred choice. Backstage doesn't currently support it; however, a few frontend developers have experience working with Algolia. It would be possible to write a nightly cron job that indexes all searchable content within the Lighthouse developer portal and create advanced search methods for priority searches and facet(like category) searches. Additionally, we would need to pay for Algolia, whereas the other options are free.

## References

- [algolia](https://www.algolia.com/)
- [algolia Docs](https://www.algolia.com/doc/)
- [Pricing](https://www.algolia.com/pricing/)

- [Elastic Search](https://www.elastic.co/what-is/elasticsearch)
- [Backstage Elastic](https://backstage.io/docs/features/search/search-engines#elasticsearch)

- [Lunr](https://lunrjs.com/)
- [Backstage Lunr](https://backstage.io/docs/features/search/search-engines#lunr)
- [Backstage IndexBuilder](https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/IndexBuilder.ts)

- [Postgres](https://www.educba.com/postgresql-text-search/)
- [Backstage Postgres](https://backstage.io/docs/features/search/search-engines#postgres)
