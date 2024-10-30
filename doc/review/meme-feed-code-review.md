There are several issues that could be improved.

#### FYI - Needed to add changes for meme-picture.tsx because `useDimensions` is deprecated in v2.8.2 and TS error is shown when starting project.

### The api calls blocking meme-feed loading.
Some possible improvements:
- Instead of one single `useQuery` with nested `for` loops it is more reasonable to introduce separate data loading with `useQueries` or `useInfiniteQuery`.
- Because there is a lot of data to load, UI/UX need some sort of *pagination* or *load more* scrolling.