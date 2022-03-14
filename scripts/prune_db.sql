-- Remove duplicates from search table
SELECT count(*) FROM search;
CREATE TABLE search_distinct
AS
(SELECT DISTINCT *
FROM
search);
BEGIN;
DROP TABLE search;
ALTER TABLE search_distinct RENAME TO search;
COMMIT;
SELECT count(*) FROM search;

-- Remove duplicates from relations table
SELECT count(*) FROM relations;
CREATE TABLE relations_distinct
AS
(SELECT DISTINCT *
FROM
relations);
BEGIN;
DROP TABLE relations;
ALTER TABLE relations_distinct RENAME TO relations;
COMMIT;
SELECT count(*) FROM relations;