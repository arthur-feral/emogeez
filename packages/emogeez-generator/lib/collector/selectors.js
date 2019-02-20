export const getCollectorDomain = state => state.collector;

export const getCollectorData = getCollectorDomain;
export const getEmojis = state => getCollectorDomain(state).emojis;
export const getCategories = state => getCollectorDomain(state).categories;
export const getCategoriesToFetch = state => getCollectorDomain(state).categoriesToFetch;
