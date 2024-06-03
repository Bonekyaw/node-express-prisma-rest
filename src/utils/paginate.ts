const asyncHandler = require("express-async-handler");

export const offset = asyncHandler(
  async (
    model: any,
    page = 1,
    limit = 10,
    filters = null,
    order = null,
    fields = null,
    relation = null
  ) => {
    const offset = (page - 1) * limit;

    let options = { skip: offset, take: limit } as any;
    if (filters) {
      options.where = filters;
    }
    if (order) {
      options.orderBy = order;
    }
    if (fields) {
      options.select = fields;
    }
    if (relation) {
      options.include = relation;
    }

    let totalCount = {};
    if (filters) {
      totalCount = { where: filters };
    }

    const count = await model.count(totalCount);
    const results = await model.findMany(options);

    return {
      total: count,
      data: results,
      currentPage: page,
      previousPage: page == 1 ? null : page - 1,
      nextPage: page * limit >= count ? null : page + 1,
      lastPage: Math.ceil(count / limit),
      countPerPage: limit,
    };
  }
);

export const noCount = asyncHandler(
  async (
    model: any,
    page = 1,
    limit = 10,
    filters = null,
    order = null,
    fields = null,
    relation = null
  ) => {
    const offset = (page - 1) * limit;

    let options = { skip: offset, take: limit + 1 } as any;
    if (filters) {
      options.where = filters;
    }
    if (order) {
      options.orderBy = order;
    }
    if (fields) {
      options.select = fields;
    }
    if (relation) {
      options.include = relation;
    }

    const results = await model.findMany(options);
    let hasNextPage = false;
    if (results.length > limit) {
      // if got an extra result
      hasNextPage = true; // has a next page of results
      results.pop(); // remove extra result
    }

    return {
      data: results,
      currentPage: page,
      previousPage: page == 1 ? null : page - 1,
      nextPage: hasNextPage ? page + 1 : null,
      countPerPage: limit,
    };
  }
);

export const cursor = asyncHandler(
  async (
    model: any,
    cursor = null,
    limit = 10,
    filters = null,
    order = null,
    fields = null,
    relation = null
  ) => {
    let options = { take: limit } as any;
    if (cursor) {
      options.skip = 1;
      options.cursor = cursor;
    }
    if (filters) {
      options.where = filters;
    }
    if (order) {
      options.orderBy = order;
    }
    if (fields) {
      options.select = fields;
    }
    if (relation) {
      options.include = relation;
    }

    const results = await model.findMany(options);
    const lastPostInResults = results.length ? results[limit - 1] : null; // Remember: zero-based index! :)
    const myCursor = results.length ? lastPostInResults.id : null; 

    return {
      data: results,
      nextCursor: myCursor,
    };
  }
);